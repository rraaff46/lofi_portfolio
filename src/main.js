import * as THREE from 'three'
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
const raycaster = new THREE.Raycaster()
const mouse = new THREE.Vector2()

window.addEventListener('mousemove', (e) => {
    mouse.x = (e.clientX / window.innerWidth) * 2 - 1
    mouse.y = -(e.clientY / window.innerHeight) * 2 + 1
})

window.addEventListener('click', () => {
    raycaster.setFromCamera(mouse, camera)
    const intersects = raycaster.intersectObject(laptopLid)

    if (intersects.length > 0) {
        const uv = intersects[0].uv
        const x = uv.x * 1920
        const y = (1 - uv.y) * 1080

        if (y < TAB_HEIGHT) {
            activeTab = Math.floor(x / TAB_WIDTH)
            drawScreen()
        }
    }
})

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

const laptopBase = new THREE.Mesh(new THREE.BoxGeometry(1.0, 0.05, 0.65), bodyMat)
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


const tabs = ['About', 'Work', 'Socials', 'Contact']
let activeTab = 0
let hoveredTab = -1

const TAB_HEIGHT = 80
const TAB_WIDTH = 1920 / tabs.length

const screenTexture = new THREE.CanvasTexture(screenCanvas)
const laptopLid = new THREE.Mesh(new THREE.BoxGeometry(1.0, 0.62, 0.05), [
    bodyMat, bodyMat, bodyMat, bodyMat,
    new THREE.MeshStandardMaterial({ map: screenTexture }),
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

    raycaster.setFromCamera(mouse, camera)
    const intersects = raycaster.intersectObject(laptopLid)

    if (intersects.length > 0) {
        document.body.style.cursor = 'pointer'
        controls.enabled = false

        const uv = intersects[0].uv
        const x = uv.x * 1920
        const y = (1 - uv.y) * 1080

        const newHovered = y < TAB_HEIGHT ? Math.floor(x / TAB_WIDTH) : -1
        if (newHovered !== hoveredTab) {
            hoveredTab = newHovered
            drawScreen()
        }
    } else {
        document.body.style.cursor = 'default'
        controls.enabled = true
        if (hoveredTab !== -1) {
            hoveredTab = -1
            drawScreen()
        }
    }

    renderer.render(scene, camera)
}

function drawScreen() {
    // Background
    ctx.fillStyle = '#1a1a2e'
    ctx.fillRect(0, 0, 1920, 1080)

    // Tab bar
    const tabColors = ['#ff6b8a', '#ff9f45', '#ffd93d', '#6bcb77']
    tabs.forEach((tab, i) => {
        const x = i * TAB_WIDTH

        if (i === activeTab) {
            ctx.fillStyle = tabColors[i]
        } else if (i === hoveredTab) {
            ctx.fillStyle = tabColors[i] + 'aa' // etwas transparenter
        } else {
            ctx.fillStyle = '#111122'
        }

        ctx.fillRect(x, 0, TAB_WIDTH, TAB_HEIGHT)

        ctx.fillStyle = i === activeTab ? '#333333' : '#ffffff'
        ctx.font = 'bold 36px Nunito'
        ctx.textAlign = 'center'
        ctx.fillText(tab, x + TAB_WIDTH / 2, 52)
    })

    // Content area
    ctx.fillStyle = '#ffffff'
    ctx.font = 'bold 60px sans-serif'
    ctx.textAlign = 'center'
    ctx.fillText(tabs[activeTab], 960, 600)
}

document.fonts.ready.then(() => {
    drawScreen()
})
animate()