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
  const overlayRef = useRef<HTMLDivElement>(null);
  const innerFrameRef = useRef<HTMLDivElement>(null);
  const brushStrokesRef = useRef<HTMLDivElement[]>([]);
  const cornerDecorationsRef = useRef<HTMLDivElement[]>([]);

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

    // Profile image animation
    if (profileImageRef.current) {
      tl.fromTo(
        profileImageRef.current,
        {
          opacity: 0,
          scale: 1.05
        },
        {
          opacity: 1,
          scale: 1,
          duration: 1,
          ease: 'power2.out'
        }
      );
    }

    // Inner frame animation
    if (innerFrameRef.current) {
      tl.fromTo(
        innerFrameRef.current,
        {
          opacity: 0,
          scale: 0.95
        },
        {
          opacity: 1,
          scale: 1,
          duration: 0.7,
          ease: 'power2.out'
        },
        "-=0.5"
      );
    }

    // Overlay animation
    if (overlayRef.current) {
      tl.fromTo(
        overlayRef.current,
        {
          opacity: 0
        },
        {
          opacity: 1,
          duration: 0.6,
          ease: 'power2.out'
        },
        "-=0.4"
      );
    }

    // Brush strokes animation
    if (brushStrokesRef.current.length) {
      tl.fromTo(
        brushStrokesRef.current,
        {
          opacity: 0,
          scale: 0.9
        },
        {
          opacity: 0.85,
          scale: 1,
          duration: 0.6,
          stagger: 0.1,
          ease: 'power2.out'
        },
        "-=0.3"
      );
    }

    // Corner decorations animation
    if (cornerDecorationsRef.current.length) {
      tl.fromTo(
        cornerDecorationsRef.current,
        {
          opacity: 0,
          scale: 0.5
        },
        {
          opacity: 0.9,
          scale: 1,
          duration: 0.5,
          stagger: 0.1,
          ease: 'back.out(1.7)'
        },
        "-=0.4"
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
      <div className="profile-square">
        <div className="profile-image-wrapper">
          <img
            ref={profileImageRef}
            src={imageSrc}
            alt={alt}
            className="profile-image"
          />
          <div
            ref={overlayRef}
            className="profile-overlay"
          ></div>

          {/* Inner frame */}
          <div
            ref={innerFrameRef}
            className="inner-frame"
          ></div>

          {/* Artistic frame with brush strokes */}
          <div className="artistic-frame">
            {/* Brush strokes */}
            <div
              ref={(el) => { if (el) brushStrokesRef.current[0] = el; }}
              className="brush-stroke brush-top"
            ></div>
            <div
              ref={(el) => { if (el) brushStrokesRef.current[1] = el; }}
              className="brush-stroke brush-right"
            ></div>
            <div
              ref={(el) => { if (el) brushStrokesRef.current[2] = el; }}
              className="brush-stroke brush-bottom"
            ></div>
            <div
              ref={(el) => { if (el) brushStrokesRef.current[3] = el; }}
              className="brush-stroke brush-left"
            ></div>

            {/* Corner decorations */}
            <div
              ref={(el) => { if (el) cornerDecorationsRef.current[0] = el; }}
              className="corner-decoration corner-top-left"
            ></div>
            <div
              ref={(el) => { if (el) cornerDecorationsRef.current[1] = el; }}
              className="corner-decoration corner-top-right"
            ></div>
            <div
              ref={(el) => { if (el) cornerDecorationsRef.current[2] = el; }}
              className="corner-decoration corner-bottom-left"
            ></div>
            <div
              ref={(el) => { if (el) cornerDecorationsRef.current[3] = el; }}
              className="corner-decoration corner-bottom-right"
            ></div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CreativeProfileImage;
