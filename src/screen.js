import * as THREE from 'three'
import { laptopLid } from './meshes.js'

const bodyMat = new THREE.MeshStandardMaterial({ color: 0x555555 })

export const screenCanvas = document.createElement('canvas')
screenCanvas.width = 1920
screenCanvas.height = 1080
export const ctx = screenCanvas.getContext('2d')

export const tabs = ['About', 'Work', 'Socials', 'Contact']
export const state = {
    activeTab: 0,
    hoveredTab: -1
}

export const TAB_HEIGHT = 80
export const TAB_WIDTH = 1920 / tabs.length

export const screenTexture = new THREE.CanvasTexture(screenCanvas)

laptopLid.material = [
    bodyMat, bodyMat, bodyMat, bodyMat,
    new THREE.MeshStandardMaterial({ map: screenTexture }),
    bodyMat
]

export function drawScreen() {
    ctx.fillStyle = '#1a1a2e'
    ctx.fillRect(0, 0, 1920, 1080)

    const tabColors = ['#ff6b8a', '#ff9f45', '#ffd93d', '#6bcb77']
    tabs.forEach((tab, i) => {
        const x = i * TAB_WIDTH

        if (i === state.activeTab) {
            ctx.fillStyle = tabColors[i]
        } else if (i === state.hoveredTab) {
            ctx.fillStyle = tabColors[i] + 'aa'
        } else {
            ctx.fillStyle = '#111122'
        }

        ctx.fillRect(x, 0, TAB_WIDTH, TAB_HEIGHT)

        ctx.fillStyle = i === state.activeTab ? '#333333' : '#ffffff'
        ctx.font = 'bold 36px Nunito'
        ctx.textAlign = 'center'
        ctx.fillText(tab, x + TAB_WIDTH / 2, 52)
    })

    ctx.fillStyle = '#ffffff'
    ctx.font = 'bold 60px sans-serif'
    ctx.textAlign = 'center'
    ctx.fillText(tabs[state.activeTab], 960, 600)
}