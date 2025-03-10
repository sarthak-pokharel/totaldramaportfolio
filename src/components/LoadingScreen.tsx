import { useRef, useEffect } from 'react'
import { useProgress } from '@react-three/drei'
import './LoadingScreen.css'

export function LoadingScreen() {
  const { progress, total, loaded, errors } = useProgress()
  const progressBarRef = useRef<HTMLDivElement>(null)
  
  useEffect(() => {
    if (progressBarRef.current) {
      progressBarRef.current.style.width = `${progress}%`
    }
  }, [progress])
  
  // Calculate loading status text
  const loadingText = errors ? 'Error loading assets' : 
                     progress >= 100 ? 'Entering experience...' : 
                     `Loading assets (${loaded}/${total || '?'})`
  
  return (
    <div className="loading-screen">
      <div className="loading-content">
        <div className="loading-title">
          <h1>Welcome</h1>
          <div className="loading-subtitle">to my 3D portfolio</div>
        </div>
        
        <div className="progress-container">
          <div className="progress-bar">
            <div ref={progressBarRef} className="progress"></div>
          </div>
          <div className="progress-stats">
            <span className="progress-percentage">{Math.round(progress)}%</span>
            <span className="progress-text">{loadingText}</span>
          </div>
        </div>
      </div>
    </div>
  )
} 