// Hero background: a WebGL dot-matrix "aura" that glows around a light point.
// The light drifts slowly and leans toward the pointer. Rendering pauses when
// the hero is off screen or the tab is hidden; reduced motion draws one frame.

const FRAGMENT_SHADER = `
precision highp float;
uniform vec2 uRes;
uniform float uTime;
uniform vec2 uLight;
uniform float uCell;

vec3 permute(vec3 x) { return mod(((x * 34.0) + 1.0) * x, 289.0); }

float snoise(vec2 v) {
	const vec4 C = vec4(0.211324865405187, 0.366025403784439, -0.577350269189626, 0.024390243902439);
	vec2 i = floor(v + dot(v, C.yy));
	vec2 x0 = v - i + dot(i, C.xx);
	vec2 i1 = (x0.x > x0.y) ? vec2(1.0, 0.0) : vec2(0.0, 1.0);
	vec4 x12 = x0.xyxy + C.xxzz;
	x12.xy -= i1;
	i = mod(i, 289.0);
	vec3 p = permute(permute(i.y + vec3(0.0, i1.y, 1.0)) + i.x + vec3(0.0, i1.x, 1.0));
	vec3 m = max(0.5 - vec3(dot(x0, x0), dot(x12.xy, x12.xy), dot(x12.zw, x12.zw)), 0.0);
	m = m * m;
	m = m * m;
	vec3 x = 2.0 * fract(p * C.www) - 1.0;
	vec3 h = abs(x) - 0.5;
	vec3 ox = floor(x + 0.5);
	vec3 a0 = x - ox;
	m *= 1.79284291400159 - 0.85373472095314 * (a0 * a0 + h * h);
	vec3 g;
	g.x = a0.x * x0.x + h.x * x0.y;
	g.yz = a0.yz * x12.xz + h.yz * x12.yw;
	return 130.0 * dot(m, g);
}

float hash(float n) { return fract(sin(n * 127.1) * 43758.5453); }

void main() {
	vec2 frag = gl_FragCoord.xy;
	vec2 cell = floor(frag / uCell);
	vec2 uv = (cell + 0.5) * uCell / uRes;
	float aspect = uRes.x / uRes.y;
	vec2 p = vec2(uv.x * aspect, uv.y);
	vec2 light = vec2(uLight.x * aspect, uLight.y);

	float dist = length((p - light) * vec2(1.0, 1.3));
	float glow = exp(-dist * dist * 2.4);
	float n = snoise(p * 1.8 + vec2(0.0, -uTime * 0.06)) * 0.5 + 0.5;
	float n2 = snoise(p * 4.5 + vec2(uTime * 0.04, uTime * 0.07)) * 0.5 + 0.5;

	float seed = hash(cell.x);
	float lane = step(0.93, hash(cell.x + 7.3));
	float streak = pow(fract(uv.y * 0.7 - uTime * (0.05 + 0.09 * seed) + seed * 9.0), 14.0) * lane;

	float level = clamp(glow * (0.2 + 1.3 * n * n2) + streak * glow * 0.55, 0.0, 1.0);
	level = max(level, 0.05 + 0.05 * n);

	vec2 local = (frag - cell * uCell) / uCell - 0.5;
	float box = max(abs(local.x), abs(local.y));
	float size = 0.18 + 0.24 * level;
	float dotMask = 1.0 - smoothstep(size - 0.06, size + 0.02, box);

	vec3 blue = vec3(0.24, 0.42, 1.0);
	vec3 violet = vec3(0.58, 0.36, 1.0);
	vec3 hot = vec3(0.88, 0.85, 1.0);
	vec3 hue = mix(blue, violet, smoothstep(0.25, 0.85, uv.x + (n - 0.5) * 0.4));
	hue = mix(hue, hot, smoothstep(0.72, 1.0, level));

	vec3 color = vec3(0.035, 0.04, 0.075) + hue * level * dotMask * 1.25 + mix(blue, violet, uv.x) * glow * 0.12;
	gl_FragColor = vec4(color, 1.0);
}
`;

