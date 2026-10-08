const q=`
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
`,F="attribute vec2 position; void main() { gl_Position = vec4(position, 0.0, 1.0); }";function _(){const r=document.querySelector(".hero-canvas"),t=r?.parentElement;if(!r||!t)return;const e=r.getContext("webgl",{alpha:!1,antialias:!1,powerPreference:"low-power"});if(!e)return;const o=(m,f)=>{const x=e.createShader(m);return x?(e.shaderSource(x,f),e.compileShader(x),e.getShaderParameter(x,e.COMPILE_STATUS)?x:null):null},c=o(e.VERTEX_SHADER,F),n=o(e.FRAGMENT_SHADER,q),s=e.createProgram();if(!c||!n||!s||(e.attachShader(s,c),e.attachShader(s,n),e.linkProgram(s),!e.getProgramParameter(s,e.LINK_STATUS)))return;e.useProgram(s),e.bindBuffer(e.ARRAY_BUFFER,e.createBuffer()),e.bufferData(e.ARRAY_BUFFER,new Float32Array([-1,-1,3,-1,-1,3]),e.STATIC_DRAW);const i=e.getAttribLocation(s,"position");e.enableVertexAttribArray(i),e.vertexAttribPointer(i,2,e.FLOAT,!1,0,0);const a=e.getUniformLocation(s,"uRes"),l=e.getUniformLocation(s,"uTime"),d=e.getUniformLocation(s,"uLight"),S=e.getUniformLocation(s,"uCell"),y=window.matchMedia("(prefers-reduced-motion: reduce)").matches,u={x:.7,y:.5};let v=1;const p=()=>{v=Math.min(window.devicePixelRatio||1,1.5),r.width=Math.round(r.clientWidth*v),r.height=Math.round(r.clientHeight*v),e.viewport(0,0,r.width,r.height);const m=r.clientWidth<760;u.x=m?.78:.7,u.y=m?.82:.5};p();const h={...u},g={...u},w=m=>{const f=y?0:m;e.uniform2f(a,r.width,r.height),e.uniform1f(l,40+f),e.uniform2f(d,g.x+Math.sin(f*.21)*.04,g.y+Math.cos(f*.17)*.05),e.uniform1f(S,Math.round(7*v)),e.drawArrays(e.TRIANGLES,0,3)};if(w(0),r.classList.add("is-ready"),new ResizeObserver(()=>{p(),w(performance.now()/1e3)}).observe(r),y)return;t.addEventListener("pointermove",m=>{const f=t.getBoundingClientRect();h.x=u.x+((m.clientX-f.left)/f.width-.5)*.3,h.y=u.y-((m.clientY-f.top)/f.height-.5)*.3}),t.addEventListener("pointerleave",()=>Object.assign(h,u));let R=!0,A=0;const T=m=>{g.x+=(h.x-g.x)*.03,g.y+=(h.y-g.y)*.03,w(m/1e3),A=requestAnimationFrame(T)},E=()=>{cancelAnimationFrame(A),R&&!document.hidden&&(A=requestAnimationFrame(T))};new IntersectionObserver(([m])=>{R=m.isIntersecting,E()}).observe(t),document.addEventListener("visibilitychange",E)}const L={tech1:"!<>-_\\/[]{}—=+*^?#________"},P={"<":"&lt;",">":"&gt;","&":"&amp;",'"':"&quot;"},C=r=>r.replace(/[<>&"]/g,t=>P[t]),b=r=>/\s/.test(r),M=r=>`<span class="scramble-hidden">${C(r)}</span>`;class z{el;layer;chars;revealSpeed;changeFrequency;highlightColor;glowIntensity;queue=[];overlay;frame=0;frameRequest=0;resolve=()=>{};constructor(t,e={}){this.el=t,this.layer=e.layer??t.parentElement??t,this.chars=e.chars??L.tech1,this.revealSpeed=e.revealSpeed??2,this.changeFrequency=e.changeFrequency??.28,this.highlightColor=e.highlightColor??"currentColor",this.glowIntensity=e.glowIntensity??12,this.update=this.update.bind(this)}setText(t,e=this.el.innerText){const o=Math.max(e.length,t.length),c=new Promise(n=>this.resolve=n);this.queue=[];for(let n=0;n<o;n++){const s=e[n]||"",i=t[n]||"",a=Math.floor(Math.random()*(40/this.revealSpeed)),l=a+Math.floor(Math.random()*(40/this.revealSpeed));this.queue.push({from:s,to:i,start:a,end:l})}return cancelAnimationFrame(this.frameRequest),this.frame=0,this.placeGlyphs(),this.update(),c}placeGlyphs(){this.overlay?.remove(),this.el.innerHTML=this.queue.map(n=>b(n.to)?n.to:M(n.to||n.from)).join("");const t=document.createElement("span");t.className="scramble-layer",t.setAttribute("aria-hidden","true"),this.layer.append(t);const e=t.getBoundingClientRect(),o=Array.from(this.el.children);let c=0;for(const n of this.queue){if(b(n.to))continue;const s=o[c++],i=s.getBoundingClientRect(),a=getComputedStyle(s),l=document.createElement("span");l.className="scramble-glyph",l.hidden=!0,Object.assign(l.style,{left:`${i.left-e.left}px`,top:`${i.top-e.top}px`,lineHeight:`${i.height}px`,fontFamily:a.fontFamily,fontSize:a.fontSize,fontStyle:a.fontStyle,fontWeight:a.fontWeight,color:this.highlightColor,textShadow:`0 0 ${this.glowIntensity}px currentColor`}),t.append(l),n.glyph=l}this.overlay=t}update(){let t="",e=0;for(const o of this.queue){const c=this.frame>=o.end,n=!c&&this.frame>=o.start&&!b(o.to);c?(e++,t+=C(o.to)):b(o.to)?t+=o.to:!n&&o.from?t+=C(o.from):t+=M(o.to||o.from),o.glyph&&(o.glyph.hidden=!n,n&&(!o.char||Math.random()<this.changeFrequency)&&(o.char=this.randomChar(),o.glyph.textContent=o.char))}this.el.innerHTML=t,e===this.queue.length?(this.overlay?.remove(),this.overlay=void 0,this.resolve()):(this.frameRequest=requestAnimationFrame(this.update),this.frame++)}randomChar(){return this.chars[Math.floor(Math.random()*this.chars.length)]}}function I(r=document){const t=Array.from(r.querySelectorAll(".scramble"));if(t.length===0)return;const e=window.matchMedia("(prefers-reduced-motion: reduce)").matches,o=getComputedStyle(document.documentElement).getPropertyValue("--accent").trim()||"currentColor",c=new Map;let n;const s=(i,a)=>{n??=new IntersectionObserver(l=>{for(const d of l)d.isIntersecting&&(n?.unobserve(d.target),c.get(d.target)?.(),c.delete(d.target))},{rootMargin:"0px 0px -15% 0px"}),c.set(i,a),n.observe(i)};for(const i of t){const a=Array.from(i.querySelectorAll(".scramble-seg")),l=()=>{for(const h of i.querySelectorAll(".scramble-seg, .scramble-sep"))h.style.opacity="1"};if(e||a.length===0){l();continue}const d=Number(i.dataset.scrambleDelay??0),S=Number(i.dataset.scrambleSpeed??1.4),y=(i.dataset.scrambleFrom??"empty")==="empty",u=a.map(h=>h.dataset.text??h.textContent??""),v=()=>{for(const[h,g]of a.entries())new z(g,{highlightColor:o,revealSpeed:S,layer:i}).setText(u[h],y?"":u[h]);l()},p=()=>{d>0?window.setTimeout(v,d):v()};i.dataset.scrambleTrigger==="view"?s(i,p):p()}}function H(r=document){for(const t of r.querySelectorAll("[data-glow]"))t.addEventListener("pointermove",e=>{const o=t.getBoundingClientRect();t.style.setProperty("--x",`${e.clientX-o.left}px`),t.style.setProperty("--y",`${e.clientY-o.top}px`)})}_();H();document.fonts.ready.then(()=>I());
