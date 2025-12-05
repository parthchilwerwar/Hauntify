"use client";

import { useEffect, useState } from "react";
import { MagicCard } from "@/components/ui/magic-card";

interface Step {
  number: number;
  title: string;
  description: string;
  color: string;
}

interface AnimatedTimelineProps {
  steps: Step[];
}

export function AnimatedTimeline({ steps }: AnimatedTimelineProps) {
  const [visibleSteps, setVisibleSteps] = useState<number[]>([]);
  const [showText, setShowText] = useState<number[]>([]);
  const [lineHeight, setLineHeight] = useState(0);

  useEffect(() => {
    // Reset animation when component mounts
    setVisibleSteps([]);
    setShowText([]);
    setLineHeight(0);

    // Animate steps sequentially
    steps.forEach((step, index) => {
      // Show step dot
      setTimeout(() => {
        setVisibleSteps((prev) => [...prev, step.number]);
        // Animate line to next step
        setLineHeight(((index + 1) / steps.length) * 100);
      }, index * 800);

      // Show text after step dot
      setTimeout(() => {
        setShowText((prev) => [...prev, step.number]);
      }, index * 800 + 400);
    });
  }, [steps]);

  return (
    <div className="relative max-w-4xl mx-auto">
      {/* Animated connecting line on the left */}
      <div className="absolute left-[7px] top-2 bottom-2 w-0.5 bg-zinc-800/50 overflow-hidden">
        <div 
          className="w-full bg-linear-to-b from-orange-600 via-orange-500 to-orange-400 transition-all duration-700 ease-out"
          style={{ height: `${lineHeight}%` }}
        />
      </div>

      <div className="space-y-8">
        {steps.map((step, index) => {
          const isVisible = visibleSteps.includes(step.number);
          const isTextVisible = showText.includes(step.number);

          return (
            <div
              key={index}
              className="relative flex gap-6 items-start"
            >
              {/* Dot on the left */}
              <div className="relative z-10 shrink-0">
                <div
                  className={`w-4 h-4 rounded-full bg-linear-to-br from-orange-600 via-orange-500 to-orange-400 shadow-lg shadow-orange-500/50 transition-all duration-500 ${
                    isVisible
                      ? "scale-100 opacity-100"
                      : "scale-0 opacity-0"
                  }`}
                />
              </div>

              {/* Content card on the right */}
              <div className="flex-1 pt-1">
                <MagicCard
                  className={`bg-zinc-900/50 backdrop-blur-sm p-6 rounded-xl cursor-pointer transition-all duration-700 ${
                    isTextVisible
                      ? "opacity-100 translate-x-0"
                      : "opacity-0 translate-x-8"
                  }`}
                  gradientSize={150}
                  gradientColor="#ff8c00"
                  gradientOpacity={0.4}
                  gradientFrom="#ff8c00"
                  gradientTo="#ff4500"
                >
                  <div className="flex flex-col">
                    <h3 className="text-xl font-semibold text-white mb-2">
                      {step.title}
                    </h3>
                    <p className="text-sm text-zinc-400 leading-relaxed">
                      {step.description}
                    </p>
                  </div>
                </MagicCard>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
