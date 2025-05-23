import { useEffect, useRef, type ReactNode } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import SplitType from 'split-type';

interface TextRevealProps {
  children: ReactNode;
  stagger?: number;
  delay?: number;
  duration?: number;
  threshold?: number;
  className?: string;
  type?: 'chars' | 'words' | 'lines';
  once?: boolean;
}

const TextReveal = ({
  children,
  stagger = 0.03,
  delay = 0,
  duration = 0.5,
  threshold = 0.3,
  className = '',
  type = 'chars',
  once = true
}: TextRevealProps) => {
  const textRef = useRef<HTMLDivElement>(null);
  const splitTextRef = useRef<SplitType | null>(null);

  useEffect(() => {
    const textElement = textRef.current;

    if (!textElement) return;

    // Split text
    splitTextRef.current = new SplitType(textElement, {
      types: [type],
      tagName: 'span'
    });

    const elements = splitTextRef.current[type];

    if (!elements) return;

    // Set initial state
    gsap.set(elements, {
      opacity: 0,
      y: 20
    });

    // Create animation
    const animation = gsap.to(elements, {
      opacity: 1,
      y: 0,
      duration,
      stagger,
      delay,
      ease: 'power2.out',
      paused: true
    });

    // Create scroll trigger
    const scrollTrigger = ScrollTrigger.create({
      trigger: textElement,
      start: `top bottom-=${threshold * 100}%`,
      onEnter: () => animation.play(),
      onLeaveBack: () => !once && animation.reverse(),
      once
    });

    return () => {
      if (splitTextRef.current) {
        splitTextRef.current.revert();
      }
      animation.kill();
      scrollTrigger.kill();
    };
  }, [type, stagger, delay, duration, threshold, once, children]);

  return (
    <div ref={textRef} className={className}>
      {children}
    </div>
  );
};

export default TextReveal;
