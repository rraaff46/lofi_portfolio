import * as THREE from 'three'
import { laptopLid, bodyMat } from './meshes.js'

// Canvas resolution
const SW = 3840
const SH = 2160
const SCALE = SW / 1920

export const screenCanvas = document.createElement('canvas')
screenCanvas.width = SW
screenCanvas.height = SH
export const ctx = screenCanvas.getContext('2d')

export const tabs = ['About', 'Work', 'Socials', 'Contact']
export const state = {
    activeTab: 0,
    hoveredTab: -1,
    addressHovered: false
}

// Layout (in 1920x1080 space)
export const TAB_W = 280
export const TAB_OFFSET = 16
export const TAB_GAP = 4
export const TABBAR_H = 50   // toolbar (address bar) on top
export const ADDRESSBAR_H = 50  // tabs underneath
export const CONTENT_Y = TABBAR_H + ADDRESSBAR_H

// Colors
const BG = '#1e1e1e'
const TOOLBAR = '#2d2d2d'
const TABBAR = '#252525'
const CREAM = '#FFD6A5'
const MUTED = '#888888'
const tabColors = ['#ffb3ba', '#ffd93d', '#caffbf', '#9bf6ff']

export const ADDRESS_X = 560
export const ADDRESS_W = 800

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

const s = (v) => v * SCALE

export function drawScreen() {
    screenTexture.needsUpdate = true
    // Background
    ctx.fillStyle = BG
    ctx.fillRect(0, 0, SW, SH)

    // Toolbar — address bar on top
    ctx.fillStyle = TOOLBAR
    ctx.fillRect(0, 0, SW, s(TABBAR_H))

    // Address bar pill — centered
    ctx.fillStyle = '#3a3a3a'
    ctx.beginPath()
    ctx.roundRect(s(ADDRESS_X), s(10), s(ADDRESS_W), s(32), s(16))
    ctx.fill()

    // URL text — centered
    ctx.fillStyle = state.addressHovered ? '#cccccc' : MUTED
    ctx.font = `${s(18)}px Nunito`
    ctx.textAlign = 'center'
    ctx.fillText(`lofi.portfolio/${tabs[state.activeTab].toLowerCase()}`, s(960), s(31))

    // Traffic lights — top right
    const lights = ['#ff5f57', '#febc2e', '#28c840']
    lights.forEach((color, i) => {
        ctx.beginPath()
        ctx.arc(s(1920 - 60 - (2 - i) * 40), s(25), s(10), 0, Math.PI * 2)
        ctx.fillStyle = color
        ctx.fill()
    })

    // Tab bar — underneath toolbar
    ctx.fillStyle = TABBAR
    ctx.fillRect(0, s(TABBAR_H), SW, s(ADDRESSBAR_H))

    tabs.forEach((tab, i) => {
        const x = s(i * (TAB_W + TAB_GAP) + TAB_OFFSET)
        const isActive = i === state.activeTab
        const isHovered = i === state.hoveredTab

        // Tab background
        ctx.fillStyle = isActive ? TOOLBAR : isHovered ? '#2f2f2f' : 'transparent'
        ctx.beginPath()
        ctx.roundRect(x, s(TABBAR_H + 5), s(TAB_W), s(ADDRESSBAR_H - 5), [s(8), s(8), 0, 0])
        ctx.fill()

        // Tab label
        ctx.fillStyle = isActive ? CREAM : isHovered ? '#cccccc' : MUTED
        ctx.font = `${isActive ? 'bold ' : ''}${s(20)}px Comfortaa`
        ctx.textAlign = 'left'
        ctx.fillText(tab, x + s(16), s(TABBAR_H + 32))

        // Colored dot
        ctx.beginPath()
        ctx.arc(x + s(TAB_W - 20), s(TABBAR_H + 25), s(5), 0, Math.PI * 2)
        ctx.fillStyle = tabColors[i]
        ctx.fill()
    })

    // Content area
    ctx.fillStyle = '#ffffff'
    ctx.fillRect(0, s(CONTENT_Y), SW, SH - s(CONTENT_Y))

    // Placeholder content
    ctx.fillStyle = '#333333'
    ctx.font = `bold ${s(60)}px Comfortaa`
    ctx.textAlign = 'center'
    ctx.fillText(tabs[state.activeTab], s(960), s(CONTENT_Y + 120))
}