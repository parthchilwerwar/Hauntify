"use client";

import React from "react";

type Position = 
  | "top-left" 
  | "top-right" 
  | "center-left" 
  | "center-right" 
  | "bottom-left" 
  | "bottom-right";

interface FloatingCharacterProps {
  children: React.ReactNode;
  position: Position;
  zIndex?: number;
  blur?: boolean;
}

const positionClasses: Record<Position, string> = {
  "top-left": "top-10 left-10",
  "top-right": "top-10 right-10",
  "center-left": "top-1/2 -translate-y-1/2 left-10",
  "center-right": "top-1/2 -translate-y-1/2 right-10",
  "bottom-left": "bottom-10 left-10",
  "bottom-right": "bottom-10 right-10",
};

const FloatingCharacter: React.FC<FloatingCharacterProps> = ({ 
  children, 
  position, 
  zIndex = 5,
  blur = false 
}) => {
  return (
    <div 
      className={`
        fixed ${positionClasses[position]} 
        animate-float 
        ${blur ? 'opacity-30 blur-sm' : 'opacity-80'}
        pointer-events-none
        hidden md:block
      `}
      style={{ zIndex }}
    >
      {children}
    </div>
  );
};

export default FloatingCharacter;
