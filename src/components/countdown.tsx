
'use client';

import { useState, useEffect } from 'react';

interface TimeLeft {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
}

interface FlipUnitProps {
  currentValue: number;
  previousValue: number;
  label: string;
}

// Helper function to format numbers with leading zeros
const formatNumber = (num: number): string => num.toString().padStart(2, '0');

// FlipUnit Component (Original Style)
const FlipUnit: React.FC<FlipUnitProps> = ({ currentValue, previousValue, label }) => {
  const [isFlipping, setIsFlipping] = useState(false);
  const formattedCurrentValue = formatNumber(currentValue);
  const formattedPreviousValue = formatNumber(previousValue);

  useEffect(() => {
    if (currentValue !== previousValue) {
      setIsFlipping(true);
      const timeout = setTimeout(() => setIsFlipping(false), 500); // Duration of animation (0.5s)
      return () => clearTimeout(timeout);
    }
  }, [currentValue, previousValue]);

  return (
    <div className="flex flex-col items-center mx-2 sm:mx-3">
      {/* Flip Container */}
      <div className="relative w-16 h-20 sm:w-20 sm:h-24 md:w-24 md:h-28 perspective bg-primary rounded-lg shadow-md">
        {/* Top Half (Static - shows current value always) */}
        <div className="absolute top-0 left-0 w-full h-1/2 bg-primary/90 text-primary-foreground rounded-t-lg flex items-end justify-center pb-1 overflow-hidden border-b border-black/10">
          <span className="text-3xl sm:text-4xl md:text-5xl font-bold tabular-nums">
            {formattedCurrentValue}
          </span>
        </div>
        {/* Bottom Half (Static - shows current value always) */}
        <div className="absolute bottom-0 left-0 w-full h-1/2 bg-primary text-primary-foreground rounded-b-lg flex items-start justify-center pt-1 overflow-hidden">
          <span className="text-3xl sm:text-4xl md:text-5xl font-bold tabular-nums">
            {formattedCurrentValue}
          </span>
        </div>

        {/* --- Flipping Part --- */}
        {/* Top Half (Flipping - shows previous value and flips down) */}
        <div
           key={`top-${previousValue}`} // Use key to force re-render on change if needed, but CSS animation should handle it
          className={`absolute top-0 left-0 w-full h-1/2 bg-primary/90 text-primary-foreground rounded-t-lg flex items-end justify-center pb-1 overflow-hidden z-10 origin-bottom border-b border-black/10 ${isFlipping ? 'animate-flip-down' : ''}`}
        >
          <span className="text-3xl sm:text-4xl md:text-5xl font-bold tabular-nums">
             {formattedPreviousValue}
          </span>
        </div>
         {/* Bottom Half (New - shows current value and flips up) */}
         <div
            key={`bottom-${currentValue}`} // Use key to force re-render on change
            className={`absolute bottom-0 left-0 w-full h-1/2 bg-primary text-primary-foreground rounded-b-lg flex items-start justify-center pt-1 overflow-hidden z-10 origin-top ${isFlipping ? 'animate-flip-up' : ''}`}
            style={{ transform: isFlipping ? 'rotateX(0deg)' : 'rotateX(-90deg)' }} // Start flipped up
         >
            <span className="text-3xl sm:text-4xl md:text-5xl font-bold tabular-nums">
              {formattedCurrentValue}
            </span>
          </div>
      </div>
      {/* Label */}
      <span className="mt-3 text-xs sm:text-sm font-medium uppercase text-muted-foreground tracking-wider">
        {label}
      </span>
    </div>
  );
};


interface CountdownProps {
  targetTimestamp: number;
}

