import { useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import { MeshDistortMaterial } from '@react-three/drei'
import { Mesh } from 'three'

interface FloatingSphereProps {
  position?: [number, number, number]
  color?: string
  radius?: number
  distort?: number
}

export function FloatingSphere({ 
  position = [0, 0, 0], 
  color = '#ffffff',
  radius = 1,
  distort = 0.3
}: FloatingSphereProps) {
  const meshRef = useRef<Mesh>(null)
  
  useFrame(({ clock }) => {
    if (!meshRef.current) return
    
    // Complex movement pattern
    const t = clock.getElapsedTime()
    const x = position[0] + Math.sin(t * 0.2) * 0.3
    const y = position[1] + Math.cos(t * 0.4) * 0.3
    const z = position[2] + Math.sin(t * 0.3) * 0.2
    
    meshRef.current.position.set(x, y, z)
    
    // Subtle rotation
    meshRef.current.rotation.x = t * 0.1
    meshRef.current.rotation.y = t * 0.2
  })
  
  return (
    <mesh ref={meshRef} position={position}>
      <sphereGeometry args={[radius, 64, 32]} />
      <MeshDistortMaterial
        color={color}
        speed={2}
        distort={distort}
        metalness={0.5}
        roughness={0.3}
        envMapIntensity={0.8}
      />
    </mesh>
  )
} 