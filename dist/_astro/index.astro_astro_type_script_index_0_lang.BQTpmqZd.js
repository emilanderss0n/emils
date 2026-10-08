import{f as M}from"./pointer-light.BICOH5Ab.js";const F=`
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
`,L="attribute vec2 position; void main() { gl_Position = vec4(position, 0.0, 1.0); }";function _(){const s=document.querySelector(".hero-canvas"),t=s?.parentElement;if(!s||!t)return;const e=s.getContext("webgl",{alpha:!1,antialias:!1,powerPreference:"low-power"});if(!e)return;const n=(h,m)=>{const y=e.createShader(h);return y?(e.shaderSource(y,m),e.compileShader(y),e.getShaderParameter(y,e.COMPILE_STATUS)?y:null):null},a=n(e.VERTEX_SHADER,L),o=n(e.FRAGMENT_SHADER,F),r=e.createProgram();if(!a||!o||!r||(e.attachShader(r,a),e.attachShader(r,o),e.linkProgram(r),!e.getProgramParameter(r,e.LINK_STATUS)))return;e.useProgram(r),e.bindBuffer(e.ARRAY_BUFFER,e.createBuffer()),e.bufferData(e.ARRAY_BUFFER,new Float32Array([-1,-1,3,-1,-1,3]),e.STATIC_DRAW);const i=e.getAttribLocation(r,"position");e.enableVertexAttribArray(i),e.vertexAttribPointer(i,2,e.FLOAT,!1,0,0);const u=e.getUniformLocation(r,"uRes"),d=e.getUniformLocation(r,"uTime"),x=e.getUniformLocation(r,"uLight"),b=e.getUniformLocation(r,"uCell"),v=window.matchMedia("(prefers-reduced-motion: reduce)").matches,c={x:.7,y:.5};let l=1;const f=()=>{l=Math.min(window.devicePixelRatio||1,1.5),s.width=Math.round(s.clientWidth*l),s.height=Math.round(s.clientHeight*l),e.viewport(0,0,s.width,s.height);const h=s.clientWidth<760;c.x=h?.78:.7,c.y=h?.82:.5};f();const g={...c},p={...c},w=h=>{const m=v?0:h;e.uniform2f(u,s.width,s.height),e.uniform1f(d,40+m),e.uniform2f(x,p.x+Math.sin(m*.21)*.04,p.y+Math.cos(m*.17)*.05),e.uniform1f(b,Math.round(7*l)),e.drawArrays(e.TRIANGLES,0,3)};if(w(0),s.classList.add("is-ready"),new ResizeObserver(()=>{f(),w(performance.now()/1e3)}).observe(s),v)return;t.addEventListener("pointermove",h=>{const m=t.getBoundingClientRect();g.x=c.x+((h.clientX-m.left)/m.width-.5)*.3,g.y=c.y-((h.clientY-m.top)/m.height-.5)*.3}),t.addEventListener("pointerleave",()=>Object.assign(g,c));let R=!0,A=0;const T=h=>{p.x+=(g.x-p.x)*.03,p.y+=(g.y-p.y)*.03,w(h/1e3),A=requestAnimationFrame(T)},E=()=>{cancelAnimationFrame(A),R&&!document.hidden&&(A=requestAnimationFrame(T))};new IntersectionObserver(([h])=>{R=h.isIntersecting,E()}).observe(t),document.addEventListener("visibilitychange",E)}const I={tech1:"!<>-_\\/[]{}—=+*^?#________"},P={"<":"&lt;",">":"&gt;","&":"&amp;",'"':"&quot;"},C=s=>s.replace(/[<>&"]/g,t=>P[t]),S=s=>/\s/.test(s),q=s=>`<span class="scramble-hidden">${C(s)}</span>`;class z{el;layer;chars;revealSpeed;changeFrequency;highlightColor;glowIntensity;queue=[];overlay;frame=0;frameRequest=0;resolve=()=>{};constructor(t,e={}){this.el=t,this.layer=e.layer??t.parentElement??t,this.chars=e.chars??I.tech1,this.revealSpeed=e.revealSpeed??2,this.changeFrequency=e.changeFrequency??.28,this.highlightColor=e.highlightColor??"currentColor",this.glowIntensity=e.glowIntensity??12,this.update=this.update.bind(this)}setText(t,e=this.el.innerText){const n=Math.max(e.length,t.length),a=new Promise(o=>this.resolve=o);this.queue=[];for(let o=0;o<n;o++){const r=e[o]||"",i=t[o]||"",u=Math.floor(Math.random()*(40/this.revealSpeed)),d=u+Math.floor(Math.random()*(40/this.revealSpeed));this.queue.push({from:r,to:i,start:u,end:d})}return cancelAnimationFrame(this.frameRequest),this.frame=0,this.placeGlyphs(),this.update(),a}placeGlyphs(){this.overlay?.remove(),this.el.innerHTML=this.queue.map(o=>S(o.to)?o.to:q(o.to||o.from)).join("");const t=document.createElement("span");t.className="scramble-layer",t.setAttribute("aria-hidden","true"),this.layer.append(t);const e=t.getBoundingClientRect(),n=Array.from(this.el.children);let a=0;for(const o of this.queue){if(S(o.to))continue;const r=n[a++],i=r.getBoundingClientRect(),u=getComputedStyle(r),d=document.createElement("span");d.className="scramble-glyph",d.hidden=!0,Object.assign(d.style,{left:`${i.left-e.left}px`,top:`${i.top-e.top}px`,lineHeight:`${i.height}px`,fontFamily:u.fontFamily,fontSize:u.fontSize,fontStyle:u.fontStyle,fontWeight:u.fontWeight,color:this.highlightColor,textShadow:`0 0 ${this.glowIntensity}px currentColor`}),t.append(d),o.glyph=d}this.overlay=t}update(){let t="",e=0;for(const n of this.queue){const a=this.frame>=n.end,o=!a&&this.frame>=n.start&&!S(n.to);a?(e++,t+=C(n.to)):S(n.to)?t+=n.to:!o&&n.from?t+=C(n.from):t+=q(n.to||n.from),n.glyph&&(n.glyph.hidden=!o,o&&(!n.char||Math.random()<this.changeFrequency)&&(n.char=this.randomChar(),n.glyph.textContent=n.char))}this.el.innerHTML=t,e===this.queue.length?(this.overlay?.remove(),this.overlay=void 0,this.resolve()):(this.frameRequest=requestAnimationFrame(this.update),this.frame++)}randomChar(){return this.chars[Math.floor(Math.random()*this.chars.length)]}}function H(s=document){const t=Array.from(s.querySelectorAll(".scramble"));if(t.length===0)return;const e=window.matchMedia("(prefers-reduced-motion: reduce)").matches,n=getComputedStyle(document.documentElement).getPropertyValue("--accent").trim()||"currentColor";for(const a of t){const o=Array.from(a.querySelectorAll(".scramble-seg")),r=()=>{for(const l of a.querySelectorAll(".scramble-seg, .scramble-sep"))l.style.opacity="1"};if(e||o.length===0){r();continue}const i=Number(a.dataset.scrambleDelay??0),u=Number(a.dataset.scrambleSpeed??1.4),d=(a.dataset.scrambleFrom??"empty")==="empty",x=o.map(l=>l.dataset.text??l.textContent??""),b=()=>{for(const[l,f]of o.entries())new z(f,{highlightColor:n,revealSpeed:u,layer:a}).setText(x[l],d?"":x[l]);r()},v=l=>{l>0?window.setTimeout(b,l):b()},c=a.dataset.scrambleTrigger==="reveal"?a.closest("[data-reveal]"):null;c?c.dataset.revealed==="instant"?r():c.dataset.revealed!==void 0?v((parseFloat(c.style.getPropertyValue("--reveal-delay"))||0)+i):c.addEventListener("reveal",l=>{const f=l.detail;f.instant?r():v(f.delay+i)},{once:!0}):v(i)}}function N(s=document){for(const t of s.querySelectorAll("[data-glow]"))M(t,t,[t])}function O(){const s=U();for(const r of document.querySelectorAll(".stage"))M(r,r,[r]);const t=document.querySelector(".stage[data-live]"),e=Array.from(document.querySelectorAll(".service[data-state]")),n=e[0]?.parentElement;if(!t||!n)return;const a=r=>{t.dataset.state=r.dataset.state;for(const i of e)i.toggleAttribute("data-active",i===r);s()};n.setAttribute("data-live",""),a(e[0]);const o=new IntersectionObserver(r=>{for(const i of r)i.isIntersecting&&a(i.target)},{rootMargin:"-45% 0px -45% 0px"});for(const r of e)o.observe(r)}function U(){if(!window.matchMedia("(prefers-reduced-motion: no-preference)").matches)return()=>{};const s=Array.from(document.querySelectorAll(".stage video"));if(s.length===0)return()=>{};const t=new Set,e=o=>{const r=o.classList.contains("mon-video"),i=o.closest(".stage")?.dataset.state==="video";return r===i},n=()=>{for(const o of s)t.has(o)&&!document.hidden&&e(o)?o.play().catch(()=>{}):o.pause()},a=new IntersectionObserver(o=>{for(const r of o){const i=r.target;r.isIntersecting?t.add(i):t.delete(i)}n()});for(const o of s)a.observe(o);return document.addEventListener("visibilitychange",n),n}_();N();O();document.fonts.ready.then(()=>{document.querySelector(".hero")?.setAttribute("data-play",""),H()});