export const Countdown: React.FC<CountdownProps> = ({ targetTimestamp }) => {
  const calculateTimeLeft = (): TimeLeft | null => {
    const difference = targetTimestamp - new Date().getTime();
    if (difference <= 0) {
       // Return 0 when the countdown is finished
      return { days: 0, hours: 0, minutes: 0, seconds: 0 };
    }
    return {
      days: Math.floor(difference / (1000 * 60 * 60 * 24)),
      hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
      minutes: Math.floor((difference / 1000 / 60) % 60),
      seconds: Math.floor((difference / 1000) % 60),
    };
  };

  const [timeLeft, setTimeLeft] = useState<TimeLeft | null>(null);
  const [previousTimeLeft, setPreviousTimeLeft] = useState<TimeLeft | null>(null);
  const [isClient, setIsClient] = useState(false);

   useEffect(() => {
     setIsClient(true); // Indicate client-side rendering
     // Initial calculation immediately on client mount
     const initialTime = calculateTimeLeft();
     setTimeLeft(initialTime);
     setPreviousTimeLeft(initialTime); // Sync previous state initially

     const timer = setInterval(() => {
       const newTimeLeft = calculateTimeLeft();
       setTimeLeft(current => {
         setPreviousTimeLeft(current); // Update previous state *before* setting the new current state
         return newTimeLeft;
       });

       // Stop interval if countdown reaches zero
        if (newTimeLeft && newTimeLeft.days <= 0 && newTimeLeft.hours <= 0 && newTimeLeft.minutes <= 0 && newTimeLeft.seconds <= 0) {
            clearInterval(timer);
         }
     }, 1000);

     return () => clearInterval(timer); // Cleanup interval on unmount
   }, [targetTimestamp]); // Re-run effect if targetTimestamp changes


  // Avoid rendering the countdown on the server or before hydration
  if (!isClient || !timeLeft || !previousTimeLeft) {
    return (
        <div className="flex justify-center items-center text-foreground text-xl space-x-4">
           {/* Placeholder structure matching the final layout */}
           <div className="flex flex-col items-center mx-2 sm:mx-3">
             <div className="w-16 h-20 sm:w-20 sm:h-24 md:w-24 md:h-28 bg-muted rounded-lg"></div>
             <span className="mt-3 text-xs sm:text-sm font-medium uppercase text-muted-foreground tracking-wider">Days</span>
           </div>
            <div className="flex flex-col items-center mx-2 sm:mx-3">
             <div className="w-16 h-20 sm:w-20 sm:h-24 md:w-24 md:h-28 bg-muted rounded-lg"></div>
             <span className="mt-3 text-xs sm:text-sm font-medium uppercase text-muted-foreground tracking-wider">Hours</span>
           </div>
            <div className="flex flex-col items-center mx-2 sm:mx-3">
             <div className="w-16 h-20 sm:w-20 sm:h-24 md:w-24 md:h-28 bg-muted rounded-lg"></div>
             <span className="mt-3 text-xs sm:text-sm font-medium uppercase text-muted-foreground tracking-wider">Minutes</span>
           </div>
            <div className="flex flex-col items-center mx-2 sm:mx-3">
             <div className="w-16 h-20 sm:w-20 sm:h-24 md:w-24 md:h-28 bg-muted rounded-lg"></div>
             <span className="mt-3 text-xs sm:text-sm font-medium uppercase text-muted-foreground tracking-wider">Seconds</span>
           </div>
        </div>
    );
  }


  return (
    <div className="flex justify-center items-start p-4 rounded-lg">
      <FlipUnit
        currentValue={timeLeft.days}
        previousValue={previousTimeLeft.days}
        label="Days"
      />
      <FlipUnit
        currentValue={timeLeft.hours}
        previousValue={previousTimeLeft.hours}
        label="Hours"
      />
      <FlipUnit
        currentValue={timeLeft.minutes}
        previousValue={previousTimeLeft.minutes}
        label="Minutes"
      />
      <FlipUnit
        currentValue={timeLeft.seconds}
        previousValue={previousTimeLeft.seconds}
        label="Seconds"
      />
    </div>
  );
};

// Note: Ensure the flip animations (@keyframes flip-down, @keyframes flip-up)
// and the .perspective class are defined in your global CSS file (e.g., src/app/globals.css)
/* Example CSS (ensure it's in globals.css):
@layer components {
  .perspective {
    perspective: 1000px;
  }
}
@layer utilities {
  @keyframes flip-down {
    0% { transform: rotateX(0deg); }
    100% { transform: rotateX(-90deg); }
  }
  @keyframes flip-up {
    0% { transform: rotateX(90deg); }
    100% { transform: rotateX(0deg); }
  }
  .animate-flip-down {
    animation: flip-down 0.5s ease-in-out forwards;
    backface-visibility: hidden;
    transform-origin: bottom;
  }
 .animate-flip-up {
    animation: flip-up 0.5s ease-in-out 0s forwards;
    backface-visibility: hidden;
    transform-origin: top;
 }
}
*/
