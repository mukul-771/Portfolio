import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import './HomeProfileImage.css';

interface HomeProfileImageProps {
  imageSrc: string;
  alt?: string;
  className?: string;
}

const HomeProfileImage = ({
  imageSrc,
  alt = "Profile",
  className = ""
}: HomeProfileImageProps) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const imageRef = useRef<HTMLImageElement>(null);
  const hexFrameRef = useRef<HTMLDivElement>(null);
  const gradientBorderRef = useRef<HTMLDivElement>(null);

  const innerGlowRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Register ScrollTrigger plugin
    if (!(gsap as any).plugins?.ScrollTrigger) {
      gsap.registerPlugin(ScrollTrigger);
    }

    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: containerRef.current,
        start: 'top bottom-=100',
        once: true
      }
    });

    // Main image animation
    if (imageRef.current) {
      tl.fromTo(
        imageRef.current,
        {
          opacity: 0,
          scale: 1.1,
          rotation: 2
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

    // Hexagonal frame animation
    if (hexFrameRef.current) {
      tl.fromTo(
        hexFrameRef.current,
        {
          opacity: 0,
          scale: 0.8,
          rotation: -5
        },
        {
          opacity: 1,
          scale: 1,
          rotation: 0,
          duration: 1,
          ease: 'back.out(1.7)'
        },
        "-=0.8"
      );
    }

    // Gradient border animation
    if (gradientBorderRef.current) {
      tl.fromTo(
        gradientBorderRef.current,
        {
          opacity: 0,
          scale: 0.9
        },
        {
          opacity: 1,
          scale: 1,
          duration: 0.8,
          ease: 'power2.out'
        },
        "-=0.6"
      );
    }

    // Remove floating elements animation - keep it clean

    // Remove overlay animation - keep it clean

    // Inner glow animation
    if (innerGlowRef.current) {
      tl.fromTo(
        innerGlowRef.current,
        {
          opacity: 0
        },
        {
          opacity: 1,
          duration: 0.5,
          ease: 'power2.out'
        },
        "-=0.2"
      );
    }

    // Remove continuous animations - keep it clean and simple

    // Add very subtle hover effect on mouse move
    const handleMouseMove = (e: MouseEvent) => {
      if (containerRef.current) {
        const rect = containerRef.current.getBoundingClientRect();
        const centerX = rect.left + rect.width / 2;
        const centerY = rect.top + rect.height / 2;
        const deltaX = (e.clientX - centerX) / rect.width;
        const deltaY = (e.clientY - centerY) / rect.height;

        gsap.to(hexFrameRef.current, {
          rotationY: deltaX * 0.5,
          rotationX: -deltaY * 0.5,
          transformOrigin: "center center",
          duration: 0.8,
          ease: "power2.out"
        });
      }
    };

    const handleMouseLeave = () => {
      gsap.to(hexFrameRef.current, {
        rotationY: 0,
        rotationX: 0,
        duration: 0.8,
        ease: "power2.out"
      });
    };

    if (containerRef.current) {
      containerRef.current.addEventListener('mousemove', handleMouseMove);
      containerRef.current.addEventListener('mouseleave', handleMouseLeave);
    }

    return () => {
      if (tl.scrollTrigger) {
        tl.scrollTrigger.kill();
      }
      tl.kill();

      // Clean up event listeners
      if (containerRef.current) {
        containerRef.current.removeEventListener('mousemove', handleMouseMove);
        containerRef.current.removeEventListener('mouseleave', handleMouseLeave);
      }
    };
  }, []);

  return (
    <div
      ref={containerRef}
      className={`home-profile-container ${className}`}
    >
      {/* Main image container */}
      <div className="image-container">
        {/* Clean circular border */}
        <div
          ref={gradientBorderRef}
          className="gradient-border"
        ></div>

        {/* Clean circular frame */}
        <div
          ref={hexFrameRef}
          className="hex-frame"
        >
          {/* Subtle inner glow */}
          <div
            ref={innerGlowRef}
            className="inner-glow"
          ></div>

          {/* Profile image - clean circular */}
          <img
            ref={imageRef}
            src={imageSrc}
            alt={alt}
            className="profile-image"
          />
        </div>
      </div>
    </div>
  );
};

export default HomeProfileImage;
