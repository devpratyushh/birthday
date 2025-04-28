"use client";

import React from 'react';
import { cn } from '@/lib/utils';
import { Heart } from 'lucide-react';

const AnimatedHeading: React.FC = () => {
  // Simplified: No need for complex state changes for this heading
  return (
    <div className="text-center space-y-2 mb-4 md:mb-6"> {/* Added margin bottom */}
      <h1 className="text-4xl md:text-6xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-primary via-accent to-pink-400 drop-shadow-lg animate-fade-in inline-flex items-center gap-2">
        Happy Birthdayy
        <Heart className="w-8 h-8 md:w-10 md:h-10 text-primary animate-pulse inline-block" fill="currentColor" />
      </h1>
      {/* Removed the Anandita/Babe replacement logic and the "( again 😉 )" text */}
       <p className="text-lg md:text-xl text-muted-foreground animate-fade-in animation-delay-300 font-serif">
         To my dearest Pookie!
       </p>
    </div>
  );
};

// Add animation-delay helper if not present in Tailwind config
const styles = `
.animation-delay-300 { animation-delay: 300ms; }

@keyframes pulse {
  50% {
    opacity: .6;
    transform: scale(1.05);
  }
}
.animate-pulse {
  animation: pulse 1.5s cubic-bezier(0.4, 0, 0.6, 1) infinite;
}

@keyframes fade-in {
  from { opacity: 0; transform: translateY(10px); }
  to { opacity: 1; transform: translateY(0); }
}
.animate-fade-in {
  animation: fade-in 0.8s ease-out forwards;
}

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
