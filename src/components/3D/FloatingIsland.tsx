import { useRef, useMemo } from 'react'
import { useFrame } from '@react-three/fiber'
import { Mesh, Vector3, TorusKnotGeometry } from 'three'

export function FloatingIsland() {
  const islandRef = useRef<Mesh>(null)
  const targetRotation = useRef(new Vector3(0, 0, 0))
  const currentRotation = useRef(new Vector3(0, 0, 0))

  const geometry = useMemo(() => {
    return new TorusKnotGeometry(1, 0.3, 128, 16)
  }, [])

  useFrame((state) => {
    if (islandRef.current) {
      // Floating animation
      islandRef.current.position.y = Math.sin(state.clock.elapsedTime) * 0.1
      
      // Rotation animation
      targetRotation.current.x = Math.sin(state.clock.elapsedTime * 0.5) * 0.1
      targetRotation.current.y = Math.cos(state.clock.elapsedTime * 0.5) * 0.1
      
      // Smooth rotation interpolation
      currentRotation.current.lerp(targetRotation.current, 0.05)
      islandRef.current.rotation.x = currentRotation.current.x
      islandRef.current.rotation.y = currentRotation.current.y
    }
  })

  return (
    <mesh ref={islandRef} position={[0, 0, 0]}>
      <primitive object={geometry} />
      <meshStandardMaterial
        color="#4a90e2"
        metalness={0.7}
        roughness={0.2}
        envMapIntensity={1}
        emissive="#4a90e2"
        emissiveIntensity={0.2}
      />
    </mesh>
  )
} 