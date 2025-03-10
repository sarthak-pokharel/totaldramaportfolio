import { useRef, useMemo } from 'react'
import { useFrame } from '@react-three/fiber'
import { Points, PointMaterial } from '@react-three/drei'
import * as THREE from 'three'

export function Stars() {
  const ref = useRef<THREE.Points>(null)
  const count = 2000
  
  // Generate random star positions - optimized for performance
  const { positions, sizes, colors } = useMemo(() => {
    const positions = new Float32Array(count * 3)
    const colors = new Float32Array(count * 3)
    const sizes = new Float32Array(count)
    
    // Pre-compute color values for better performance
    const baseColor1 = new THREE.Color().setHSL(0.6, 0.8, 0.8)
    const baseColor2 = new THREE.Color().setHSL(0.65, 0.8, 0.9)
    
    for (let i = 0; i < count; i++) {
      const i3 = i * 3
      
      // More efficient sphere distribution
      const r = 15 + Math.random() * 10 // Reduced outer radius
      const theta = 2 * Math.PI * Math.random()
      const phi = Math.acos(2 * Math.random() - 1)
      
      // Avoid expensive sin/cos calculations when possible
      const sinPhi = Math.sin(phi)
      
      positions[i3] = r * sinPhi * Math.cos(theta)
      positions[i3 + 1] = r * sinPhi * Math.sin(theta)
      positions[i3 + 2] = r * Math.cos(phi)
      
      // Optimized size distribution - smaller range of values
      sizes[i] = Math.random() * 0.3 + 0.1
      
      // Simplified color computation - alternate between two base colors
      const color = i % 2 === 0 ? baseColor1 : baseColor2
      
      // Slight randomization for visual variety without expensive HSL calculations
      const brightness = 0.9 + Math.random() * 0.2
      
      colors[i3] = color.r * brightness
      colors[i3 + 1] = color.g * brightness
      colors[i3 + 2] = color.b * brightness
    }
    
    return { positions, sizes, colors }
  }, [])
  
  // Optimized animation using delta
  useFrame((_, delta) => {
    if (!ref.current) return
    
    // Slow rotation for the star field - using delta for frame-rate independence
    ref.current.rotation.x += delta * 0.01 // Reduced rotation speed
    ref.current.rotation.y += delta * 0.015
  })
  
  return (
    <group>
      <Points ref={ref}>
        <bufferGeometry>
          <bufferAttribute 
            attach="attributes-position"
            args={[positions, 3]}
          />
          <bufferAttribute 
            attach="attributes-color"
            args={[colors, 3]}
          />
          <bufferAttribute 
            attach="attributes-size"
            args={[sizes, 1]}
          />
        </bufferGeometry>
        <PointMaterial
          size={0.1}
          sizeAttenuation
          vertexColors
          transparent
          depthWrite={false}
          blending={THREE.AdditiveBlending}
        />
      </Points>
    </group>
  )
} 