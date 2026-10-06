import { useEffect, useMemo, useRef, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { Canvas, useFrame, useThree } from '@react-three/fiber'
import { AdaptiveDpr, useTexture } from '@react-three/drei'
import { Quaternion, Raycaster, SRGBColorSpace, Vector2, Vector3 } from 'three'
import { company } from '../../data/company.js'
import { visibleMarkers } from '../../data/markers.js'
import { globeMotion, holdGlobe, lookGlobe } from '../../motion/globeMotion.js'
import { createAtmosphereMaterial } from './earthMaterial.js'

const EARTH_MAP = '/images/globe/earth-day.jpg'

const pinGroups = new Map()
const projected = new Vector3()
const up = new Vector3(0, 1, 0)
const normal = new Vector3()
const view = new Vector3()
const world = new Vector3()
const pointer = new Vector2()
const quaternion = new Quaternion()
const raycaster = new Raycaster()

function toVector(lat, lon, radius) {
  const phi = ((lon + 180) * Math.PI) / 180
  const theta = ((90 - lat) * Math.PI) / 180
  return new Vector3(
    -radius * Math.cos(phi) * Math.sin(theta),
    radius * Math.cos(theta),
    radius * Math.sin(phi) * Math.sin(theta),
  )
}

function markerFromHit(hit) {
  let node = hit.object
  while (node) {
    if (node.userData?.markerId) return node.userData.markerId
    node = node.parent
  }
  return null
}

function fitDistance(camera) {
  const radius = 1.18
  const half = (camera.fov * Math.PI) / 360
  const vertical = radius / Math.tan(half)
  const horizontal = radius / (Math.tan(half) * Math.max(camera.aspect, 0.65))
  return Math.max(vertical, horizontal) * 1.28
}

function PinMesh({ marker, mobile, accent }) {
  const group = useRef(null)
  const position = useMemo(() => toVector(marker.lat, marker.lon, 1.018), [marker.lat, marker.lon])

  useEffect(() => {
    const node = group.current
    if (!node) return undefined
    node.userData.markerId = marker.id
    pinGroups.set(marker.id, node)
    normal.copy(position).normalize()
    node.quaternion.copy(quaternion.setFromUnitVectors(up, normal))
    node.position.copy(position)
    return () => pinGroups.delete(marker.id)
  }, [marker.id, position])

  useFrame(({ camera }) => {
    const node = group.current
    if (!node) return
    node.getWorldPosition(world)
    normal.copy(world).normalize()
    camera.getWorldDirection(view)
    node.visible = normal.dot(view) < -0.08
    const office = marker.kind === 'office'
    const weight = office ? 1 - globeMotion.audience * 0.2 : 0.8 + globeMotion.audience * 0.2
    const focus = accent === marker.id ? 1.18 : 1
    node.scale.setScalar((mobile ? 0.92 : 1) * weight * focus)
  })

  const gold = marker.kind === 'office'
  return (
    <group ref={group}>
      <mesh position={[0, 0.04, 0]}>
        <cylinderGeometry args={[0.005, 0.009, 0.08, 10]} />
        <meshStandardMaterial color={gold ? '#f0e2b8' : '#ffffff'} roughness={0.4} metalness={0.08} />
      </mesh>
      <mesh position={[0, 0.09, 0]}>
        <sphereGeometry args={[0.02, 18, 18]} />
        <meshStandardMaterial
          color={gold ? '#f6edd4' : '#ffffff'}
          emissive={gold ? '#7A744F' : '#065670'}
          emissiveIntensity={0.4}
          roughness={0.35}
        />
      </mesh>
    </group>
  )
}

function EarthSphere({ mobile, accent }) {
  const globe = useRef(null)
  const atmosphere = useMemo(() => createAtmosphereMaterial(), [])
  const map = useTexture(EARTH_MAP, (texture) => {
    texture.colorSpace = SRGBColorSpace
    texture.anisotropy = 8
  })
  const segments = mobile ? 64 : 128

  useEffect(() => () => atmosphere.dispose(), [atmosphere])

  useFrame(({ camera }, delta) => {
    const node = globe.current
    if (!node) return
    if (!globeMotion.hold && !globeMotion.drag && globeMotion.intro > 0.98 && globeMotion.scroll < 0.2 && !globeMotion.reduced) {
      globeMotion.spin += delta * 0.03
    }
    node.rotation.y = globeMotion.yaw + globeMotion.spin
    node.rotation.x = -0.05
    const distance = fitDistance(camera)
    camera.position.set(globeMotion.lookX * 0.04, 0.02 + globeMotion.lookY * 0.02, distance)
    camera.lookAt(0, 0, 0)
  })

  return (
    <group ref={globe}>
      <mesh>
        <sphereGeometry args={[1, segments, Math.round(segments * 0.75)]} />
        <meshStandardMaterial map={map} roughness={0.92} metalness={0.04} />
      </mesh>
      <mesh scale={1.028} material={atmosphere}>
        <sphereGeometry args={[1, mobile ? 32 : 48, mobile ? 20 : 32]} />
      </mesh>
      {visibleMarkers.map((marker) => (
        <PinMesh key={marker.id} marker={marker} mobile={mobile} accent={accent} />
      ))}
    </group>
  )
}

function PointerControl({ onAccent, coarse, bridgeRef }) {
  const { camera, gl, scene } = useThree()

  useEffect(() => {
    let dragging = false
    let lastX = 0
    let closeTimer = 0
    const clearClose = () => window.clearTimeout(closeTimer)
    const scheduleClose = () => {
      if (coarse) return
      clearClose()
      closeTimer = window.setTimeout(() => {
        if (globeMotion.drag) return
        holdGlobe(false)
        onAccent(null)
      }, 280)
    }
    bridgeRef.current = { cancel: clearClose, schedule: scheduleClose }
    const idAt = (event) => {
      const bounds = gl.domElement.getBoundingClientRect()
      pointer.x = ((event.clientX - bounds.left) / bounds.width) * 2 - 1
      pointer.y = -((event.clientY - bounds.top) / bounds.height) * 2 + 1
      raycaster.setFromCamera(pointer, camera)
      return raycaster.intersectObjects(scene.children, true).map(markerFromHit).find(Boolean) ?? null
    }
    const onDown = (event) => {
      if (event.button != null && event.button !== 0) return
      const id = idAt(event)
      if (id) {
        holdGlobe(true)
        onAccent(id)
        return
      }
      dragging = true
      globeMotion.drag = true
      lastX = event.clientX
    }
    const onMove = (event) => {
      if (dragging) {
        globeMotion.yaw += (event.clientX - lastX) * 0.0055
        lastX = event.clientX
        return
      }
      if (coarse) return
      const id = idAt(event)
      holdGlobe(Boolean(id) || globeMotion.drag)
      if (id) {
        clearClose()
        onAccent(id)
      }
    }
    const onUp = () => {
      dragging = false
      globeMotion.drag = false
    }
    const onLeave = () => {
      dragging = false
      globeMotion.drag = false
      scheduleClose()
    }
    const node = gl.domElement
    node.addEventListener('pointerdown', onDown)
    node.addEventListener('pointermove', onMove)
    node.addEventListener('pointerup', onUp)
    node.addEventListener('pointerleave', onLeave)
    node.addEventListener('pointercancel', onUp)
    return () => {
      clearClose()
      bridgeRef.current = { cancel() {}, schedule() {} }
      node.removeEventListener('pointerdown', onDown)
      node.removeEventListener('pointermove', onMove)
      node.removeEventListener('pointerup', onUp)
      node.removeEventListener('pointerleave', onLeave)
      node.removeEventListener('pointercancel', onUp)
    }
  }, [bridgeRef, camera, coarse, gl, onAccent, scene])

  return null
}

function CardProjector({ accent, cardRef }) {
  const { camera, size } = useThree()
  useFrame(() => {
    const card = cardRef.current
    const pin = accent ? pinGroups.get(accent) : null
    if (!card) return
    if (!pin?.visible) {
      card.style.opacity = '0'
      card.style.pointerEvents = 'none'
      return
    }
    pin.getWorldPosition(projected)
    projected.project(camera)
    if (projected.z > 1) {
      card.style.opacity = '0'
      card.style.pointerEvents = 'none'
      return
    }
    const width = card.offsetWidth || 240
    const height = card.offsetHeight || 140
    const margin = 8
    let left = (projected.x * 0.5 + 0.5) * size.width + 16
    let top = (-projected.y * 0.5 + 0.5) * size.height - height * 0.4
    if (left + width > size.width - margin) left = (projected.x * 0.5 + 0.5) * size.width - width - 16
    left = Math.min(Math.max(margin, left), size.width - width - margin)
    top = Math.min(Math.max(margin, top), size.height - height - margin)
    card.style.opacity = '1'
    card.style.pointerEvents = 'auto'
    card.style.transform = `translate3d(${left}px, ${top}px, 0)`
  })
  return null
}

function StillFrame() {
  const invalidate = useThree((state) => state.invalidate)
  useEffect(() => {
    invalidate()
  }, [invalidate])
  return null
}

export default function HeroGlobe({ accent, onAccent, live = true }) {
  const { t, i18n } = useTranslation()
  const cardRef = useRef(null)
  const bridgeRef = useRef({ cancel() {}, schedule() {} })
  const label = visibleMarkers.find((marker) => marker.id === accent)
  const language = i18n.language === 'en' ? 'en' : 'ar'
  const [mobile, setMobile] = useState(() => window.matchMedia('(max-width: 800px)').matches)
  const [reduced, setReduced] = useState(() => window.matchMedia('(prefers-reduced-motion: reduce)').matches)
  const [coarse, setCoarse] = useState(() => window.matchMedia('(pointer: coarse)').matches)
  const office = label?.kind === 'office'
  const address = office ? (language === 'en' ? company.addressEn : company.address) : null
  const phone = office ? company.phone : null

  useEffect(() => {
    const media = window.matchMedia('(max-width: 800px)')
    const reducedMedia = window.matchMedia('(prefers-reduced-motion: reduce)')
    const coarseMedia = window.matchMedia('(pointer: coarse)')
    const sync = () => {
      setMobile(media.matches)
      setReduced(reducedMedia.matches)
      setCoarse(coarseMedia.matches)
      globeMotion.reduced = reducedMedia.matches
      if (reducedMedia.matches) globeMotion.intro = 1
    }
    sync()
    media.addEventListener('change', sync)
    reducedMedia.addEventListener('change', sync)
    coarseMedia.addEventListener('change', sync)
    const fine = window.matchMedia('(hover: hover) and (pointer: fine)')
    const onPointer = (event) => {
      if (!fine.matches || reducedMedia.matches || globeMotion.drag) {
        lookGlobe(0, 0)
        return
      }
      lookGlobe((event.clientX / window.innerWidth) * 2 - 1, (event.clientY / window.innerHeight) * 2 - 1)
    }
    window.addEventListener('pointermove', onPointer, { passive: true })
    return () => {
      media.removeEventListener('change', sync)
      reducedMedia.removeEventListener('change', sync)
      coarseMedia.removeEventListener('change', sync)
      window.removeEventListener('pointermove', onPointer)
    }
  }, [])

  const frameloop = live && !reduced ? 'always' : 'demand'

  return (
    <div className="globe-canvas">
      <Canvas
        frameloop={frameloop}
        dpr={mobile ? [1, 1.25] : [1, 1.5]}
        camera={{ position: [0, 0.02, 4.6], fov: 28 }}
        gl={{ alpha: true, antialias: !mobile, powerPreference: 'low-power' }}
        onPointerMissed={() => {
          if (!coarse) {
            holdGlobe(false)
            onAccent(null)
          }
        }}
      >
        <AdaptiveDpr />
        <ambientLight intensity={0.35} />
        <directionalLight position={[-4.5, 3.8, 5.2]} intensity={2.1} color="#fff4e6" />
        <directionalLight position={[3.2, -1.2, -2.8]} intensity={0.28} color="#8eb6d8" />
        <EarthSphere mobile={mobile} accent={accent} />
        <CardProjector accent={accent} cardRef={cardRef} />
        <PointerControl onAccent={onAccent} coarse={coarse} bridgeRef={bridgeRef} />
        {frameloop === 'always' ? null : <StillFrame />}
      </Canvas>
      <article
        className="pin-card"
        ref={cardRef}
        hidden={!label}
        onPointerEnter={() => {
          bridgeRef.current.cancel()
          holdGlobe(true)
        }}
        onPointerLeave={() => bridgeRef.current.schedule()}
      >
        {label ? (
          <>
            <p className="pin-kind">{label.kind === 'office' ? t('globe.office') : t('globe.project')}</p>
            <h2>{label.label[language]}</h2>
            <p>
              <span>{t('globe.address')}</span>
              {address ?? t('globe.noAddress')}
            </p>
            <p>
              <span>{t('globe.phone')}</span>
              {phone ? <a href={company.phoneHref} dir="ltr">{phone}</a> : t('globe.noPhone')}
            </p>
            <p className="fine">{t('globe.coords')}</p>
            {coarse ? (
              <button
                type="button"
                className="icon-button"
                onClick={() => {
                  holdGlobe(false)
                  onAccent(null)
                }}
              >
                {t('globe.closeCard')}
              </button>
            ) : null}
          </>
        ) : null}
      </article>
    </div>
  )
}
