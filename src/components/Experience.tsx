import { Environment, useScroll } from '@react-three/drei'
import { useFrame } from '@react-three/fiber'
import { useRef, useMemo } from 'react'
import { Group, MathUtils, Object3D } from 'three'
import { LightCube } from './3D/LightCube'
import { FloatingSphere } from './3D/FloatingSphere'
import { Particles } from './3D/Particles'
import { Stars } from './3D/Stars'
import { getPerformanceSettings } from '../utils/performance'
import '../fonts.css'

export function Experience() {
  const scrollData = useScroll()
  const mainGroup = useRef<Group>(null)
  const sectionsGroup = useRef<Group>(null)
  
  // Get performance settings for optimized rendering
  const perfSettings = useMemo(() => getPerformanceSettings(), [])
  
  // Use the scroll data in useFrame for animations
  useFrame(({ camera, clock }, delta) => {
    if (!mainGroup.current || !sectionsGroup.current) return
    
    const scrollOffset = scrollData.offset
    
    // Gentle ambient movement for the main group - using delta for frame-rate independence
    mainGroup.current.rotation.y = MathUtils.lerp(
      mainGroup.current.rotation.y,
      Math.sin(clock.getElapsedTime() * 0.1) * 0.2,
      0.01 * delta * 60 // Scale by delta for frame-rate independence
    )
    
    // Move camera deeper into the scene based on scroll
    // Using z-depth positioning to create the "coming from depth" effect
    const targetZ = -15 * scrollOffset 
    camera.position.z = MathUtils.lerp(camera.position.z, 5 + targetZ, 0.05 * delta * 60)
    
    // Slightly tilt camera based on scroll for better 3D effect
    camera.rotation.x = MathUtils.lerp(camera.rotation.x, -scrollOffset * 0.05, 0.05 * delta * 60)
    
    // Animate each section to emerge from depth - optimized calculations
    sectionsGroup.current.children.forEach((child, i) => {
      // Calculate section's target position based on scroll
      const sectionOffset = i / (sectionsGroup.current!.children.length - 1)
      const sectionDistance = Math.abs(scrollOffset - sectionOffset)
      
      // Scale and position sections based on how "in view" they are
      // This creates the effect of coming from the depth
      const scale = MathUtils.lerp(
        child.scale.x,
        sectionDistance < 0.1 ? 1.0 : 0.5,
        0.1 * delta * 60
      )
      child.scale.set(scale, scale, scale)
      
      // Move sections forward when they're in view
      const targetZ = sectionDistance < 0.1 ? 0 : 20 * (sectionDistance * 2)
      child.position.z = MathUtils.lerp(child.position.z, targetZ, 0.1 * delta * 60)
      
      // Only process opacity for visible sections - performance optimization
      if (sectionDistance < 0.3) {
        // Fade sections in/out based on distance
        const targetOpacity = sectionDistance < 0.1 ? 1 : Math.max(0, 1 - sectionDistance * 2)
        
        // Apply opacity to child meshes if they have materials
        child.traverse((object: Object3D) => {
          if ('material' in object) {
            const obj = object as any
            if (obj.material && typeof obj.material.opacity !== 'undefined') {
              obj.material.opacity = MathUtils.lerp(obj.material.opacity, targetOpacity, 0.1 * delta * 60)
            }
          }
        })
      }
    })
  })

  return (
    <>
      <Stars />
      <group ref={mainGroup}>
        {/* Ambient floating elements */}
        <LightCube position={[3, 2, -5]} color="#f5c259" />
        <LightCube position={[-3, -2, -7]} color="#5e5ce6" />
        <FloatingSphere position={[2, -1, -3]} color="#ffffff" radius={0.5} />
        <FloatingSphere position={[-2, 1, -6]} color="#5e5ce6" radius={0.7} />
        <Particles count={perfSettings.particleCount} />
        
        {/* Sections that will move from depth */}
        <group ref={sectionsGroup}>
          {/* Section 1 - positioned deep in Z */}
          <group position={[0, 0, 20]}>
            <FloatingSphere position={[0, 0, 0]} color="#f5c259" radius={1.2} distort={0.2} />
          </group>
          
          {/* Section 2 - positioned deeper */}
          <group position={[0, 0, 40]}>
            <LightCube position={[-1, 0, 0]} color="#5e5ce6" size={1.2} />
            <LightCube position={[1, 0, 0]} color="#5e5ce6" size={1.2} />
          </group>
          
          {/* Section 3 - positioned deepest */}
          <group position={[0, 0, 60]}>
            <FloatingSphere position={[-1, 1, 0]} color="#ffffff" radius={0.8} />
            <FloatingSphere position={[1, -1, 0]} color="#ffffff" radius={0.8} />
            <LightCube position={[0, 0, 0]} color="#f5c259" size={1.5} />
          </group>
        </group>
      </group>
      
      {/* Environment lighting */}
      <Environment preset="night" />
    </>
  )
} 