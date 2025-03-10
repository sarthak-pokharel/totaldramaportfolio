import { useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import { MeshDistortMaterial } from '@react-three/drei'
import { Mesh } from 'three'

interface SpinningTorusProps {
  position?: [number, number, number]
  color?: string
}

export function SpinningTorus({ position = [0, 0, 0], color = '#4a90e2' }: SpinningTorusProps) {
  const meshRef = useRef<Mesh>(null)
  const rotSpeed = useRef(Math.random() * 0.1 + 0.05)
  
  useFrame(({ clock }) => {
    if (!meshRef.current) return
    
    // Smooth rotation
    meshRef.current.rotation.x = clock.getElapsedTime() * rotSpeed.current
    meshRef.current.rotation.y = clock.getElapsedTime() * rotSpeed.current * 0.7
    
    // Floating motion
    const posY = position[1] + Math.sin(clock.getElapsedTime() * 0.5) * 0.2
    meshRef.current.position.setY(posY)
  })

  return (
    <mesh ref={meshRef} position={position}>
      <torusKnotGeometry args={[1, 0.3, 128, 32]} />
      <MeshDistortMaterial
        color={color}
        metalness={0.8}
        roughness={0.2}
        distort={0.3}
        speed={2}
        emissive={color}
        emissiveIntensity={0.5}
      />
    </mesh>
  )
} 