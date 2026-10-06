"use client";;
import React, { useRef, useMemo, useState, useCallback, useEffect, useLayoutEffect, Suspense } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { OrbitControls, Html, useTexture } from "@react-three/drei";
import * as THREE from "three";
import { cn } from "@/lib/utils";

// ============================================================================
// Constants - Earth Texture URLs (NASA Blue Marble)
// ============================================================================

const DEFAULT_EARTH_TEXTURE =
  "https://unpkg.com/three-globe@2.31.0/example/img/earth-blue-marble.jpg";
const DEFAULT_BUMP_TEXTURE =
  "https://unpkg.com/three-globe@2.31.0/example/img/earth-topology.png";

// Camera distance leaves a margin around the atmosphere and the pin heads.
const FRAME_Y = 0.08;
const FRAME_Z = 3.58;

// ============================================================================
// Utility Functions
// ============================================================================

/**
 * Convert latitude/longitude to 3D cartesian coordinates
 */
function latLngToVector3(lat, lng, radius) {
  const phi = (90 - lat) * (Math.PI / 180);
  const theta = (lng + 180) * (Math.PI / 180);

  const x = -(radius * Math.sin(phi) * Math.cos(theta));
  const z = radius * Math.sin(phi) * Math.sin(theta);
  const y = radius * Math.cos(phi);

  return new THREE.Vector3(x, y, z);
}

