import * as THREE from 'three'
import { OrbitControls } from 'three/addons/controls/OrbitControls.js'

export const scene = new THREE.Scene()
scene.background = new THREE.Color(0xffffff)

export const laptopCenter = new THREE.Vector3(0, 1.1, -0.3)

export const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000)
camera.position.set(0, 1.1, 0.19)
camera.lookAt(laptopCenter)

export const renderer = new THREE.WebGLRenderer({ antialias: true })
renderer.setSize(window.innerWidth, window.innerHeight)
document.body.appendChild(renderer.domElement)

export const controls = new OrbitControls(camera, renderer.domElement)
controls.enableDamping = true
controls.target.copy(laptopCenter)
controls.update()

const ambientLight = new THREE.AmbientLight(0xffffff, 0.5)
scene.add(ambientLight)

const dirLight = new THREE.DirectionalLight(0xffffff, 2)
dirLight.position.set(5, 8, 5)
scene.add(dirLight)

const fillLight = new THREE.PointLight(0xffffff, 0.5)
fillLight.position.set(-3, 3, -3)
scene.add(fillLight)

window.addEventListener('resize', () => {
    camera.aspect = window.innerWidth / window.innerHeight
    camera.updateProjectionMatrix()
    renderer.setSize(window.innerWidth, window.innerHeight)
})