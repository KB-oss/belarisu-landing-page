import * as THREE from 'three'

const VERT = `
  uniform float uTime;
  uniform vec2  uMouse;
  varying vec2  vUv;

  // Simple smooth noise
  vec3 mod289(vec3 x) { return x - floor(x * (1.0/289.0)) * 289.0; }
  vec4 mod289(vec4 x) { return x - floor(x * (1.0/289.0)) * 289.0; }
  vec4 permute(vec4 x) { return mod289(((x*34.0)+1.0)*x); }
  vec4 taylorInvSqrt(vec4 r){ return 1.79284291400159 - 0.85373472095314 * r; }

  float snoise(vec3 v) {
    const vec2 C = vec2(1.0/6.0, 1.0/3.0);
    const vec4 D = vec4(0.0, 0.5, 1.0, 2.0);
    vec3 i  = floor(v + dot(v, C.yyy));
    vec3 x0 = v - i + dot(i, C.xxx);
    vec3 g = step(x0.yzx, x0.xyz);
    vec3 l = 1.0 - g;
    vec3 i1 = min(g.xyz, l.zxy);
    vec3 i2 = max(g.xyz, l.zxy);
    vec3 x1 = x0 - i1 + C.xxx;
    vec3 x2 = x0 - i2 + C.yyy;
    vec3 x3 = x0 - D.yyy;
    i = mod289(i);
    vec4 p = permute(permute(permute(
      i.z + vec4(0.0, i1.z, i2.z, 1.0))
      + i.y + vec4(0.0, i1.y, i2.y, 1.0))
      + i.x + vec4(0.0, i1.x, i2.x, 1.0));
    float n_ = 0.142857142857;
    vec3 ns = n_ * D.wyz - D.xzx;
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
    vec3 p0 = vec3(a0.xy,h.x);
    vec3 p1 = vec3(a0.zw,h.y);
    vec3 p2 = vec3(a1.xy,h.z);
    vec3 p3 = vec3(a1.zw,h.w);
    vec4 norm = taylorInvSqrt(vec4(dot(p0,p0), dot(p1,p1), dot(p2,p2), dot(p3,p3)));
    p0 *= norm.x; p1 *= norm.y; p2 *= norm.z; p3 *= norm.w;
    vec4 m = max(0.6 - vec4(dot(x0,x0), dot(x1,x1), dot(x2,x2), dot(x3,x3)), 0.0);
    m = m * m;
    return 42.0 * dot(m*m, vec4(dot(p0,x0), dot(p1,x1), dot(p2,x2), dot(p3,x3)));
  }

  void main() {
    vUv = uv;
    vec3 pos = position;

    // Displacement based on noise + mouse proximity
    float n = snoise(vec3(pos.x * 1.2 + uTime * 0.15, pos.y * 1.2 + uTime * 0.1, uTime * 0.08));
    float mouseInfluence = 1.0 - length(uv - (uMouse * 0.5 + 0.5)) * 0.6;
    mouseInfluence = clamp(mouseInfluence, 0.0, 1.0);

    pos.z += n * 0.04 + mouseInfluence * 0.06;
    pos.x += n * 0.015;
    pos.y += n * 0.012;

    gl_Position = projectionMatrix * modelViewMatrix * vec4(pos, 1.0);
  }
`

const FRAG = `
  uniform sampler2D uTexture;
  uniform float     uTime;
  uniform vec2      uMouse;
  varying vec2      vUv;

  void main() {
    // Subtle UV distortion based on mouse
    vec2 mouse = uMouse * 0.5 + 0.5;
    vec2 dist  = vUv - mouse;
    float strength = 0.0035 / (length(dist) + 0.35);
    vec2 distortedUv = vUv + normalize(dist) * strength * 0.015;

    vec4 texColor = texture2D(uTexture, distortedUv);

    // Vignette
    float vig = 1.0 - smoothstep(0.5, 1.4, length(vUv - 0.5) * 2.0);
    texColor.rgb *= mix(0.7, 1.0, vig);

    gl_FragColor = texColor;
  }
`

