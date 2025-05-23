import { useEffect, useRef, type ReactNode } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

interface FadeInProps {
  children: ReactNode;
  direction?: 'up' | 'down' | 'left' | 'right' | 'none';
  delay?: number;
  duration?: number;
  threshold?: number;
  className?: string;
  once?: boolean;
}

const FadeIn = ({
  children,
  direction = 'up',
  delay = 0,
  duration = 0.8,
  threshold = 0.3,
  className = '',
  once = true
}: FadeInProps) => {
  const elementRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const element = elementRef.current;

    if (!element) return;

    // Set initial state based on direction
    let initialProps: any = { opacity: 0 };

    switch (direction) {
      case 'up':
        initialProps = { ...initialProps, y: 50 };
        break;
      case 'down':
        initialProps = { ...initialProps, y: -50 };
        break;
      case 'left':
        initialProps = { ...initialProps, x: 50 };
        break;
      case 'right':
        initialProps = { ...initialProps, x: -50 };
        break;
      default:
        break;
    }

    // Set initial state
    gsap.set(element, initialProps);

    // Create animation
    const animation = gsap.to(element, {
      opacity: 1,
      y: direction === 'up' || direction === 'down' ? 0 : undefined,
      x: direction === 'left' || direction === 'right' ? 0 : undefined,
      duration,
      delay,
      ease: 'power3.out',
      paused: true
    });

    // Create scroll trigger
    const scrollTrigger = ScrollTrigger.create({
      trigger: element,
      start: `top bottom-=${threshold * 100}%`,
      onEnter: () => animation.play(),
      onLeaveBack: () => !once && animation.reverse(),
      once
    });

    return () => {
      animation.kill();
      scrollTrigger.kill();
    };
  }, [direction, delay, duration, threshold, once]);

  return (
    <div ref={elementRef} className={className}>
      {children}
    </div>
  );
};

export default FadeIn;
