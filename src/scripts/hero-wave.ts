// Hero background: a top-down field of light tiles that ripple where the pointer goes,
// with soft shadows between the steps. Each tile is the top of a tall box that rises and
// sinks with rings spreading from the pointer's trail; left alone, a soft ring starts
// now and then. The camera leans a little toward the pointer. Rendering pauses when the
// hero is off screen or the tab is hidden; reduced motion draws one frame.
// index.astro loads this after the page shows, so Three.js never holds up the text.
// Adapted from 3D Wave Grid by franky-adl (MIT, see THIRD_PARTY_NOTICES.md).
import {
  ACESFilmicToneMapping,
  AmbientLight,
  BoxGeometry,
  Color,
  DirectionalLight,
  InstancedBufferAttribute,
  InstancedMesh,
  MeshDepthMaterial,
  MeshPhongMaterial,
  Object3D,
  PCFShadowMap,
  PerspectiveCamera,
  Plane,
  RGBADepthPacking,
  Raycaster,
  Scene,
  Vector2,
  Vector3,
  WebGLRenderer,
  type IUniform,
} from 'three';
import { EffectComposer } from 'three/addons/postprocessing/EffectComposer.js';
import { OutputPass } from 'three/addons/postprocessing/OutputPass.js';
import { RenderPass } from 'three/addons/postprocessing/RenderPass.js';
import { ShaderPass } from 'three/addons/postprocessing/ShaderPass.js';

// A tile's size on screen (CSS px), and its size and spacing in the scene.
const TILE_PX = 76;
const TILE = 0.8;
const PITCH = 0.81;
// The boxes run deep below the surface; only their tops move.
const DEPTH = 3;
const FOV = 40;
// How many points of the pointer's trail send out rings at once.
const TRAIL = 64;
// Rings: how fast they spread (units/s), their wavelength, how wide the moving band is,
// how high the tiles go, how much each tile's sampling spot is shifted, and how long a
// ring takes to fade (s).
const WAVE = { speed: 6, freq: 1.2, width: 3, amp: 0.4, max: 0.4, jitter: 0.2, fade: 2 };
// Raised tiles take on the accent's teal, a step lighter so it reads on light tiles.
const CREST = '#00a383';

type Shader = { uniforms: Record<string, IUniform>; vertexShader: string; fragmentShader: string };

