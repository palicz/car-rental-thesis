'use client';

import { AnimatePresence, motion } from 'framer-motion';
import Link from 'next/link';
import { useEffect, useRef, useState } from 'react';

/**
 * Navigation component for the header.
 * Features an interactive hover effect that highlights the current menu item.
 * Uses Framer Motion for smooth animations and React refs to track element positions.
 */
export const HeaderNavigation = () => {
  // Track which navigation item is being hovered
  const [hoveredIdx, setHoveredIdx] = useState<number | null>(null);

  // Store the DOM rectangles of each button for positioning the hover effect
  const [buttonRects, setButtonRects] = useState<DOMRect[]>([]);

  // Refs to access the actual DOM elements
  const buttonsRef = useRef<(HTMLButtonElement | null)[]>([]);

  // Navigation items
  const tabs = [
    { name: 'Cars', href: '/cars' },
    { name: 'Informations', href: '/info' },
    { name: 'Contact', href: '/contact' },
  ];

  // Update button positions when component mounts or window resizes
  useEffect(() => {
    const updateRects = () => {
      const rects = buttonsRef.current
        .map(button => button?.getBoundingClientRect())
        .filter((rect): rect is DOMRect => rect !== undefined);
      setButtonRects(rects);
    };

    updateRects();
    window.addEventListener('resize', updateRects);
    return () => window.removeEventListener('resize', updateRects);
  }, []);

  return (
    <div className="relative">
      <nav className="flex items-center space-x-1">
        {tabs.map((tab, index) => (
          <Link href={tab.href} key={tab.name} className="relative">
            <button
              ref={el => {
                if (buttonsRef.current) {
                  buttonsRef.current[index] = el;
                }
              }}
              className="relative cursor-pointer px-3 py-1.5 text-sm font-medium text-gray-900 transition-colors hover:text-gray-900"
              onMouseEnter={() => {
                setHoveredIdx(index);
                // Update rects on hover to ensure accurate positioning
                const rects = buttonsRef.current
                  .map(button => button?.getBoundingClientRect())
                  .filter((rect): rect is DOMRect => rect !== undefined);
                setButtonRects(rects);
              }}
              onMouseLeave={() => setHoveredIdx(null)}
            >
              {tab.name}
            </button>
          </Link>
        ))}
      </nav>
      {/* Animated background that follows the hovered item */}
      <AnimatePresence>
        {hoveredIdx !== null && buttonRects[hoveredIdx] && (
          <motion.div
            className="absolute top-0 -z-10 rounded-md bg-gray-200"
            initial={{
              opacity: 0,
              width: buttonRects[hoveredIdx].width,
              height: buttonRects[hoveredIdx].height,
              x: buttonRects[hoveredIdx].x - (buttonRects[0]?.x || 0),
            }}
            animate={{
              opacity: 1,
              width: buttonRects[hoveredIdx].width,
              height: buttonRects[hoveredIdx].height,
              x: buttonRects[hoveredIdx].x - (buttonRects[0]?.x || 0),
            }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.15 }}
            layoutId="hoverBackground"
          />
        )}
      </AnimatePresence>
    </div>
  );
};
