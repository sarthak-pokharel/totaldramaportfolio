import { useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import { Mesh, MeshStandardMaterial } from 'three'

interface LightCubeProps {
  position?: [number, number, number]
  color?: string
  intensity?: number
  size?: number
}

export function LightCube({ 
  position = [0, 0, 0], 
  color = '#f5c259', 
  intensity = 1.5,
  size = 0.5
}: LightCubeProps) {
  const meshRef = useRef<Mesh>(null)
  const materialRef = useRef<MeshStandardMaterial>(null)
  
  useFrame(({ clock }) => {
    if (!meshRef.current) return
    
    // Gentle floating movement
    meshRef.current.position.y = position[1] + Math.sin(clock.getElapsedTime() * 0.8) * 0.2
    
    // Subtle rotation
    meshRef.current.rotation.x = clock.getElapsedTime() * 0.2
    meshRef.current.rotation.y = clock.getElapsedTime() * 0.3
    
    // Pulsating light intensity
    if (materialRef.current) {
      materialRef.current.emissiveIntensity = 
        intensity * (0.8 + Math.sin(clock.getElapsedTime() * 2) * 0.2)
    }
  })
  
  return (
    <mesh ref={meshRef} position={position}>
      <boxGeometry args={[size, size, size]} />
      <meshStandardMaterial
        ref={materialRef}
        color={color}
        emissive={color}
        emissiveIntensity={intensity}
        toneMapped={false}
      />
      <pointLight color={color} intensity={intensity * 5} distance={5} decay={2} />
    </mesh>
  )
} 