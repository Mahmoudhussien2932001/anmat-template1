import { riyadh } from './settings.js'

export const globeMotion = {
  intro: 0,
  scroll: 0,
  yaw: -Math.PI / 2 - (riyadh.lon * Math.PI) / 180,
  spin: 0,
  hold: false,
  drag: false,
  audience: 0,
  active: true,
  reduced: false,
  lookX: 0,
  lookY: 0,
}

export function faceLongitude(lon) {
  return -Math.PI / 2 - (lon * Math.PI) / 180
}

export function holdGlobe(value) {
  globeMotion.hold = value
}

export function lookGlobe(x, y) {
  globeMotion.lookX = x
  globeMotion.lookY = y
}
