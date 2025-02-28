'use client';

import {
  AnimatePresence,
  motion,
  useScroll,
  useTransform,
} from 'framer-motion';
import { useEffect, useState } from 'react';

export const AnimatedHeaderBackground = () => {
  const { scrollY } = useScroll();
  const [isMounted, setIsMounted] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  const [isLargeScreen, setIsLargeScreen] = useState(false);

  // Transform values for the background, shadow and border
  const boxShadow = useTransform(
    scrollY,
    [0, 30],
    [
      'none',
      '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
    ],
  );

  const backgroundColor = useTransform(
    scrollY,
    [0, 30],
    ['transparent', '#ffffff'],
  );

  const borderColor = useTransform(
    scrollY,
    [0, 30],
    ['rgba(229, 231, 235, 0)', 'rgba(229, 231, 235, 1)'],
  );

  // Update visibility and screen size based on scroll position and window size
  useEffect(() => {
    setIsMounted(true);

    const updateVisibility = () => {
      // Only show background when scrolled down slightly
      setIsVisible(window.scrollY > 15);
    };

    const updateScreenSize = () => {
      // Check if we're on a large screen for responsive styling
      setIsLargeScreen(window.innerWidth >= 1024);
    };

    // Initial checks
    updateVisibility();
    updateScreenSize();

    // Add event listeners
    window.addEventListener('scroll', updateVisibility);
    window.addEventListener('resize', updateScreenSize);

    // Clean up event listeners on unmount
    return () => {
      window.removeEventListener('scroll', updateVisibility);
      window.removeEventListener('resize', updateScreenSize);
    };
  }, []);

  // Don't render anything on the server to prevent hydration issues
  if (!isMounted) return null;

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          className="absolute rounded-xl"
          style={{
            boxShadow,
            backgroundColor,
            border: '1px solid',
            borderColor,
            left: 0,
            right: 0,
            top: 0,
            bottom: 0,
            borderRadius: isLargeScreen ? '0.95rem' : '0',
            // On large screens, use the container style with max width
            // On small screens, make it full width
            width: isLargeScreen ? 'calc(100% - 3rem)' : '100%',
            maxWidth: isLargeScreen ? 'calc(80rem + 3rem)' : 'none',
            marginLeft: isLargeScreen ? '50%' : '0',
            transform: isLargeScreen ? 'translateX(-50%)' : 'none',
          }}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{
            duration: 0.3,
            ease: [0.22, 1, 0.36, 1],
          }}
        />
      )}
    </AnimatePresence>
  );
};
