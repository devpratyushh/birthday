"use client";

import React, { useState, useEffect } from 'react';
import { cn } from '@/lib/utils';

const AnimatedHeading: React.FC = () => {
  const [showBabe, setShowBabe] = useState(false);
  const [startStrike, setStartStrike] = useState(false);

  useEffect(() => {
    // Sequence:
    // 1. Wait a bit after component mounts.
    // 2. Trigger strikethrough animation.
    // 3. After strikethrough finishes, trigger fade out/in.
    const strikeTimer = setTimeout(() => {
      setStartStrike(true);
    }, 800); // Delay before starting strike

    const revealTimer = setTimeout(() => {
      setShowBabe(true);
    }, 1300); // Delay after strike starts (strike duration + buffer)

    return () => {
      clearTimeout(strikeTimer);
      clearTimeout(revealTimer);
    };
  }, []);

  return (
    <div className="text-center space-y-2">
      <h1 className="text-4xl md:text-6xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-primary via-accent to-pink-400 drop-shadow-lg animate-fade-in">
        Countdown Till I See
      </h1>
      <div className="relative inline-block text-4xl md:text-6xl font-extrabold text-primary drop-shadow-lg min-h-[50px] md:min-h-[70px]">
         {/* Anandita - initially visible, then struck through and faded */}
        <span
          className={cn(
            "inline-block transition-opacity duration-400",
            showBabe ? "opacity-0" : "opacity-100",
          )}
          aria-hidden={showBabe}
        >
          <span className={cn("relative", startStrike && "strikethrough-animated")}>
            Anandita
          </span>
        </span>

        {/* Babe - initially hidden, then fades in */}
        <span
          className={cn(
            "absolute left-0 top-0 inline-block transition-opacity duration-400 animate-fade-in-down",
            showBabe ? "opacity-100" : "opacity-0",
          )}
           style={{ animationDelay: showBabe ? '0s' : '999s' }} // Only animate when shown
           aria-hidden={!showBabe}
        >
          Babe ❤️
        </span>
      </div>
       <p className="text-lg md:text-xl text-muted-foreground animate-fade-in animation-delay-300">
         ( again 😉 )
      </p>
    </div>
  );
};

// Add animation-delay helper if not present in Tailwind config
const styles = `
.animation-delay-300 { animation-delay: 300ms; }
`;
if (typeof window !== 'undefined') {
  const styleSheetId = 'animated-heading-styles';
  if (!document.getElementById(styleSheetId)) {
      const styleSheet = document.createElement("style");
      styleSheet.id = styleSheetId;
      styleSheet.type = "text/css";
      styleSheet.innerText = styles;
      document.head.appendChild(styleSheet);
   }
}


export default AnimatedHeading;
