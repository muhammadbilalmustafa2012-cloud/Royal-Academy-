import React from 'react';
import { useScrollAnimation } from '../hooks/useScrollAnimation';

type AnimationType =
  | 'fade-up'
  | 'fade-left'
  | 'fade-right'
  | 'zoom-in'
  | 'fade-in';

interface AnimatedSectionProps {
  children: React.ReactNode;
  animation?: AnimationType;
  delay?: number; // ms, e.g. 100, 200, 300
  className?: string;
  threshold?: number;
  tag?: keyof React.JSX.IntrinsicElements;
}

const animationStyles: Record<AnimationType, { hidden: React.CSSProperties; visible: React.CSSProperties }> = {
  'fade-up': {
    hidden: { opacity: 0, transform: 'translateY(48px)' },
    visible: { opacity: 1, transform: 'translateY(0)' },
  },
  'fade-left': {
    hidden: { opacity: 0, transform: 'translateX(-56px)' },
    visible: { opacity: 1, transform: 'translateX(0)' },
  },
  'fade-right': {
    hidden: { opacity: 0, transform: 'translateX(56px)' },
    visible: { opacity: 1, transform: 'translateX(0)' },
  },
  'zoom-in': {
    hidden: { opacity: 0, transform: 'scale(0.88)' },
    visible: { opacity: 1, transform: 'scale(1)' },
  },
  'fade-in': {
    hidden: { opacity: 0 },
    visible: { opacity: 1 },
  },
};

/**
 * Wraps any content and animates it into view when it enters the viewport.
 * Uses IntersectionObserver (via useScrollAnimation) — no library needed.
 *
 * Usage:
 *   <AnimatedSection animation="fade-up" delay={200}>
 *     <MyCard />
 *   </AnimatedSection>
 */
export const AnimatedSection: React.FC<AnimatedSectionProps> = ({
  children,
  animation = 'fade-up',
  delay = 0,
  className = '',
  threshold = 0.12,
  tag: Tag = 'div',
}) => {
  const [ref, isVisible] = useScrollAnimation({ threshold });
  const { hidden, visible } = animationStyles[animation];

  const style: React.CSSProperties = {
    transition: `opacity 0.65s ease ${delay}ms, transform 0.65s cubic-bezier(0.22, 0.68, 0, 1.2) ${delay}ms`,
    willChange: 'opacity, transform',
    ...(isVisible ? visible : hidden),
  };

  return (
    // @ts-ignore — dynamic tag
    <Tag ref={ref} style={style} className={className}>
      {children}
    </Tag>
  );
};
