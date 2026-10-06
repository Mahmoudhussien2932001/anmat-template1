import { BackSide, Color, ShaderMaterial } from 'three'

export function createAtmosphereMaterial() {
  return new ShaderMaterial({
    uniforms: {
      glowColor: { value: new Color('#9fd2ff') },
      coefficient: { value: 0.35 },
      power: { value: 5.2 },
    },
    vertexShader: `
      varying vec3 vNormal;
      varying vec3 vWorldPosition;
      void main() {
        vec4 world = modelMatrix * vec4(position, 1.0);
        vWorldPosition = world.xyz;
        vNormal = normalize(mat3(modelMatrix) * normal);
        gl_Position = projectionMatrix * viewMatrix * world;
      }
    `,
    fragmentShader: `
      uniform vec3 glowColor;
      uniform float coefficient;
      uniform float power;
      varying vec3 vNormal;
      varying vec3 vWorldPosition;
      void main() {
        vec3 viewDir = normalize(cameraPosition - vWorldPosition);
        float intensity = pow(coefficient + abs(dot(vNormal, viewDir)), power);
        float alpha = clamp(1.0 - intensity, 0.0, 1.0) * 0.55;
        gl_FragColor = vec4(glowColor, alpha);
      }
    `,
    side: BackSide,
    transparent: true,
    depthWrite: false,
  })
}
