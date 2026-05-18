import * as THREE from 'three'
import { laptopLid } from './meshes.js'
import { drawScreen, state, TAB_W, TAB_OFFSET, TAB_GAP, TABBAR_H, CONTENT_Y, tabs, ADDRESS_X, ADDRESS_W } from './screen.js'
import { camera, renderer, controls, scene } from './scene.js'

const raycaster = new THREE.Raycaster()
const mouse = new THREE.Vector2()

function getTabIndex(x, y) {
    if (y < TABBAR_H || y > CONTENT_Y) return -1
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
            state.activeTab = tabIndex
            drawScreen()
        }
    }
})

function animate() {
    requestAnimationFrame(animate)
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
        if (newHovered !== state.hoveredTab) {
            state.hoveredTab = newHovered
            drawScreen()
        }

        const newAddressHovered = y >= 0 && y < TABBAR_H && x >= ADDRESS_X && x <= ADDRESS_X + ADDRESS_W
        if (newAddressHovered !== state.addressHovered) {
            state.addressHovered = newAddressHovered
            drawScreen()
        }
    } else {
        document.body.style.cursor = 'default'
        controls.enabled = true
        if (state.hoveredTab !== -1) {
            state.hoveredTab = -1
            state.addressHovered = false
            drawScreen()
        }
    }

    renderer.render(scene, camera)
}

document.fonts.ready.then(() => {
    drawScreen()
})

animate()