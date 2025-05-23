import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import './CreativeProfileImage.css';

interface CreativeProfileImageProps {
  imageSrc: string;
  alt?: string;
  className?: string;
}

const CreativeProfileImage = ({
  imageSrc,
  alt = "Profile",
  className = ""
}: CreativeProfileImageProps) => {
  const profileImageRef = useRef<HTMLImageElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const circularFrameRef = useRef<HTMLDivElement>(null);
  const orbitalElementsRef = useRef<HTMLDivElement[]>([]);
  const decorativeIconsRef = useRef<HTMLDivElement[]>([]);
  const backgroundCirclesRef = useRef<HTMLDivElement[]>([]);

  useEffect(() => {
    // Register ScrollTrigger plugin if not already registered
    if (!(gsap as any).plugins?.ScrollTrigger) {
      gsap.registerPlugin(ScrollTrigger);
    }

    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: containerRef.current,
        start: 'top bottom',
        once: true
      }
    });

    // Circular frame animation
    if (circularFrameRef.current) {
      tl.fromTo(
        circularFrameRef.current,
        {
          opacity: 0,
          scale: 0.8,
          rotation: -10
        },
        {
          opacity: 1,
          scale: 1,
          rotation: 0,
          duration: 1.2,
          ease: 'power3.out'
        }
      );
    }

    // Profile image animation
    if (profileImageRef.current) {
      tl.fromTo(
        profileImageRef.current,
        {
          opacity: 0,
          scale: 1.1
        },
        {
          opacity: 1,
          scale: 1,
          duration: 1,
          ease: 'power2.out'
        },
        "-=0.8"
      );
    }

    // Background circles animation
    if (backgroundCirclesRef.current.length) {
      tl.fromTo(
        backgroundCirclesRef.current,
        {
          opacity: 0,
          scale: 0.5
        },
        {
          opacity: 1,
          scale: 1,
          duration: 0.8,
          stagger: 0.2,
          ease: 'power2.out'
        },
        "-=0.6"
      );
    }

    // Orbital elements animation
    if (orbitalElementsRef.current.length) {
      tl.fromTo(
        orbitalElementsRef.current,
        {
          opacity: 0,
          scale: 0.3,
          rotation: -180
        },
        {
          opacity: 1,
          scale: 1,
          rotation: 0,
          duration: 1,
          stagger: 0.15,
          ease: 'back.out(1.7)'
        },
        "-=0.4"
      );
    }

    // Decorative icons animation
    if (decorativeIconsRef.current.length) {
      tl.fromTo(
        decorativeIconsRef.current,
        {
          opacity: 0,
          scale: 0.2,
          y: 20
        },
        {
          opacity: 1,
          scale: 1,
          y: 0,
          duration: 0.7,
          stagger: 0.1,
          ease: 'elastic.out(1, 0.5)'
        },
        "-=0.3"
      );
    }

    return () => {
      // Clean up animations
      if (tl.scrollTrigger) {
        tl.scrollTrigger.kill();
      }
      tl.kill();
    };
  }, []);

  return (
    <div
      ref={containerRef}
      className={`profile-container ${className}`}
    >
      {/* Background gradient circles */}
      <div className="background-circles">
        <div
          ref={(el) => { if (el) backgroundCirclesRef.current[0] = el; }}
          className="bg-circle bg-circle-1"
        ></div>
        <div
          ref={(el) => { if (el) backgroundCirclesRef.current[1] = el; }}
          className="bg-circle bg-circle-2"
        ></div>
        <div
          ref={(el) => { if (el) backgroundCirclesRef.current[2] = el; }}
          className="bg-circle bg-circle-3"
        ></div>
      </div>

      {/* Main circular frame */}
      <div
        ref={circularFrameRef}
        className="circular-frame"
      >
        {/* Orbital ring */}
        <div className="orbital-ring">
          {/* Developer Icons */}
          <div
            ref={(el) => { if (el) orbitalElementsRef.current[0] = el; }}
            className="orbital-element orbital-element-1"
          >
            <div className="icon-content developer-icon">
              <div className="code-brackets">{'{}'}</div>
            </div>
          </div>
          <div
            ref={(el) => { if (el) orbitalElementsRef.current[1] = el; }}
            className="orbital-element orbital-element-2"
          >
            <div className="icon-content developer-icon">
              <div className="terminal-icon">$</div>
            </div>
          </div>

          {/* Designer Icons */}
          <div
            ref={(el) => { if (el) orbitalElementsRef.current[2] = el; }}
            className="orbital-element orbital-element-3"
          >
            <div className="icon-content designer-icon">
              <div className="paintbrush-icon">🎨</div>
            </div>
          </div>
          <div
            ref={(el) => { if (el) orbitalElementsRef.current[3] = el; }}
            className="orbital-element orbital-element-4"
          >
            <div className="icon-content designer-icon">
              <div className="pen-tool-icon">✏️</div>
            </div>
          </div>

          {/* Additional Developer/Designer Icons */}
          <div
            ref={(el) => { if (el) orbitalElementsRef.current[4] = el; }}
            className="orbital-element orbital-element-5"
          >
            <div className="icon-content developer-icon">
              <div className="gear-icon">⚙️</div>
            </div>
          </div>
          <div
            ref={(el) => { if (el) orbitalElementsRef.current[5] = el; }}
            className="orbital-element orbital-element-6"
          >
            <div className="icon-content designer-icon">
              <div className="layers-icon">📐</div>
            </div>
          </div>

          {/* Existing Decorative icons */}
          <div
            ref={(el) => { if (el) decorativeIconsRef.current[0] = el; }}
            className="decorative-icon icon-diamond"
          >
            <div className="diamond-shape"></div>
          </div>
          <div
            ref={(el) => { if (el) decorativeIconsRef.current[1] = el; }}
            className="decorative-icon icon-star"
          >
            <div className="star-shape">✦</div>
          </div>
          <div
            ref={(el) => { if (el) decorativeIconsRef.current[2] = el; }}
            className="decorative-icon icon-sparkle"
          >
            <div className="sparkle-shape">✨</div>
          </div>
          <div
            ref={(el) => { if (el) decorativeIconsRef.current[3] = el; }}
            className="decorative-icon icon-scribble"
          >
            <div className="scribble-shape">∿∿∿</div>
          </div>
        </div>

        {/* Central profile image */}
        <div className="central-image-container">
          <img
            ref={profileImageRef}
            src={imageSrc}
            alt={alt}
            className="profile-image"
          />

          {/* Subtle overlay */}
          <div className="image-overlay"></div>
        </div>
      </div>
    </div>
  );
};

export default CreativeProfileImage;
