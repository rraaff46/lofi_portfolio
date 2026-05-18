import * as THREE from 'three'
import { laptopLid } from './meshes.js'

// Canvas resolution
const SW = 3840
const SH = 2160
const SCALE = SW / 1920 // 2x — alle Werte mit SCALE multiplizieren

const bodyMat = new THREE.MeshStandardMaterial({ color: 0x555555 })

export const screenCanvas = document.createElement('canvas')
screenCanvas.width = SW
screenCanvas.height = SH
export const ctx = screenCanvas.getContext('2d')

export const tabs = ['About', 'Work', 'Socials', 'Contact']
export const state = {
    activeTab: 0,
    hoveredTab: -1
}

// Layout (in 1920x1080 space, SCALE applied when drawing)
export const TAB_W = 280
export const TAB_OFFSET = 16
export const TAB_GAP = 4
export const TABBAR_H = 60
export const ADDRESSBAR_H = 70
export const CONTENT_Y = TABBAR_H + ADDRESSBAR_H

// Colors
const BG = '#1e1e1e'
const TOOLBAR = '#2d2d2d'
const TABBAR = '#252525'
const CREAM = '#FFD6A5'
const MUTED = '#888888'
const tabColors = ['#ffb3ba', '#ffd93d', '#caffbf', '#9bf6ff']

export const screenTexture = new THREE.CanvasTexture(screenCanvas)

laptopLid.material = [
    bodyMat, bodyMat, bodyMat, bodyMat,
    new THREE.MeshStandardMaterial({
        map: screenTexture,
        emissive: new THREE.Color(0xffffff),
        emissiveMap: screenTexture,
        emissiveIntensity: 0.3
    }),
    bodyMat
]

// Helper — scale a value from 1920 space to canvas space
const s = (v) => v * SCALE

export function drawScreen() {
    // Background
    ctx.fillStyle = BG
    ctx.fillRect(0, 0, SW, SH)

    // Tab bar
    ctx.fillStyle = TABBAR
    ctx.fillRect(0, 0, SW, s(TABBAR_H))

    tabs.forEach((tab, i) => {
        const x = s(i * (TAB_W + TAB_GAP) + TAB_OFFSET)
        const isActive = i === state.activeTab
        const isHovered = i === state.hoveredTab

        // Tab background
        ctx.fillStyle = isActive ? TOOLBAR : isHovered ? '#2f2f2f' : 'transparent'
        ctx.beginPath()
        ctx.roundRect(x, s(10), s(TAB_W), s(50), [s(8), s(8), 0, 0])
        ctx.fill()

        // Tab label
        ctx.fillStyle = isActive ? CREAM : isHovered ? '#cccccc' : MUTED
        ctx.font = `${isActive ? 'bold ' : ''}${s(24)}px Comfortaa`
        ctx.textAlign = 'left'
        ctx.fillText(tab, x + s(20), s(43))

        // Colored dot
        ctx.beginPath()
        ctx.arc(x + s(TAB_W - 20), s(35), s(6), 0, Math.PI * 2)
        ctx.fillStyle = tabColors[i]
        ctx.fill()
    })

    // Address bar background
    ctx.fillStyle = TOOLBAR
    ctx.fillRect(0, s(TABBAR_H), SW, s(ADDRESSBAR_H))

    // Address bar pill
    ctx.fillStyle = '#3a3a3a'
    ctx.beginPath()
    ctx.roundRect(s(200), s(75), s(1300), s(40), s(20))
    ctx.fill()

    // URL text
    ctx.fillStyle = MUTED
    ctx.font = `${s(22)}px Nunito`
    ctx.textAlign = 'center'
    ctx.fillText(`lofi.portfolio/${tabs[state.activeTab].toLowerCase()}`, s(850), s(101))

    // Traffic lights
    const lights = ['#ff5f57', '#febc2e', '#28c840']
    lights.forEach((color, i) => {
        ctx.beginPath()
        ctx.arc(s(60 + i * 40), s(95), s(12), 0, Math.PI * 2)
        ctx.fillStyle = color
        ctx.fill()
    })

    // Content area
    ctx.fillStyle = '#ffffff'
    ctx.fillRect(0, s(CONTENT_Y), SW, SH - s(CONTENT_Y))

    // Placeholder content
    ctx.fillStyle = '#333333'
    ctx.font = `bold ${s(60)}px Comfortaa`
    ctx.textAlign = 'center'
    ctx.fillText(tabs[state.activeTab], s(960), s(300))
}