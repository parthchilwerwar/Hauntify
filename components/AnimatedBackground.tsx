  "use client";

  import React from "react";

  const AnimatedBackground = () => {
    return (
      <div className="fixed inset-0 -z-10 overflow-hidden pointer-events-none">
        {/* Base gradient with orange theme */}
        <div className="absolute inset-0 bg-linear-to-br from-[#0a0a0a] via-[#1a0a00] to-[#0f0505]" />
        
        {/* Mesh gradient overlays - Orange theme */}
        <div className="absolute inset-0 opacity-40">
          <div className="absolute top-0 left-0 w-full h-full bg-linear-to-br from-orange-600/20 via-transparent to-transparent" />
          <div className="absolute bottom-0 right-0 w-full h-full bg-linear-to-tl from-red-600/20 via-transparent to-transparent" />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full bg-gradient-radial from-orange-500/10 via-transparent to-transparent" />
        </div>
        
        {/* Animated gradient orbs with orange/red colors */}
        <div className="absolute top-[10%] left-[15%] w-[500px] h-[500px] bg-orange-500/15 rounded-full blur-[100px] animate-pulse-slow" />
        <div className="absolute bottom-[15%] right-[10%] w-[600px] h-[600px] bg-red-600/12 rounded-full blur-[120px] animate-pulse-slower" />
        <div className="absolute top-[40%] right-[20%] w-[400px] h-[400px] bg-orange-600/10 rounded-full blur-[90px] animate-float" />
        <div className="absolute bottom-[30%] left-[25%] w-[450px] h-[450px] bg-red-500/8 rounded-full blur-[110px] animate-spin-slow" />
        
        {/* Grain texture overlay */}
        <div 
          className="absolute inset-0 opacity-[0.025]"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 400 400' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")`,
          }}
        />
        
        {/* Vignette effect */}
        <div className="absolute inset-0 bg-gradient-radial from-transparent via-transparent to-black/60" />
      </div>
    );
  };

  export default AnimatedBackground;
