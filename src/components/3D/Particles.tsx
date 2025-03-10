import { useRef, useMemo } from 'react'
import { useFrame } from '@react-three/fiber'
import { Points, PointMaterial } from '@react-three/drei'
import * as THREE from 'three'

interface ParticlesProps {
  count?: number;
  colorScheme?: 'dark' | 'light';
}

export function Particles({ 
  count = 1500, // Reduced from 3000 for better performance
  colorScheme = 'dark' 
}: ParticlesProps) {
  const ref = useRef<THREE.Points>(null)
  
  // Create particles with optimized geometry creation
  const { positions, colors } = useMemo(() => {
    const positions = new Float32Array(count * 3)
    const colors = new Float32Array(count * 3)
    
    // Predefined color palettes for better performance
    const darkPalette = [
      new THREE.Color().setHSL(0.55, 0.7, 0.6),
      new THREE.Color().setHSL(0.6, 0.7, 0.55),
      new THREE.Color().setHSL(0.65, 0.7, 0.5),
      new THREE.Color().setHSL(0.7, 0.7, 0.6)
    ]
    
    const lightPalette = [
      new THREE.Color().setHSL(0.6, 0.3, 0.8),
      new THREE.Color().setHSL(0.65, 0.3, 0.85),
      new THREE.Color().setHSL(0.7, 0.3, 0.8),
      new THREE.Color().setHSL(0.75, 0.3, 0.9)
    ]
    
    const palette = colorScheme === 'light' ? lightPalette : darkPalette
    
    for (let i = 0; i < count; i++) {
      const i3 = i * 3
      
      // Create a wider, more dispersed particle field
      // Using spherical distribution for more even visual result
      const radius = 5 + Math.random() * 5 // Reduced range
      const theta = Math.random() * Math.PI * 2
      const phi = Math.acos(2 * Math.random() - 1)
      
      positions[i3] = radius * Math.sin(phi) * Math.cos(theta)
      positions[i3 + 1] = (Math.random() - 0.5) * 4 // Reduced vertical spread
      positions[i3 + 2] = radius * Math.sin(phi) * Math.sin(theta)
      
      // Use palette colors instead of computing new HSL values
      const color = palette[Math.floor(Math.random() * palette.length)]
      colors[i3] = color.r
      colors[i3 + 1] = color.g
      colors[i3 + 2] = color.b
    }
    
    return { positions, colors }
  }, [count, colorScheme])
  
  // Optimize frame updates - use constant speed instead of clock for better performance
  useFrame((_, delta) => {
    if (!ref.current) return
    
    // Very gentle rotation - much more efficient
    ref.current.rotation.y += delta * 0.02 // Use delta for frame-rate independent rotation
  })
  
  return (
    <Points ref={ref} limit={count}>
      <bufferGeometry>
        <bufferAttribute 
          attach="attributes-position" 
          args={[positions, 3]} 
        />
        <bufferAttribute 
          attach="attributes-color" 
          args={[colors, 3]} 
        />
      </bufferGeometry>
      <PointMaterial 
        size={0.03} 
        sizeAttenuation
        vertexColors
        transparent
        alphaTest={0.01}
        depthWrite={false}
      />
    </Points>
  )
} 