const VERTEX_SHADER = 'attribute vec2 position; void main() { gl_Position = vec4(position, 0.0, 1.0); }';

export function initHeroAura(): void {
  const canvas = document.querySelector<HTMLCanvasElement>('.hero-canvas');
  const hero = canvas?.parentElement;
  if (!canvas || !hero) return;

  const gl = canvas.getContext('webgl', { alpha: false, antialias: false, powerPreference: 'low-power' });
  if (!gl) return;

  const compile = (type: number, source: string) => {
    const shader = gl.createShader(type);
    if (!shader) return null;
    gl.shaderSource(shader, source);
    gl.compileShader(shader);
    return gl.getShaderParameter(shader, gl.COMPILE_STATUS) ? shader : null;
  };

  const vertex = compile(gl.VERTEX_SHADER, VERTEX_SHADER);
  const fragment = compile(gl.FRAGMENT_SHADER, FRAGMENT_SHADER);
  const program = gl.createProgram();
  if (!vertex || !fragment || !program) return;

  gl.attachShader(program, vertex);
  gl.attachShader(program, fragment);
  gl.linkProgram(program);
  if (!gl.getProgramParameter(program, gl.LINK_STATUS)) return;
  gl.useProgram(program);

  // One oversized triangle that covers the whole viewport.
  gl.bindBuffer(gl.ARRAY_BUFFER, gl.createBuffer());
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 3, -1, -1, 3]), gl.STATIC_DRAW);
  const position = gl.getAttribLocation(program, 'position');
  gl.enableVertexAttribArray(position);
  gl.vertexAttribPointer(position, 2, gl.FLOAT, false, 0, 0);

  const uRes = gl.getUniformLocation(program, 'uRes');
  const uTime = gl.getUniformLocation(program, 'uTime');
  const uLight = gl.getUniformLocation(program, 'uLight');
  const uCell = gl.getUniformLocation(program, 'uCell');

  const still = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  // Where the light rests; moves lower-right on narrow screens to clear the text.
  const home = { x: 0.7, y: 0.5 };
  let ratio = 1;

  const resize = () => {
    ratio = Math.min(window.devicePixelRatio || 1, 1.5);
    canvas.width = Math.round(canvas.clientWidth * ratio);
    canvas.height = Math.round(canvas.clientHeight * ratio);
    gl.viewport(0, 0, canvas.width, canvas.height);
    const narrow = canvas.clientWidth < 760;
    home.x = narrow ? 0.78 : 0.7;
    home.y = narrow ? 0.82 : 0.5;
  };

  resize();
  const target = { ...home };
  const light = { ...home };

  const draw = (seconds: number) => {
    const drift = still ? 0 : seconds;
    gl.uniform2f(uRes, canvas.width, canvas.height);
    gl.uniform1f(uTime, 40 + drift);
    gl.uniform2f(uLight, light.x + Math.sin(drift * 0.21) * 0.04, light.y + Math.cos(drift * 0.17) * 0.05);
    gl.uniform1f(uCell, Math.round(7 * ratio));
    gl.drawArrays(gl.TRIANGLES, 0, 3);
  };

  draw(0);
  canvas.classList.add('is-ready');

  new ResizeObserver(() => {
    resize();
    draw(performance.now() / 1000);
  }).observe(canvas);

  if (still) return;

  hero.addEventListener('pointermove', (event) => {
    const box = hero.getBoundingClientRect();
    target.x = home.x + ((event.clientX - box.left) / box.width - 0.5) * 0.3;
    target.y = home.y - ((event.clientY - box.top) / box.height - 0.5) * 0.3;
  });
  hero.addEventListener('pointerleave', () => Object.assign(target, home));

  let visible = true;
  let frame = 0;
  const loop = (now: number) => {
    light.x += (target.x - light.x) * 0.03;
    light.y += (target.y - light.y) * 0.03;
    draw(now / 1000);
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