function Marker({
  marker,
  radius,
  pinned,
  pulse,
  onClick,
  onHover,
  onDismiss,
}) {
  const [hovered, setHovered] = useState(false);
  const [isVisible, setIsVisible] = useState(true);
  const groupRef = useRef(null);
  const pulseRef = useRef(null);
  const visibleRef = useRef(true);
  const worldPos = useRef(new THREE.Vector3());
  const markerDirection = useRef(new THREE.Vector3());
  const cameraDirection = useRef(new THREE.Vector3());
  const { camera } = useThree();
  const phase = marker.lat * 0.17 + marker.lng * 0.05;

  const placement = useMemo(() => {
    const normal = latLngToVector3(marker.lat, marker.lng, 1).normalize();
    const quaternion = new THREE.Quaternion().setFromUnitVectors(new THREE.Vector3(0, 1, 0), normal);
    return {
      position: normal.clone().multiplyScalar(radius * 1.012),
      quaternion,
    };
  }, [marker.lat, marker.lng, radius]);

  useFrame(({ clock }) => {
    if (!groupRef.current) return;
    groupRef.current.getWorldPosition(worldPos.current);
    markerDirection.current.copy(worldPos.current).normalize();
    cameraDirection.current.copy(camera.position).normalize();
    const facing = markerDirection.current.dot(cameraDirection.current) > 0.1;
    if (facing !== visibleRef.current) {
      visibleRef.current = facing;
      setIsVisible(facing);
    }
    if (!pulseRef.current) return;
    if (!pulse) {
      pulseRef.current.scale.setScalar(1);
      return;
    }
    const wave = (Math.sin(clock.elapsedTime * 2.05 + phase) + 1) / 2;
    pulseRef.current.scale.setScalar(1 + wave * 0.7);
    pulseRef.current.material.opacity = 0.42 * (1 - wave);
  });

  useEffect(() => {
    if (!isVisible && pinned) onDismiss?.(marker);
  }, [isVisible, pinned, marker, onDismiss]);

  const handlePointerEnter = useCallback((event) => {
    event.stopPropagation();
    if (event.nativeEvent?.target?.style) event.nativeEvent.target.style.cursor = "pointer";
    setHovered(true);
    onHover?.(marker);
  }, [marker, onHover]);

  const handlePointerLeave = useCallback((event) => {
    if (event.nativeEvent?.target?.style) event.nativeEvent.target.style.cursor = "";
    setHovered(false);
    onHover?.(null);
  }, [onHover]);

  const handleClick = useCallback((event) => {
    event.stopPropagation();
    if (pinned) {
      setHovered(false);
      onDismiss?.(marker);
      return;
    }
    onClick?.(marker);
  }, [marker, onClick, onDismiss, pinned]);

  const open = isVisible && (hovered || pinned);
  const gold = open ? "#f4f7f8" : "#cbb98a";

  if (marker.shape === "market") {
    const scale = (radius / 1.5);
    const stemHeight = 0.07 * scale;
    const headRadius = 0.036 * scale;
    const emphasized = open ? 1.45 : 1;
    return (
      <group ref={groupRef} position={placement.position} quaternion={placement.quaternion} visible={isVisible} renderOrder={2}>
        <group scale={emphasized}>
          <mesh ref={pulseRef} position={[0, 0.015 * scale, 0]} rotation={[Math.PI / 2, 0, 0]} renderOrder={2}>
            <ringGeometry args={[0.06 * scale, 0.068 * scale, 40]} />
            <meshBasicMaterial color="#cbb98a" transparent opacity={open ? 0.75 : 0.28} depthWrite={false} side={THREE.DoubleSide} />
          </mesh>
          <mesh position={[0, stemHeight * 0.57, 0]} renderOrder={3}>
            <cylinderGeometry args={[0.009 * scale, 0.016 * scale, stemHeight, 8]} />
            <meshStandardMaterial color="#cbb98a" emissive="#7A744F" emissiveIntensity={open ? 0.55 : 0.28} metalness={0.42} roughness={0.4} transparent opacity={open ? 1 : 0.92} />
          </mesh>
          <mesh position={[0, 0.09 * scale, 0]} renderOrder={4}>
            <sphereGeometry args={[headRadius, 16, 12]} />
            <meshStandardMaterial color={open ? "#f4f7f8" : "#cbb98a"} emissive={open ? "#cbb98a" : "#7A744F"} emissiveIntensity={open ? 0.7 : 0.35} metalness={0.42} roughness={0.4} />
          </mesh>
          <mesh
            position={[0, 0.07 * scale, 0]}
            renderOrder={5}
            onPointerOver={handlePointerEnter}
            onPointerOut={handlePointerLeave}
            onClick={handleClick}
          >
            <sphereGeometry args={[headRadius * 2.4, 12, 12]} />
            <meshBasicMaterial transparent opacity={0} depthWrite={false} />
          </mesh>
        </group>
      </group>
    );
  }

  return (
    <group ref={groupRef} position={placement.position} quaternion={placement.quaternion} visible={isVisible} renderOrder={2}>
      <mesh ref={pulseRef} position={[0, 0.02, 0]} rotation={[Math.PI / 2, 0, 0]} renderOrder={2}>
        <ringGeometry args={[0.14, 0.22, 36]} />
        <meshBasicMaterial color="#cbb98a" transparent opacity={0.7} depthWrite={false} depthTest side={THREE.DoubleSide} />
      </mesh>
      <group scale={open ? 1.12 : 1}>
        <mesh position={[0, 0.26, 0]} renderOrder={2}>
          <sphereGeometry args={[0.2, 18, 18]} />
          <meshBasicMaterial color="#cbb98a" transparent opacity={0.28} depthWrite={false} depthTest />
        </mesh>
        <mesh position={[0, 0.15, 0]} rotation={[Math.PI, 0, 0]} renderOrder={3}>
          <coneGeometry args={[0.12, 0.3, 18]} />
          <meshStandardMaterial color={gold} emissive="#7A744F" emissiveIntensity={open ? 0.7 : 0.4} roughness={0.28} metalness={0.12} />
        </mesh>
        <mesh position={[0, 0.34, 0]} renderOrder={4}>
          <sphereGeometry args={[0.125, 24, 24]} />
          <meshStandardMaterial color="#f4f7f8" emissive="#cbb98a" emissiveIntensity={0.25} roughness={0.3} metalness={0.05} />
        </mesh>
        <mesh
          position={[0, 0.34, 0]}
          renderOrder={5}
          onPointerOver={handlePointerEnter}
          onPointerOut={handlePointerLeave}
          onClick={handleClick}
        >
          <sphereGeometry args={[0.086, 24, 24]} />
          <meshStandardMaterial color={open ? "#f4f7f8" : "#065670"} emissive={open ? "#cbb98a" : "#7A744F"} emissiveIntensity={open ? 0.85 : 0.65} roughness={0.25} metalness={0.16} />
        </mesh>
        <mesh
          position={[0, 0.28, 0]}
          renderOrder={6}
          onPointerOver={handlePointerEnter}
          onPointerOut={handlePointerLeave}
          onClick={handleClick}
        >
          <sphereGeometry args={[0.2, 14, 14]} />
          <meshBasicMaterial transparent opacity={0} depthWrite={false} />
        </mesh>
      </group>
    </group>
  );
}

