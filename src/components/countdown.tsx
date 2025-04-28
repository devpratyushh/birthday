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

// FlipUnit Component (Stylized)
const FlipUnit: React.FC<FlipUnitProps> = ({ currentValue, previousValue, label }) => {
  const [isFlipping, setIsFlipping] = useState(false);
  const formattedCurrentValue = formatNumber(currentValue);
  const formattedPreviousValue = formatNumber(previousValue);

  useEffect(() => {
    if (currentValue !== previousValue) {
      setIsFlipping(true);
      const timeout = setTimeout(() => setIsFlipping(false), 600); // Duration of animation
      return () => clearTimeout(timeout);
    }
  }, [currentValue, previousValue]);

  return (
    <div className="flex flex-col items-center mx-2 sm:mx-3">
      <div className="relative w-16 h-20 sm:w-24 sm:h-28 perspective">
        {/* Static Top */}
        <div className="absolute top-0 left-0 w-full h-1/2 bg-primary/80 text-primary-foreground rounded-t-lg flex items-end justify-center pb-1 overflow-hidden">
          <span className="text-3xl sm:text-5xl font-bold tabular-nums">
            {isFlipping ? formattedPreviousValue : formattedCurrentValue}
          </span>
        </div>
        {/* Static Bottom */}
        <div className="absolute bottom-0 left-0 w-full h-1/2 bg-primary text-primary-foreground rounded-b-lg flex items-start justify-center pt-1 overflow-hidden">
          <span className="text-3xl sm:text-5xl font-bold tabular-nums">
            {formattedCurrentValue}
          </span>
        </div>
        {/* Flipping Top */}
        {isFlipping && (
          <div
            className="absolute top-0 left-0 w-full h-1/2 bg-primary/80 text-primary-foreground rounded-t-lg flex items-end justify-center pb-1 overflow-hidden z-10 origin-bottom animate-flip-down"
          >
            <span className="text-3xl sm:text-5xl font-bold tabular-nums">
              {formattedPreviousValue}
            </span>
          </div>
        )}
         {/* Flipping Bottom */}
         {isFlipping && (
          <div
            className="absolute bottom-0 left-0 w-full h-1/2 bg-primary text-primary-foreground rounded-b-lg flex items-start justify-center pt-1 overflow-hidden z-10 origin-top animate-flip-up"
          >
            <span className="text-3xl sm:text-5xl font-bold tabular-nums">
              {formattedCurrentValue}
            </span>
          </div>
         )}
      </div>
      <span className="mt-2 text-xs sm:text-sm font-medium uppercase text-muted-foreground">
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
   // Store previous state for flip animation
  const [previousTimeLeft, setPreviousTimeLeft] = useState<TimeLeft | null>(null);


  useEffect(() => {
     // Initial calculation immediately on client mount
    const initialTimeLeft = calculateTimeLeft();
    setTimeLeft(initialTimeLeft);
    setPreviousTimeLeft(initialTimeLeft); // Initialize previous state

    const timer = setInterval(() => {
      const newTimeLeft = calculateTimeLeft();
      setTimeLeft(current => {
        setPreviousTimeLeft(current); // Store current as previous before update
        return newTimeLeft;
      });

      if (newTimeLeft && newTimeLeft.days === 0 && newTimeLeft.hours === 0 && newTimeLeft.minutes === 0 && newTimeLeft.seconds === 0) {
        clearInterval(timer);
      }
    }, 1000);

    return () => clearInterval(timer);
  }, [targetTimestamp]);


  if (!timeLeft || !previousTimeLeft) {
    // Optional: Render placeholders or nothing until calculated
     return (
        <div className="flex justify-center items-center text-foreground text-xl">
           Calculating time remaining...
        </div>
    );
  }


  return (
    <div className="flex justify-center items-center p-4 rounded-lg ">
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

// Add CSS for animations and perspective in globals.css or a relevant CSS file
/*
@tailwind base;
@tailwind components;
@tailwind utilities;

@layer base {
  :root {
    // ... your existing theme variables
  }
  .dark {
    // ... your existing dark theme variables
  }
}

@layer components {
  .perspective {
    perspective: 1000px;
  }

  @keyframes flip-down {
    0% {
      transform: rotateX(0deg);
    }
    100% {
      transform: rotateX(-90deg);
    }
  }

  .animate-flip-down {
    animation: flip-down 0.6s ease-in-out forwards;
    backface-visibility: hidden;
  }


   @keyframes flip-up {
    0% {
      transform: rotateX(90deg);
    }
    100% {
      transform: rotateX(0deg);
    }
  }

  .animate-flip-up {
     animation: flip-up 0.6s ease-in-out forwards;
     backface-visibility: hidden;
  }
}

@layer utilities {
  // ... any custom utilities
}
*/
