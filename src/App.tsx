import { Canvas } from '@react-three/fiber'
import { Suspense, useState, useEffect } from 'react'
import { Experience } from './components/Experience'
import { ScrollControls, Scroll, Preload, AdaptiveDpr, BakeShadows } from '@react-three/drei'
import { EffectComposer, Bloom } from '@react-three/postprocessing'
import { BlendFunction } from 'postprocessing'
import profileData from './data/profile.json'
import './App.css'
import './fonts.css'

// Adaptive loading based on device capability
function isMobileDevice() {
  return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent) 
    || window.innerWidth < 768
}

function LoadingManager() {
  const [progress, setProgress] = useState(0)
  
  useEffect(() => {
    // Simulate assets loading progress with accelerated timing
    const interval = setInterval(() => {
      setProgress(prev => {
        const increment = Math.random() * 15 + 5 // Faster loading
        const newProgress = prev + increment
        if (newProgress >= 100) {
          clearInterval(interval)
          return 100
        }
        return newProgress
      })
    }, 100) // Reduced interval time
    
    return () => clearInterval(interval)
  }, [])
  
  return (
    <div className="loading-screen">
      <div className="loading-content">
        <div className="loading-title">
          <h1>{profileData.name}</h1>
          <div className="loading-subtitle">Portfolio</div>
        </div>
        <div className="progress-container">
          <div className="progress-bar">
            <div className="progress" style={{ width: `${progress}%` }}></div>
          </div>
          <div className="progress-stats">
            <span className="progress-percentage">{Math.round(progress)}%</span>
            <span className="progress-text">&nbsp;
              {progress < 100 ? 'Loading assets...' : 'Preparing...'}
            </span>
          </div>
        </div>
      </div>
    </div>
  )
}

export default function App() {
  const [isLoaded, setIsLoaded] = useState(false)
  const [isMobile, setIsMobile] = useState(false)

  // Check device capabilities once on mount
  useEffect(() => {
    setIsMobile(isMobileDevice())
    
    // Simulate loading assets with performance-based timing
    const timer = setTimeout(() => {
      setIsLoaded(true)
    }, isMobileDevice() ? 1800 : 2500) // Faster loading on mobile
    
    return () => clearTimeout(timer)
  }, [])

  if (!isLoaded) {
    return <LoadingManager />
  }

  return (
    <div className="app">
      <Canvas
        camera={{ position: [0, 0, 5], fov: isMobile ? 75 : 60 }}
        dpr={[0.8, 1.5]} // Lower min DPR for better performance
        gl={{ 
          antialias: !isMobile,
          alpha: false,
          powerPreference: "high-performance" as const,
          stencil: false,
          depth: true
        }}
        style={{ background: '#050505' }}
        frameloop={isMobile ? "demand" : "always"} // Use demand-based rendering on mobile
        performance={{ min: 0.5 }} // Performance floor
      >
        <fog attach="fog" args={['#050505', 10, 30]} />
        <Suspense fallback={null}>
          <ScrollControls pages={4} damping={0.25}>
            <Experience />
            <Scroll html>
              {/* Hero Section */}
              <section className="section hero">
                <div className="content">
                  <div className="profile-image">
                    <img src={profileData.profile_pic_link} alt={profileData.name} />
                  </div>
                  <h1>{profileData.name}</h1>
                  <div className="titles">
                    {profileData.titles.map((title, index) => (
                      <span key={index} className="title">{title}</span>
                    ))}
                  </div>
                  <div className="socials">
                    {profileData.socials.map((social, index) => (
                      <a 
                        key={index} 
                        href={social.link} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className={`social-icon ${social.name}`}
                      >
                        {social.name}
                      </a>
                    ))}
                  </div>
                </div>
              </section>

              {/* About Section */}
              <section className="section about">
                <div className="content">
                  <h2>About Me</h2>
                  <div className="about-text">
                    {profileData.about.split('\n\n').map((paragraph, index) => (
                      <p key={index}>{paragraph}</p>
                    ))}
                  </div>
                  <div className="location">
                    <h3>Location</h3>
                    <p>{profileData.address}</p>
                  </div>
                </div>
              </section>

              {/* Skills Section */}
              <section className="section skills">
                <div className="content">
                  <h2>Skills</h2>
                  <ul className="skills-list">
                    {profileData.skills.map((skill, index) => (
                      <li key={index} className="skill-item">{skill}</li>
                    ))}
                  </ul>
                </div>
              </section>

              {/* Blogs Section */}
              <section className="section blogs">
                <div className="content">
                  <h2>Blogs</h2>
                  <div className="blogs-grid">
                    {profileData.blogs.map((blog, index) => (
                      <div key={index} className="blog-card">
                        <h3>{blog.title}</h3>
                        <p className="blog-date">{blog.published_date}</p>
                        <p className="blog-desc">{blog.short_description}</p>
                        <div className="blog-labels">
                          {blog.labels.map((label, labelIndex) => (
                            <span key={labelIndex} className="label">{label}</span>
                          ))}
                        </div>
                        <a href={blog.link} target="_blank" rel="noopener noreferrer" className="read-more">
                          Read More
                        </a>
                      </div>
                    ))}
                  </div>
                </div>
              </section>

              {/* Footer */}
              <footer className="footer">
                <div className="content">
                  <p>© {new Date().getFullYear()} {profileData.copyright_tag} All Rights Reserved.</p>
                  <p>Contact: {profileData.contacts[0].value}</p>
                </div>
              </footer>
            </Scroll>
          </ScrollControls>
          <EffectComposer enabled={!isMobile} multisampling={0}>
            <Bloom 
              luminanceThreshold={0.2} 
              intensity={0.5} 
              levels={6} 
              mipmapBlur 
              blendFunction={BlendFunction.SCREEN}
            />
          </EffectComposer>
          <AdaptiveDpr pixelated />
          <BakeShadows />
          <Preload all />
        </Suspense>
      </Canvas>
    </div>
  )
}
