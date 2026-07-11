import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

export default function CustomCursor() {
  const [mousePosition, setMousePosition] = useState({ x: -100, y: -100 });
  const [isHovering, setIsHovering] = useState(false);

  useEffect(() => {
    const updateMousePosition = (e) => {
      setMousePosition({ x: e.clientX, y: e.clientY });
    };
    const handleMouseOver = (e) => {
      if (e.target.closest('a, button, [role="button"], .group, input, textarea')) {
        setIsHovering(true);
      } else {
        setIsHovering(false);
      }
    };
    window.addEventListener("mousemove", updateMousePosition);
    window.addEventListener("mouseover", handleMouseOver);
    return () => {
      window.removeEventListener("mousemove", updateMousePosition);
      window.removeEventListener("mouseover", handleMouseOver);
    };
  }, []);

  return (
    <>
      <motion.div
        className="fixed top-0 left-0 w-3 h-3 bg-white rounded-full pointer-events-none z-[9999] mix-blend-difference"
        animate={{ x: mousePosition.x - 6, y: mousePosition.y - 6, scale: isHovering ? 2.5 : 1 }}
        transition={{ type: "spring", stiffness: 800, damping: 28, mass: 0.1 }}
      />
      <motion.div
        className="fixed top-0 left-0 w-12 h-12 border border-cyan-400 rounded-full pointer-events-none z-[9998]"
        animate={{
          x: mousePosition.x - 24,
          y: mousePosition.y - 24,
          scale: isHovering ? 1.5 : 1,
          backgroundColor: isHovering ? "rgba(34, 211, 238, 0.15)" : "rgba(34, 211, 238, 0)",
          opacity: mousePosition.x === -100 ? 0 : 1,
          boxShadow: isHovering ? "0 0 20px rgba(34, 211, 238, 0.6), inset 0 0 10px rgba(34, 211, 238, 0.4)" : "0 0 10px rgba(34, 211, 238, 0.3)"
        }}
        transition={{ type: "spring", stiffness: 200, damping: 20, mass: 0.4 }}
      />
    </>
  );
}