function RotatingGlobe({
  config,
  markers,
  pinnedId,
  onMarkerClick,
  onMarkerHover,
  onDismiss,
}) {
  const groupRef = useRef(null);

  useLayoutEffect(() => {
    const focus = config.focus;
    if (!groupRef.current || !focus) return;
    const point = latLngToVector3(focus.lat, focus.lng, 1);
    groupRef.current.rotation.y = -Math.atan2(point.x, point.z);
  }, [config.focus]);

  const [earthTexture, bumpTexture] = useTexture(
    [config.textureUrl, config.bumpMapUrl],
    (loaded) => {
      const [earth, bump] = loaded;
      earth.colorSpace = THREE.SRGBColorSpace;
      earth.anisotropy = 16;
      bump.anisotropy = 8;
    },
  );

  // Create geometries
  const geometry = useMemo(() => {
    return new THREE.SphereGeometry(config.radius, 64, 64);
  }, [config.radius]);

  const wireframeGeometry = useMemo(() => {
    return new THREE.SphereGeometry(config.radius * 1.002, 32, 16);
  }, [config.radius]);

  return (
    <group ref={groupRef}>
      {/* Main globe mesh with Earth texture */}
      <mesh geometry={geometry}>
        <meshStandardMaterial
          map={earthTexture}
          bumpMap={bumpTexture}
          bumpScale={config.bumpScale * 0.05}
          roughness={0.7}
          metalness={0.0}
        />
      </mesh>

      {/* Wireframe overlay */}
      {config.showWireframe && (
        <mesh geometry={wireframeGeometry}>
          <meshBasicMaterial
            color={config.wireframeColor}
            wireframe
            transparent
            opacity={0.08}
          />
        </mesh>
      )}

      {/* Markers - now inside the rotating group */}
      {markers.map((marker, index) => (
        <Marker
          key={marker.id || `marker-${index}-${marker.lat}-${marker.lng}`}
          marker={marker}
          radius={config.radius}
          pinned={pinnedId != null && pinnedId === marker.id}
          pulse={config.pulse !== false}
          onClick={onMarkerClick}
          onHover={onMarkerHover}
          onDismiss={onDismiss}
        />
      ))}
    </group>
  );
}

function Atmosphere({
  radius,
  color,
  intensity,
  blur
}) {
  // blur controls the fresnel exponent: lower = more diffuse, higher = sharper edge
  // We invert it so higher blur value = more diffuse (lower exponent)
  const fresnelPower = Math.max(0.5, 5 - blur);

  const atmosphereMaterial = useMemo(() => {
    return new THREE.ShaderMaterial({
      uniforms: {
        atmosphereColor: { value: new THREE.Color(color) },
        intensity: { value: intensity },
        fresnelPower: { value: fresnelPower },
      },
      vertexShader: `
        varying vec3 vNormal;
        varying vec3 vPosition;
        void main() {
          vNormal = normalize(normalMatrix * normal);
          vPosition = (modelViewMatrix * vec4(position, 1.0)).xyz;
          gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
        }
      `,
      fragmentShader: `
        uniform vec3 atmosphereColor;
        uniform float intensity;
        uniform float fresnelPower;
        varying vec3 vNormal;
        varying vec3 vPosition;
        void main() {
          float fresnel = pow(1.0 - abs(dot(vNormal, normalize(-vPosition))), fresnelPower);
          gl_FragColor = vec4(atmosphereColor, fresnel * intensity);
        }
      `,
      side: THREE.BackSide,
      transparent: true,
      depthWrite: false,
    });
  }, [color, intensity, fresnelPower]);

  return (
    <mesh scale={[1.08, 1.08, 1.08]}>
      <sphereGeometry args={[radius, 64, 32]} />
      <primitive object={atmosphereMaterial} attach="material" />
    </mesh>
  );
}