export function initHeroWave(): void {
  const canvas = document.querySelector<HTMLCanvasElement>('.hero-canvas');
  const hero = canvas?.parentElement;
  if (!canvas || !hero) return;

  let renderer: WebGLRenderer;
  try {
    renderer = new WebGLRenderer({ canvas, antialias: true });
  } catch {
    return; // No WebGL2: the hero keeps its plain background.
  }
  renderer.toneMapping = ACESFilmicToneMapping;
  renderer.toneMappingExposure = 1.95;
  renderer.shadowMap.enabled = true;
  renderer.shadowMap.type = PCFShadowMap;

  const still = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const small = window.matchMedia('(pointer: coarse)').matches;

  const scene = new Scene();
  scene.background = new Color('#ffffff').multiplyScalar(0.5);
  const camera = new PerspectiveCamera(FOV, 1, 0.1, 200);
  camera.up.set(0, 0, -1);

  // A low key light from the left casts the soft shadows; a fill light lifts the far sides.
  scene.add(new AmbientLight(0xffffff, 0.5));
  const key = new DirectionalLight(0xffffff, 4);
  key.position.set(-20, 10, 6);
  key.castShadow = true;
  key.shadow.mapSize.set(small ? 1024 : 2048, small ? 1024 : 2048);
  key.shadow.radius = 6;
  key.shadow.bias = 0.0001;
  key.shadow.camera.near = 0.1;
  key.shadow.camera.far = 80;
  scene.add(key);
  const fill = new DirectionalLight(0xffffff, 1);
  fill.position.set(10, 5, -3);
  scene.add(fill);

  // The trail: x, z, start time and strength of each ring.
  const trail = new Float32Array(TRAIL * 4);
  let trailCount = 0;
  const shared = {
    uTrail: { value: trail },
    uTrailCount: { value: 0 },
    uTime: { value: 0 },
  };

  // Moves the tops of the boxes, in both the colour pass and the shadow pass.
  const lift = (shader: Shader) => {
    Object.assign(shader.uniforms, shared, { uCrest: { value: new Color(CREST) } });
    shader.vertexShader = shader.vertexShader
      .replace('#include <common>', `#include <common>
        attribute vec2 aOffset;
        uniform vec4 uTrail[${TRAIL}];
        uniform int uTrailCount;
        uniform float uTime;
        varying float vLift;
        vec2 hash2(vec2 p) {
          p = vec2(dot(p, vec2(127.1, 311.7)), dot(p, vec2(269.5, 183.3)));
          return fract(sin(p) * 43758.5453123) - 0.5;
        }`)
      .replace('#include <begin_vertex>', `#include <begin_vertex>
        vLift = 0.0;
        if (position.y > 0.0) {
          // Each tile samples the wave at a slightly shifted spot, so the steps look hand-laid.
          vec2 spot = aOffset + hash2(aOffset) * ${WAVE.jitter.toFixed(2)};
          float wave = 0.0;
          float weight = 0.0;
          for (int i = 0; i < ${TRAIL}; i++) {
            if (i >= uTrailCount) break;
            vec4 t = uTrail[i];
            float age = uTime - t.z;
            float dist = length(spot - t.xy);
            float rel = dist - ${WAVE.speed.toFixed(1)} * age;
            float w = exp(-rel * rel / ${(WAVE.width * WAVE.width).toFixed(1)}) * exp(-age / ${WAVE.fade.toFixed(1)}) / (1.0 + dist * 0.1) * t.w;
            wave += w * cos(${WAVE.freq.toFixed(2)} * rel);
            weight += w;
          }
          // Overlapping rings average out instead of piling up.
          wave /= max(weight, 1.0);
          float d = clamp(wave * ${WAVE.amp.toFixed(2)}, -${WAVE.max.toFixed(2)}, ${WAVE.max.toFixed(2)});
          transformed.y += d;
          vLift = d;
        }`);
    if (shader.fragmentShader.includes('#include <color_fragment>')) {
      shader.fragmentShader = shader.fragmentShader
        .replace('#include <common>', `#include <common>
          varying float vLift;
          uniform vec3 uCrest;`)
        .replace('#include <color_fragment>', `#include <color_fragment>
          diffuseColor.rgb = mix(diffuseColor.rgb, uCrest, smoothstep(0.0, 1.0, vLift / ${WAVE.max.toFixed(2)}));`);
    }
  };

  const material = new MeshPhongMaterial({ color: 0xffffff });
  material.onBeforeCompile = lift;
  // Shadow maps store depth packed into RGBA; a custom depth material has to match.
  const depth = new MeshDepthMaterial({ depthPacking: RGBADepthPacking });
  depth.onBeforeCompile = lift;

  // The field: enough tiles to fill the hero with room for the camera's lean. Rebuilt
  // only when the hero grows past it.
  let mesh: InstancedMesh | null = null;
  let cols = 0;
  let rows = 0;
  const build = (needCols: number, needRows: number) => {
    if (mesh && needCols <= cols && needRows <= rows) return;
    if (mesh) {
      scene.remove(mesh);
      mesh.geometry.dispose();
      mesh.dispose();
    }
    cols = needCols;
    rows = needRows;
    const geometry = new BoxGeometry(TILE, DEPTH, TILE);
    const offsets = new InstancedBufferAttribute(new Float32Array(cols * rows * 2), 2);
    geometry.setAttribute('aOffset', offsets);
    mesh = new InstancedMesh(geometry, material, cols * rows);
    mesh.customDepthMaterial = depth;
    mesh.castShadow = true;
    mesh.receiveShadow = true;
    const dummy = new Object3D();
    for (let i = 0; i < cols; i++) {
      for (let j = 0; j < rows; j++) {
        const index = i * rows + j;
        const x = (i - (cols - 1) / 2) * PITCH;
        const z = (j - (rows - 1) / 2) * PITCH;
        dummy.position.set(x, 0, z);
        dummy.updateMatrix();
        mesh.setMatrixAt(index, dummy.matrix);
        offsets.setXY(index, x, z);
      }
    }
    scene.add(mesh);
    const reach = (Math.max(cols, rows) * PITCH) / 2 + 2;
    Object.assign(key.shadow.camera, { left: -reach, right: reach, top: reach, bottom: -reach });
    key.shadow.camera.updateProjectionMatrix();
  };

  // A slight colour split and darkening toward the edges.
  const edges = new ShaderPass({
    uniforms: { tDiffuse: { value: null } },
    vertexShader: 'varying vec2 vUv; void main() { vUv = uv; gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0); }',
    fragmentShader: `uniform sampler2D tDiffuse; varying vec2 vUv;
      void main() {
        float edge = smoothstep(0.3, 0.6, distance(vUv, vec2(0.5)));
        vec2 shift = sign(vUv - 0.5) * 0.005 * edge;
        vec3 c = vec3(texture2D(tDiffuse, vUv + shift).r, texture2D(tDiffuse, vUv).g, texture2D(tDiffuse, vUv - shift).b);
        gl_FragColor = vec4(c * (1.0 - edge * 0.5), 1.0);
      }`,
  });
  const composer = new EffectComposer(renderer);
  composer.addPass(new RenderPass(scene, camera));
  composer.addPass(edges);
  composer.addPass(new OutputPass());

  // The camera sits high enough that a tile is about TILE_PX across, and leans with the pointer.
  let height = 12;
  const lean = { x: 0, y: 0 };
  const leanTo = { x: 0, y: 0 };
  const place = () => {
    const a = lean.y * Math.PI * 0.03;
    const b = lean.x * Math.PI * 0.05;
    camera.position.set(-height * Math.cos(a) * Math.sin(b), height * Math.cos(a) * Math.cos(b), height * Math.sin(a));
    camera.lookAt(0, 0, 0);
  };

  const resize = () => {
    const w = canvas.clientWidth;
    const h = canvas.clientHeight;
    const ratio = Math.min(window.devicePixelRatio || 1, 1.5);
    renderer.setPixelRatio(ratio);
    renderer.setSize(w, h, false);
    composer.setPixelRatio(ratio);
    composer.setSize(w, h);
    camera.aspect = w / h;
    camera.updateProjectionMatrix();
    height = ((h / TILE_PX) * PITCH) / (2 * Math.tan(((FOV / 2) * Math.PI) / 180)) + DEPTH / 2;
    build(Math.ceil(w / TILE_PX) + 10, Math.ceil(h / TILE_PX) + 10);
  };

  const add = (x: number, z: number, strength: number, now: number) => {
    if (trailCount === TRAIL) {
      trail.copyWithin(0, 4);
      trailCount--;
    }
    trail.set([x, z, now, strength], trailCount * 4);
    trailCount++;
  };
  // Drops rings that have faded out.
  const prune = (now: number) => {
    let keep = 0;
    for (let i = 0; i < trailCount; i++) {
      if (now - trail[i * 4 + 2] < WAVE.fade * 4) {
        trail.copyWithin(keep * 4, i * 4, i * 4 + 4);
        keep++;
      }
    }
    trailCount = keep;
  };

  const render = (now: number) => {
    shared.uTime.value = now;
    shared.uTrailCount.value = trailCount;
    place();
    composer.render();
  };

  resize();
  render(0);
  canvas.classList.add('is-ready');
  new ResizeObserver(() => {
    resize();
    render(performance.now() / 1000);
  }).observe(canvas);
  if (still) return;

  // The pointer leaves a ring at each step along the surface, stronger for longer steps.
  const raycaster = new Raycaster();
  const pointer = new Vector2();
  const surface = new Plane(new Vector3(0, 1, 0), -DEPTH / 2);
  const hit = new Vector3();
  let last: { x: number; z: number } | null = null;
  let moved = -Infinity;
  let idle = 0;
  hero.addEventListener('pointermove', (event) => {
    const box = hero.getBoundingClientRect();
    pointer.set(((event.clientX - box.left) / box.width) * 2 - 1, -((event.clientY - box.top) / box.height) * 2 + 1);
    leanTo.x = pointer.x;
    leanTo.y = pointer.y;
    raycaster.setFromCamera(pointer, camera);
    if (!raycaster.ray.intersectPlane(surface, hit)) return;
    const now = performance.now() / 1000;
    const step = last ? Math.hypot(hit.x - last.x, hit.z - last.z) : 0;
    if (last && step < 0.25) return;
    add(hit.x, hit.z, Math.min(step, 1.2), now);
    last = { x: hit.x, z: hit.z };
    moved = now;
  });
  hero.addEventListener('pointerleave', () => {
    leanTo.x = 0;
    leanTo.y = 0;
    last = null;
  });

  let visible = true;
  let frame = 0;
  const loop = (ms: number) => {
    const now = ms / 1000;
    lean.x += (leanTo.x - lean.x) * 0.04;
    lean.y += (leanTo.y - lean.y) * 0.04;
    prune(now);
    // Left alone for a while, a soft ring starts somewhere near the middle.
    if (now - moved > 3 && now - idle > 1.5) {
      idle = now;
      const span = (Math.min(cols, rows) * PITCH) / 4;
      add((Math.random() - 0.5) * span * 2, (Math.random() - 0.5) * span * 2, 0.8 + Math.random() * 0.2, now);
    }
    render(now);
    frame = requestAnimationFrame(loop);
  };
  const toggle = () => {
    cancelAnimationFrame(frame);
    if (visible && !document.hidden) frame = requestAnimationFrame(loop);
  };
  new IntersectionObserver(([entry]) => {
    visible = entry.isIntersecting;
    toggle();
  }).observe(hero);
  document.addEventListener('visibilitychange', toggle);
}
