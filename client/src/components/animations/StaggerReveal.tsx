import { useEffect, useRef, type ReactNode, Children, cloneElement, isValidElement } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

interface StaggerRevealProps {
  children: ReactNode;
  stagger?: number;
  delay?: number;
  duration?: number;
  direction?: 'up' | 'down' | 'left' | 'right' | 'none';
  threshold?: number;
  className?: string;
  childClassName?: string;
  once?: boolean;
}

const StaggerReveal = ({
  children,
  stagger = 0.1,
  delay = 0,
  duration = 0.5,
  direction = 'up',
  threshold = 0.3,
  className = '',
  childClassName = '',
  once = true
}: StaggerRevealProps) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const elementsRef = useRef<HTMLDivElement[]>([]);

  useEffect(() => {
    const container = containerRef.current;
    const elements = elementsRef.current;

    if (!container || elements.length === 0) return;

    // Set initial state based on direction
    let initialProps: any = { opacity: 0 };

    switch (direction) {
      case 'up':
        initialProps = { ...initialProps, y: 30 };
        break;
      case 'down':
        initialProps = { ...initialProps, y: -30 };
        break;
      case 'left':
        initialProps = { ...initialProps, x: 30 };
        break;
      case 'right':
        initialProps = { ...initialProps, x: -30 };
        break;
      default:
        break;
    }

    // Set initial state
    gsap.set(elements, initialProps);

    // Create animation
    const animation = gsap.to(elements, {
      opacity: 1,
      y: direction === 'up' || direction === 'down' ? 0 : undefined,
      x: direction === 'left' || direction === 'right' ? 0 : undefined,
      duration,
      stagger,
      delay,
      ease: 'power2.out',
      paused: true
    });

    // Create scroll trigger
    const scrollTrigger = ScrollTrigger.create({
      trigger: container,
      start: `top bottom-=${threshold * 100}%`,
      onEnter: () => animation.play(),
      onLeaveBack: () => !once && animation.reverse(),
      once
    });

    return () => {
      animation.kill();
      scrollTrigger.kill();
    };
  }, [direction, stagger, delay, duration, threshold, once]);

  // Reset refs when children change
  useEffect(() => {
    elementsRef.current = [];
  }, [children]);

  // Clone children and add refs
  const childrenWithRefs = Children.map(children, (child, index) => {
    if (isValidElement(child)) {
      return cloneElement(child as any, {
        ref: (el: HTMLDivElement) => {
          if (el) elementsRef.current[index] = el;
        },
        className: `${(child.props as any).className || ''} ${childClassName}`.trim()
      });
    }
    return child;
  });

  return (
    <div ref={containerRef} className={className}>
      {childrenWithRefs}
    </div>
  );
};

export default StaggerReveal;
