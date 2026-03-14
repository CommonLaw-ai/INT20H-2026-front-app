import { useEffect, useState, type ReactNode } from 'react';
import Box from '@mui/material/Box';

interface FadeInProps {
  children: ReactNode;
  delay?: number;
  duration?: number;
  translateY?: number;
}

/** Wrapper that fades in and slides up its children with configurable delay */
const FadeIn = ({ children, delay = 0, duration = 600, translateY = 20 }: FadeInProps) => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setIsVisible(true), delay);
    return () => clearTimeout(timer);
  }, [delay]);

  return (
    <Box
      sx={{
        opacity: isVisible ? 1 : 0,
        transform: isVisible ? 'translateY(0)' : `translateY(${translateY}px)`,
        transition: `opacity ${duration}ms cubic-bezier(0.16, 1, 0.3, 1), transform ${duration}ms cubic-bezier(0.16, 1, 0.3, 1)`,
        transitionDelay: `${delay}ms`,
      }}
    >
      {children}
    </Box>
  );
};

export default FadeIn;
