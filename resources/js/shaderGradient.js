import * as THREE from 'three';
import { EffectComposer } from 'three/examples/jsm/postprocessing/EffectComposer.js';
import { RenderPass } from 'three/examples/jsm/postprocessing/RenderPass.js';
import { UnrealBloomPass } from 'three/examples/jsm/postprocessing/UnrealBloomPass.js';

// Update function signature to accept optional parameters
export function initShaderGradient(containerId, options = {}) {
    const container = document.getElementById(containerId);
    if (!container) return;

    const gradientEl = container.querySelector('#gradient');
    if (!gradientEl) return;

    // Parse the data-url to get shader parameters
    const dataUrl = gradientEl.getAttribute('data-url');
    if (!dataUrl) return;

    // Parse URL parameters
    const urlParams = new URLSearchParams(dataUrl.split('?')[1]);

    // Setup renderer
    const renderer = new THREE.WebGLRenderer({
        antialias: true,
        alpha: true
    });

    renderer.setSize(container.clientWidth, container.clientHeight);
    renderer.setPixelRatio(window.devicePixelRatio);

    // Replace existing canvas if any
    const existingCanvas = gradientEl.querySelector('canvas');
    if (existingCanvas) {
        existingCanvas.remove();
    }

    gradientEl.appendChild(renderer.domElement);

    // Setup scene and camera
    const scene = new THREE.Scene();
    scene.background = new THREE.Color(urlParams.get('bgColor1') || '#000000');

    const camera = new THREE.PerspectiveCamera(
        parseInt(urlParams.get('fov') || 45),
        container.clientWidth / container.clientHeight,
        0.1,
        1000
    );

    // Position camera based on parameters
    const cDistance = parseFloat(urlParams.get('cDistance') || 1.5);
    const cPolarAngle = parseFloat(urlParams.get('cPolarAngle') || 140) * (Math.PI / 180);
    const cAzimuthAngle = parseFloat(urlParams.get('cAzimuthAngle') || 250) * (Math.PI / 180);

    camera.position.x = cDistance * Math.sin(cPolarAngle) * Math.cos(cAzimuthAngle);
    camera.position.y = cDistance * Math.cos(cPolarAngle);
    camera.position.z = cDistance * Math.sin(cPolarAngle) * Math.sin(cAzimuthAngle);
    camera.lookAt(-0.5, 1, 0);

    // Create sphere geometry
    const geometry = new THREE.BoxGeometry(0.5, 36, 36);

    // Create shader material
    const vertexShader = `
        varying vec2 vUv;
        varying vec3 vPosition;
        
        void main() {
            vUv = uv;
            vPosition = position;
            gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
        }
    `;

    const fragmentShader = `
        uniform float uTime;
        uniform vec3 color1;
        uniform vec3 color2;
        uniform vec3 color3;
        uniform float uAmplitude;
        uniform float uFrequency;
        uniform float uDensity;
        uniform float uStrength;
        
        varying vec2 vUv;
        varying vec3 vPosition;
        
        // Simplex noise function
        vec3 mod289(vec3 x) { return x - floor(x * (1.0 / 289.0)) * 289.0; }
        vec4 mod289(vec4 x) { return x - floor(x * (1.0 / 289.0)) * 289.0; }
        vec4 permute(vec4 x) { return mod289(((x*34.0)+1.0)*x); }
        vec4 taylorInvSqrt(vec4 r) { return 1.79284291400159 - 0.85373472095314 * r; }
        
        float snoise(vec3 v) {
            const vec2 C = vec2(1.0/6.0, 1.0/3.0);
            const vec4 D = vec4(0.0, 0.5, 1.0, 2.0);
            
            // First corner
            vec3 i  = floor(v + dot(v, C.yyy));
            vec3 x0 =   v - i + dot(i, C.xxx);
            
            // Other corners
            vec3 g = step(x0.yzx, x0.xyz);
            vec3 l = 1.0 - g;
            vec3 i1 = min(g.xyz, l.zxy);
            vec3 i2 = max(g.xyz, l.zxy);
            
            vec3 x1 = x0 - i1 + C.xxx;
            vec3 x2 = x0 - i2 + C.yyy;
            vec3 x3 = x0 - D.yyy;
            
            // Permutations
            i = mod289(i);
            vec4 p = permute( permute( permute(
                        i.z + vec4(0.0, i1.z, i2.z, 1.0))
                      + i.y + vec4(0.0, i1.y, i2.y, 1.0))
                      + i.x + vec4(0.0, i1.x, i2.x, 1.0));
                      
            // Gradients
            float n_ = 0.142857142857;
            vec3  ns = n_ * D.wyz - D.xzx;
            
            vec4 j = p - 49.0 * floor(p * ns.z * ns.z);
            
            vec4 x_ = floor(j * ns.z);
            vec4 y_ = floor(j - 7.0 * x_);
            
            vec4 x = x_ *ns.x + ns.yyyy;
            vec4 y = y_ *ns.x + ns.yyyy;
            vec4 h = 1.0 - abs(x) - abs(y);
            
            vec4 b0 = vec4(x.xy, y.xy);
            vec4 b1 = vec4(x.zw, y.zw);
            
            vec4 s0 = floor(b0)*2.0 + 1.0;
            vec4 s1 = floor(b1)*2.0 + 1.0;
            vec4 sh = -step(h, vec4(0.0));
            
            vec4 a0 = b0.xzyw + s0.xzyw*sh.xxyy;
            vec4 a1 = b1.xzyw + s1.xzyw*sh.zzww;
            
            vec3 p0 = vec3(a0.xy, h.x);
            vec3 p1 = vec3(a0.zw, h.y);
            vec3 p2 = vec3(a1.xy, h.z);
            vec3 p3 = vec3(a1.zw, h.w);
            
            // Normalise gradients
            vec4 norm = taylorInvSqrt(vec4(dot(p0, p0), dot(p1, p1), dot(p2, p2), dot(p3, p3)));
            p0 *= norm.x;
            p1 *= norm.y;
            p2 *= norm.z;
            p3 *= norm.w;
            
            // Mix final noise value
            vec4 m = max(0.6 - vec4(dot(x0, x0), dot(x1, x1), dot(x2, x2), dot(x3, x3)), 0.0);
            m = m * m;
            return 42.0 * dot(m*m, vec4(dot(p0, x0), dot(p1, x1), dot(p2, x2), dot(p3, x3)));
        }
        
        void main() {
            float n = snoise(vPosition * uDensity + uTime * uStrength) * uAmplitude;
            float n2 = snoise(vPosition * uDensity * 2.0 + uTime * uStrength * 1.5) * uAmplitude * 0.5;
            
            // Calculate the blend factor based on position and noise
            float blend1 = vUv.y + n * 0.5;
            float blend2 = vUv.y + n2 * 0.5;
            
            // Mix colors based on the blend factor
            vec3 color = mix(color1, color2, smoothstep(0.2, 0.6, blend1));
            color = mix(color, color3, smoothstep(0.4, 0.8, blend2));
            
            gl_FragColor = vec4(color, 1.0);
        }
    `;

    // Parse colors from data-url
    function hexToRgb(hex) {
        // Handle missing or invalid hex values
        if (!hex || typeof hex !== 'string') {
            return new THREE.Vector3(1, 0, 1); // Default to magenta for visibility
        }

        // Remove # if present
        hex = hex.replace('#', '');

        // Ensure hex is a valid format
        if (!/^[0-9A-Fa-f]{6}$/.test(hex)) {
            return new THREE.Vector3(1, 0, 1); // Default to magenta
        }

        try {
            // Parse hex values to RGB
            const r = parseInt(hex.substring(0, 2), 16) / 255;
            const g = parseInt(hex.substring(2, 4), 16) / 255;
            const b = parseInt(hex.substring(4, 6), 16) / 255;

            return new THREE.Vector3(r, g, b);
        } catch (error) {
            return new THREE.Vector3(1, 0, 1); // Default to magenta
        }
    }

    // Get color parameters with debug logging
    // Priority: 1. Function arguments, 2. HTML data attributes, 3. URL params, 4. Default fallbacks
    let colorParam1 = options.color1 ||
        gradientEl.getAttribute('data-color1') ||
        urlParams.get('color1') ||
        '#d56fb0';
    let colorParam2 = options.color2 ||
        gradientEl.getAttribute('data-color2') ||
        urlParams.get('color2') ||
        '#040059';
    let colorParam3 = options.color3 ||
        gradientEl.getAttribute('data-color3') ||
        urlParams.get('color3') ||
        '#2698dc';

    // Allow overriding colors from page URL parameters
    const containerParams = new URLSearchParams(window.location.search);
    if (containerParams.has('color1')) colorParam1 = containerParams.get('color1');
    if (containerParams.has('color2')) colorParam2 = containerParams.get('color2');
    if (containerParams.has('color3')) colorParam3 = containerParams.get('color3');

    const color1 = hexToRgb(colorParam1);
    const color2 = hexToRgb(colorParam2);
    const color3 = hexToRgb(colorParam3);

    // Setup uniforms based on parameters
    const uniforms = {
        uTime: { value: parseFloat(urlParams.get('uTime') || 0) },
        color1: { value: color1 },
        color2: { value: color2 },
        color3: { value: color3 },
        uAmplitude: { value: parseFloat(urlParams.get('uAmplitude') || 5.3) },
        uFrequency: { value: parseFloat(urlParams.get('uFrequency') || 10.5) },
        uDensity: { value: parseFloat(urlParams.get('uDensity') || 1.4) },
        uStrength: { value: parseFloat(urlParams.get('uStrength') || 3.2) }
    };

    // Create material
    const material = new THREE.ShaderMaterial({
        uniforms: uniforms,
        vertexShader: vertexShader,
        fragmentShader: fragmentShader
    });

    // Create mesh and add to scene
    const sphere = new THREE.Mesh(geometry, material);

    // Apply rotation from parameters
    sphere.rotation.x = parseFloat(urlParams.get('rotationX') || 0) * (Math.PI / 180);
    sphere.rotation.y = parseFloat(urlParams.get('rotationY') || 0) * (Math.PI / 180);
    sphere.rotation.z = parseFloat(urlParams.get('rotationZ') || 140) * (Math.PI / 180);

    scene.add(sphere);

    // Setup post-processing
    const renderScene = new RenderPass(scene, camera);

    // Configure bloom effect using URL parameters
    const bloomStrength = parseFloat(urlParams.get('bloomStrength') || 1.5);
    const bloomRadius = parseFloat(urlParams.get('bloomRadius') || 0.4);
    const bloomThreshold = parseFloat(urlParams.get('bloomThreshold') || 0.85);

    const bloomPass = new UnrealBloomPass(
        new THREE.Vector2(container.clientWidth, container.clientHeight),
        bloomStrength,
        bloomRadius,
        bloomThreshold
    );

    // Create effect composer
    const composer = new EffectComposer(renderer);
    composer.addPass(renderScene);
    composer.addPass(bloomPass);

    // Handle window resize
    const onResize = () => {
        camera.aspect = container.clientWidth / container.clientHeight;
        camera.updateProjectionMatrix();
        renderer.setSize(container.clientWidth, container.clientHeight);
        composer.setSize(container.clientWidth, container.clientHeight);
    };

    window.addEventListener('resize', onResize);

    // Animation loop
    const speed = parseFloat(urlParams.get('uSpeed') || 0.1);
    let lastTime = 0;

    function animate(time) {
        const elapsedTime = time * 0.001; // Convert to seconds
        uniforms.uTime.value = elapsedTime * speed;

        // Use composer render instead of renderer.render
        composer.render();
        requestAnimationFrame(animate);
    }

    animate(0);

    // Return cleanup function
    return () => {
        window.removeEventListener('resize', onResize);
        renderer.dispose();
        composer.dispose();
    };
}