interface Uniforms {
  uTexture: THREE.IUniform<THREE.Texture>
  uTime: THREE.IUniform<number>
  uMouse: THREE.IUniform<THREE.Vector2>
  [uniform: string]: THREE.IUniform
}

export class HeroScene {
  canvas: HTMLCanvasElement
  imageUrl: string
  mouse: THREE.Vector2
  targetMouse: THREE.Vector2
  animFrameId: number | null
  renderer!: THREE.WebGLRenderer
  scene!: THREE.Scene
  camera!: THREE.OrthographicCamera
  mesh: THREE.Mesh | null = null
  uniforms: Uniforms | null = null
  onResize!: () => void
  onMouseMove!: (e: MouseEvent) => void

  constructor(canvas: HTMLCanvasElement, imageUrl: string) {
    this.canvas = canvas
    this.imageUrl = imageUrl
    this.mouse = new THREE.Vector2(0, 0)
    this.targetMouse = new THREE.Vector2(0, 0)
    this.animFrameId = null
    this.init()
  }

  init(): void {
    const { canvas } = this
    const w = canvas.clientWidth
    const h = canvas.clientHeight

    this.renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: false })
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
    this.renderer.setSize(w, h)

    this.scene = new THREE.Scene()
    this.camera = new THREE.OrthographicCamera(-1, 1, 1, -1, 0.1, 10)
    this.camera.position.z = 1

    const loader = new THREE.TextureLoader()
    loader.crossOrigin = 'anonymous'
    loader.load(
      this.imageUrl,
      (texture) => {
        texture.minFilter = THREE.LinearFilter
        texture.magFilter = THREE.LinearFilter
        this.buildMesh(texture)
        this.animate()
      },
      undefined,
      () => {
        // Fallback: gradient if texture fails
        this.buildGradient()
        this.animate()
      }
    )

    this.onResize = this.resize.bind(this)
    window.addEventListener('resize', this.onResize)
    this.onMouseMove = this.handleMouseMove.bind(this)
    window.addEventListener('mousemove', this.onMouseMove, { passive: true })
  }

  buildMesh(texture: THREE.Texture): void {
    const geo = new THREE.PlaneGeometry(2, 2, 64, 64)
    this.uniforms = {
      uTexture: { value: texture },
      uTime:    { value: 0 },
      uMouse:   { value: this.mouse },
    }
    const mat = new THREE.ShaderMaterial({
      uniforms: this.uniforms,
      vertexShader: VERT,
      fragmentShader: FRAG,
    })
    this.mesh = new THREE.Mesh(geo, mat)
    this.scene.add(this.mesh)
  }

  buildGradient(): void {
    // Fallback: plain dark navy overlay (no image)
    const geo = new THREE.PlaneGeometry(2, 2)
    const mat = new THREE.MeshBasicMaterial({ color: 0x071e36 })
    this.mesh = new THREE.Mesh(geo, mat)
    this.scene.add(this.mesh)
  }

  handleMouseMove(e: MouseEvent): void {
    this.targetMouse.x =  (e.clientX / window.innerWidth)  * 2 - 1
    this.targetMouse.y = -(e.clientY / window.innerHeight) * 2 + 1
  }

  resize(): void {
    const w = this.canvas.clientWidth
    const h = this.canvas.clientHeight
    this.renderer.setSize(w, h)
  }

  animate(): void {
    this.animFrameId = requestAnimationFrame(this.animate.bind(this))
    if (this.uniforms) {
      this.uniforms.uTime.value += 0.016
      // Smooth mouse lerp
      this.mouse.x += (this.targetMouse.x - this.mouse.x) * 0.05
      this.mouse.y += (this.targetMouse.y - this.mouse.y) * 0.05
      this.uniforms.uMouse.value.set(this.mouse.x, this.mouse.y)
    }
    this.renderer.render(this.scene, this.camera)
  }

  destroy(): void {
    if (this.animFrameId !== null) cancelAnimationFrame(this.animFrameId)
    window.removeEventListener('resize', this.onResize)
    window.removeEventListener('mousemove', this.onMouseMove)
    this.renderer.dispose()
  }
}
