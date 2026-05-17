import * as THREE from 'three'
import { RoundedBoxGeometry } from 'three/addons/geometries/RoundedBoxGeometry.js'
import { OrbitControls } from 'three/addons/controls/OrbitControls.js'

// Scene
const scene = new THREE.Scene()
scene.background = new THREE.Color(0xffffff)

// Camera
const laptopCenter = new THREE.Vector3(0, 1.1, -0.3)
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000)
camera.position.set(0, 1.1, 0.19)
camera.lookAt(laptopCenter)

// Renderer
const renderer = new THREE.WebGLRenderer({ antialias: true })
renderer.setSize(window.innerWidth, window.innerHeight)
document.body.appendChild(renderer.domElement)

// Controls
const controls = new OrbitControls(camera, renderer.domElement)
controls.enableDamping = true
controls.target.copy(laptopCenter)
controls.update()

// Lights
const ambientLight = new THREE.AmbientLight(0xffffff, 0.5)
scene.add(ambientLight)

const dirLight = new THREE.DirectionalLight(0xffffff, 2)
dirLight.position.set(5, 8, 5)
scene.add(dirLight)

const fillLight = new THREE.PointLight(0xffffff, 0.5)
fillLight.position.set(-3, 3, -3)
scene.add(fillLight)

// Floor
const floor = new THREE.Mesh(
    new THREE.PlaneGeometry(10, 7),
    new THREE.MeshStandardMaterial({ color: 0xcccccc })
)
floor.rotation.x = -Math.PI / 2
scene.add(floor)

// Desk
const desk = new THREE.Mesh(
    new THREE.BoxGeometry(3, 0.1, 1.5),
    new THREE.MeshStandardMaterial({ color: 0x888888 })
)
desk.position.set(0, 0.75, 0)
scene.add(desk)

// Laptop
const bodyMat = new THREE.MeshStandardMaterial({ color: 0x555555 })

const laptopBase = new THREE.Mesh(new RoundedBoxGeometry(1.0, 0.05, 0.65, 4, 0.02), bodyMat)
laptopBase.position.set(0, 0.825, 0)
scene.add(laptopBase)

const screenCanvas = document.createElement('canvas')
screenCanvas.width = 1920
screenCanvas.height = 1080
const ctx = screenCanvas.getContext('2d')
ctx.fillStyle = '#1a1a2e'
ctx.fillRect(0, 0, 1920, 1080)
ctx.fillStyle = '#ffffff'
ctx.font = 'bold 80px sans-serif'
ctx.textAlign = 'center'
ctx.fillText('lofi portfolio', 960, 540)

const screenTexture = new THREE.CanvasTexture(screenCanvas)
const laptopLid = new THREE.Mesh(new RoundedBoxGeometry(1.0, 0.62, 0.05, 4, 0.02), [
    bodyMat, bodyMat, bodyMat, bodyMat,
    new THREE.MeshStandardMaterial({ map: screenTexture }), // front = screen
    bodyMat
])
laptopLid.position.set(0, 1.135, -0.3)
scene.add(laptopLid)

// Cabinet
const cabinet = new THREE.Mesh(
    new THREE.BoxGeometry(1.2, 2.4, 0.6),
    new THREE.MeshStandardMaterial({ color: 0x666666 })
)
cabinet.position.set(-2.5, 1.2, 0)
scene.add(cabinet)

// Resize
window.addEventListener('resize', () => {
    camera.aspect = window.innerWidth / window.innerHeight
    camera.updateProjectionMatrix()
    renderer.setSize(window.innerWidth, window.innerHeight)
})

// Animate
function animate() {
    requestAnimationFrame(animate)
    screenTexture.needsUpdate = true
    controls.update()
    renderer.render(scene, camera)
}

animate()