import React from "react";

const GhostSVG = () => (
  <svg width="80" height="80" viewBox="0 0 80 80" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path 
      d="M40 10C28 10 18 20 18 32V55C18 58 20 60 23 60C26 60 28 58 28 55V50C28 48 30 46 32 46C34 46 36 48 36 50V55C36 58 38 60 41 60C44 60 46 58 46 55V50C46 48 48 46 50 46C52 46 54 48 54 50V55C54 58 56 60 59 60C62 60 64 58 64 55V32C64 20 54 10 40 10Z" 
      fill="white" 
      opacity="0.9"
    />
    <circle cx="32" cy="30" r="4" fill="#333" />
    <circle cx="48" cy="30" r="4" fill="#333" />
    <path d="M32 38C32 38 36 42 40 42C44 42 48 38 48 38" stroke="#333" strokeWidth="2" strokeLinecap="round" />
  </svg>
);

export default GhostSVG;