function Scene({
  markers,
  config,
  pinnedId = null,
  onMarkerClick,
  onMarkerHover
}) {
  const { camera } = useThree();
  const [hoveredId, setHoveredId] = useState(null);
  const held = pinnedId != null || hoveredId != null;

  React.useEffect(() => {
    camera.position.set(0, config.radius * FRAME_Y, config.radius * FRAME_Z);
    camera.lookAt(0, 0, 0);
  }, [camera, config.radius]);

  const handleHover = useCallback((marker) => {
    setHoveredId(marker?.id ?? null);
    onMarkerHover?.(marker);
  }, [onMarkerHover]);

  const handleClick = useCallback((marker) => {
    onMarkerClick?.(marker);
  }, [onMarkerClick]);

  const handleDismiss = useCallback((marker) => {
    setHoveredId((current) => (current === marker.id ? null : current));
    onMarkerHover?.(null);
    onMarkerClick?.(null);
  }, [onMarkerClick, onMarkerHover]);

  return (
    <>
      {/* Lighting */}
      <ambientLight intensity={config.ambientIntensity} />
      <directionalLight
        position={[config.radius * 5, config.radius * 2, config.radius * 5]}
        intensity={config.pointLightIntensity}
        color="#fff8ee"
      />
      <directionalLight
        position={[-config.radius * 3, config.radius, -config.radius * 2]}
        intensity={config.pointLightIntensity * 0.22}
        color="#cbb98a"
      />

      {/* Rotating Globe with Markers */}
      <RotatingGlobe
        config={config}
        markers={markers}
        pinnedId={pinnedId}
        onMarkerClick={handleClick}
        onMarkerHover={handleHover}
        onDismiss={handleDismiss}
      />

      {/* Atmosphere (static) */}
      {config.showAtmosphere && (
        <Atmosphere
          radius={config.radius}
          color={config.atmosphereColor}
          intensity={config.atmosphereIntensity}
          blur={config.atmosphereBlur}
        />
      )}

      {/* Controls */}
      <OrbitControls
        makeDefault
        enablePan={config.enablePan}
        enableZoom={config.enableZoom}
        enableRotate={config.enableRotate}
        minDistance={config.minDistance}
        maxDistance={config.maxDistance}
        rotateSpeed={0.4}
        autoRotate={config.autoRotateSpeed > 0 && !held}
        autoRotateSpeed={config.autoRotateSpeed}
        enableDamping
        dampingFactor={0.1}
      />
    </>
  );
}

// ============================================================================
// Loading Fallback
// ============================================================================

function LoadingFallback({ label }) {
  return (
    <Html center>
      <div className="globe-loading">
        <span>{label}</span>
      </div>
    </Html>
  );
}

// ============================================================================
// Main Globe3D Component
// ============================================================================

const defaultConfig = {
  radius: 2,
  globeColor: "#1a1a2e",
  textureUrl: DEFAULT_EARTH_TEXTURE,
  bumpMapUrl: DEFAULT_BUMP_TEXTURE,
  showAtmosphere: false,
  atmosphereColor: "#4da6ff",
  atmosphereIntensity: 0.5,
  atmosphereBlur: 2,
  bumpScale: 1,
  autoRotateSpeed: 0.3,
  enableZoom: false,
  enablePan: false,
  enableRotate: true,
  focus: null,
  minDistance: 5,
  maxDistance: 15,
  initialRotation: { x: 0, y: 0 },
  markerSize: 0.06,
  showWireframe: false,
  wireframeColor: "#4a9eff",
  ambientIntensity: 0.6,
  pointLightIntensity: 1.5,
  backgroundColor: null,
};

export function Globe3D({
  markers = [],
  config = {},
  className,
  loadingLabel = "",
  pinnedId = null,
  onMarkerClick,
  onMarkerHover
}) {
  const mergedConfig = useMemo(
    () => ({ ...defaultConfig, ...config }),
    [config],
  );

  return (
    <div className={cn("globe-canvas-root", className)}>
      <Canvas
        gl={{
          antialias: true,
          alpha: true,
          powerPreference: "high-performance",
        }}
        dpr={[1, 2]}
        camera={{
          fov: 45,
          near: 0.1,
          far: 1000,
          position: [0, mergedConfig.radius * FRAME_Y, mergedConfig.radius * FRAME_Z],
        }}
        style={{
          background: mergedConfig.backgroundColor || "transparent",
        }}
      >
        <Suspense fallback={<LoadingFallback label={loadingLabel} />}>
          <Scene
            markers={markers}
            config={mergedConfig}
            pinnedId={pinnedId}
            onMarkerClick={onMarkerClick}
            onMarkerHover={onMarkerHover}
          />
        </Suspense>
      </Canvas>
    </div>
  );
}

export default Globe3D;
