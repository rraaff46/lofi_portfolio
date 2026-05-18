import * as THREE from 'three'
import { scene } from './scene.js'

const bodyMat = new THREE.MeshStandardMaterial({ color: 0x555555 })

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

// Laptop base
export const laptopBase = new THREE.Mesh(new THREE.BoxGeometry(1.0, 0.05, 0.65), bodyMat)
laptopBase.position.set(0, 0.825, 0)
scene.add(laptopBase)

// Laptop lid (material set in screen.js)
export const laptopLid = new THREE.Mesh(new THREE.BoxGeometry(1.0, 0.5625, 0.05), bodyMat)
laptopLid.position.set(0, 1.11, -0.3)
scene.add(laptopLid)

// Cabinet
const cabinet = new THREE.Mesh(
    new THREE.BoxGeometry(1.2, 2.4, 0.6),
    new THREE.MeshStandardMaterial({ color: 0x666666 })
)
cabinet.position.set(-2.5, 1.2, 0)
scene.add(cabinet)