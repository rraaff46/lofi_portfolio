import * as THREE from 'three'
import { laptopLid } from './meshes.js'
import { screenTexture, drawScreen, TAB_W, TAB_OFFSET, TAB_GAP, tabs } from './screen.js'
import * as screen from './screen.js'
import { camera, renderer, controls, scene } from './scene.js'

const raycaster = new THREE.Raycaster()
const mouse = new THREE.Vector2()

function getTabIndex(x, y) {
    if (y > 60 || y < 0) return -1
    return tabs.findIndex((_, i) => {
        const tabX = i * (TAB_W + TAB_GAP) + TAB_OFFSET
        return x >= tabX && x <= tabX + TAB_W
    })
}

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

        const tabIndex = getTabIndex(x, y)
        if (tabIndex !== -1) {
            screen.state.activeTab = tabIndex
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

        const newHovered = getTabIndex(x, y)
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

document.fonts.ready.then(() => {
    drawScreen()
})

animate()