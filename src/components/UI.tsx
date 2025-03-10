import { useEffect, useState, useRef } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import './UI.css'

gsap.registerPlugin(ScrollTrigger)

export function UI() {
  const [isLoaded, setIsLoaded] = useState(false)
  const sectionsRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const tl = gsap.timeline()
    tl.to('.loading-screen', {
      opacity: 0,
      duration: 1,
      onComplete: () => setIsLoaded(true)
    })

    if (sectionsRef.current) {
      const sections = sectionsRef.current.querySelectorAll('section')
      sections.forEach((section, index) => {
        gsap.from(section, {
          scrollTrigger: {
            trigger: section,
            start: 'top center',
            end: 'bottom center',
            toggleActions: 'play none none reverse'
          },
          opacity: 0,
          y: 50,
          duration: 1,
          delay: index * 0.2
        })
      })
    }
  }, [])

  return (
    <>
      <div className="loading-screen">
        <h1>Welcome</h1>
      </div>
      {isLoaded && (
        <div className="ui-container" ref={sectionsRef}>
          <header>
            <h1>Your Name</h1>
            <p>Full Stack Developer</p>
          </header>
          <nav>
            <a href="#about">About</a>
            <a href="#projects">Projects</a>
            <a href="#contact">Contact</a>
          </nav>
          <main>
            <section id="about" className="section">
              <h2>About Me</h2>
              <p>Your compelling introduction goes here...</p>
            </section>
            <section id="projects" className="section">
              <h2>Projects</h2>
              <div className="projects-grid">
                {[1, 2, 3].map((project) => (
                  <div key={project} className="project-card">
                    <h3>Project {project}</h3>
                    <p>Project description goes here...</p>
                  </div>
                ))}
              </div>
            </section>
            <section id="contact" className="section">
              <h2>Contact</h2>
              <form>
                <input type="email" placeholder="Your email" />
                <textarea placeholder="Your message"></textarea>
                <button type="submit">Send</button>
              </form>
            </section>
          </main>
        </div>
      )}
    </>
  )
} 