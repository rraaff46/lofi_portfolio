import * as THREE from 'three'
import { laptopLid } from './meshes.js'
import { screenTexture, drawScreen, TAB_HEIGHT, TAB_WIDTH } from './screen.js'
import * as screen from './screen.js'
import { camera, renderer, controls, scene } from './scene.js'

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
            screen.state.activeTab = Math.floor(x / TAB_WIDTH)
            drawScreen()
        }
    }
})

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
        if (newHovered !== screen.state.hoveredTab) {
            screen.state.hoveredTab = newHovered
            drawScreen()
        }
    } else {
        document.body.style.cursor = 'default'
        controls.enabled = true
        if (screen.state.hoveredTab !== -1) {
            screen.state.hoveredTab = -1
            drawScreen()
        }
    }

    renderer.render(scene, camera)
}

animate()