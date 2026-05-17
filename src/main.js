import * as THREE from 'three'
import { RoundedBoxGeometry } from 'three/addons/geometries/RoundedBoxGeometry.js'

const scene = new THREE.Scene()

scene.background = new THREE.Color(0xffffff)
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000)
camera.position.set(0, 2, 5)

const renderer = new THREE.WebGLRenderer({ antialias: true })
renderer.setSize(window.innerWidth, window.innerHeight)
document.body.appendChild(renderer.domElement)

// Desk
const deskGeo = new THREE.BoxGeometry(3, 0.1, 1.5)
const deskMat = new THREE.MeshStandardMaterial({ color: 0x888888 })
const desk = new THREE.Mesh(deskGeo, deskMat)
desk.position.set(0, 0, 0)
scene.add(desk)

// Laptop base
const laptopMat = new THREE.MeshStandardMaterial({ color: 0x555555 })
const laptopBaseGeo = new RoundedBoxGeometry(1.0, 0.05, 0.65, 4, 0.02)
const laptopBase = new THREE.Mesh(laptopBaseGeo, laptopMat)
laptopBase.position.set(0, 0.075, 0)
scene.add(laptopBase)

// Laptop lid
const laptopLidGeo = new RoundedBoxGeometry(1.0, 0.62, 0.05, 4, 0.02)
const laptopLid = new THREE.Mesh(laptopLidGeo, laptopMat)
laptopLid.position.set(0, 0.375, -0.275)
scene.add(laptopLid)

// Cabinet
const cabinetGeo = new THREE.BoxGeometry(0.8, 1.2, 0.5)
const cabinetMat = new THREE.MeshStandardMaterial({ color: 0x666666 })
const cabinet = new THREE.Mesh(cabinetGeo, cabinetMat)
cabinet.position.set(-2, 0.6, 0)
scene.add(cabinet)

const tempLight = new THREE.AmbientLight(0xffffff, 2)
scene.add(tempLight)

window.addEventListener('resize', () => {
    camera.aspect = window.innerWidth / window.innerHeight
    camera.updateProjectionMatrix()
    renderer.setSize(window.innerWidth, window.innerHeight)
})

function animate() {
    requestAnimationFrame(animate)
    renderer.render(scene, camera)
}

animate()