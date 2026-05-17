import * as THREE from 'three'
import { RoundedBoxGeometry } from 'three/addons/geometries/RoundedBoxGeometry.js'
import { OrbitControls } from 'three/addons/controls/OrbitControls.js'

const scene = new THREE.Scene()

scene.background = new THREE.Color(0xffffff)
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000)
const laptopCenter = new THREE.Vector3(0, 1.1, -0.3)

camera.position.set(0, 1.1, 0.19)
camera.lookAt(laptopCenter)

const renderer = new THREE.WebGLRenderer({ antialias: true })
renderer.setSize(window.innerWidth, window.innerHeight)
document.body.appendChild(renderer.domElement)

const controls = new OrbitControls(camera, renderer.domElement)
controls.enableDamping = true
controls.target.copy(laptopCenter)
controls.update()


// Floor
const floorGeo = new THREE.PlaneGeometry(10, 7)
const floorMat = new THREE.MeshStandardMaterial({ color: 0xcccccc })
const floor = new THREE.Mesh(floorGeo, floorMat)
floor.rotation.x = -Math.PI / 2
floor.position.y = 0
scene.add(floor)

// Desk - Tischbeine bei y=0, Tischplatte bei y=0.75
const deskGeo = new THREE.BoxGeometry(3, 0.1, 1.5)
const deskMat = new THREE.MeshStandardMaterial({ color: 0x888888 })
const desk = new THREE.Mesh(deskGeo, deskMat)
desk.position.set(0, 0.75, 0)
scene.add(desk)

// Laptop base
const laptopMat = new THREE.MeshStandardMaterial({ color: 0x555555 })
const laptopBaseGeo = new RoundedBoxGeometry(1.0, 0.05, 0.65, 4, 0.02)
const laptopBase = new THREE.Mesh(laptopBaseGeo, laptopMat)
laptopBase.position.set(0, 0.825, 0)
scene.add(laptopBase)

// Laptop lid
const laptopLidGeo = new RoundedBoxGeometry(1.0, 0.62, 0.05, 4, 0.02)
const laptopLid = new THREE.Mesh(laptopLidGeo, laptopMat)
laptopLid.position.set(0, 1.135, -0.3)
scene.add(laptopLid)

// Cabinet - großer Wandschrank, vom Boden bis fast zur Decke
const cabinetGeo = new THREE.BoxGeometry(1.2, 2.4, 0.6)
const cabinetMat = new THREE.MeshStandardMaterial({ color: 0x666666 })
const cabinet = new THREE.Mesh(cabinetGeo, cabinetMat)
cabinet.position.set(-2.5, 1.2, 0)
scene.add(cabinet)

// Ambient light - soft base brightness
const ambientLight = new THREE.AmbientLight(0xffffff, 0.5)
scene.add(ambientLight)

// Directional light - main light source
const dirLight = new THREE.DirectionalLight(0xffffff, 2)
dirLight.position.set(5, 8, 5)
scene.add(dirLight)

// Fill light - soften shadows
const fillLight = new THREE.PointLight(0xffffff, 0.5)
fillLight.position.set(-3, 3, -3)
scene.add(fillLight)

window.addEventListener('resize', () => {
    camera.aspect = window.innerWidth / window.innerHeight
    camera.updateProjectionMatrix()
    renderer.setSize(window.innerWidth, window.innerHeight)
})

function animate() {
    requestAnimationFrame(animate)
    controls.update()
    renderer.render(scene, camera)
}

animate()