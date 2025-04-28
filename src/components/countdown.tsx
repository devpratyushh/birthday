"use client";

import { useState, useEffect, memo, useRef } from 'react';
import { cn } from '@/lib/utils';

interface TimeLeft {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
}

interface CountdownProps {
  targetDate: Date;
  onComplete: () => void;
}

const calculateTimeLeft = (target: number): TimeLeft | null => {
  const difference = target - Date.now();

  if (difference <= 0) {
    return null;
  }

  return {
    days: Math.floor(difference / (1000 * 60 * 60 * 24)),
    hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
    minutes: Math.floor((difference / (1000 * 60)) % 60),
    seconds: Math.floor((difference / 1000) % 60),
  };
};

interface FlipUnitProps {
  currentValue: number;
  label: string;
}

const FlipUnit: React.FC<FlipUnitProps> = memo(({ currentValue, label }) => {
  const [isFlipping, setIsFlipping] = useState(false);
  const previousValueRef = useRef(currentValue);
  const [hasMounted, setHasMounted] = useState(false);

  const formattedValue = String(currentValue).padStart(2, '0');
  const formattedPreviousValue = String(previousValueRef.current).padStart(2, '0');

  useEffect(() => {
    setHasMounted(true);
  }, []);

  useEffect(() => {
    if (!hasMounted || currentValue === previousValueRef.current) {
      previousValueRef.current = currentValue;
      return;
    }

    setIsFlipping(true);
    const timer = setTimeout(() => {
      setIsFlipping(false);
      previousValueRef.current = currentValue;
    }, 480); // Animation duration is 0.5s, so wait slightly less

    return () => clearTimeout(timer);
  }, [currentValue, hasMounted]);

  const commonDigitClasses = "text-3xl md:text-5xl font-bold tabular-nums";
  const commonHalfClasses = "absolute inset-0 flex items-center justify-center overflow-hidden";

  return (
    <div className="flex flex-col items-center text-center w-16 h-24 md:w-24 md:h-32">
      <div className="relative w-full h-full perspective-[500px]">
        {/* Static Bottom Half (Current Value) */}
        <div className={cn(
          commonHalfClasses,
          "top-1/2 h-1/2 rounded-b-lg bg-primary text-primary-foreground pt-1 items-start" // Align to top edge
        )}>
          <span className={commonDigitClasses}>{formattedValue}</span>
        </div>

        {/* Static Top Half (Current Value) */}
        <div className={cn(
          commonHalfClasses,
          "bottom-1/2 h-1/2 rounded-t-lg bg-primary/80 text-primary-foreground pb-1 items-end" // Align to bottom edge
        )}>
          <span className={commonDigitClasses}>{formattedValue}</span>
        </div>

        {/* Flipping Top Half (Previous Value) - Flips Down */}
        <div
          className={cn(
            commonHalfClasses,
            "bottom-1/2 h-1/2 rounded-t-lg bg-primary text-primary-foreground pb-1 items-end", // Align to bottom edge
            "origin-bottom transform-style-3d backface-hidden",
            isFlipping ? 'animate-flip-down' : ''
          )}
          style={{ zIndex: isFlipping ? 3 : 1 }} // Ensure it's on top during flip
          key={`${label}-top-flip-${previousValueRef.current}`} // Key helps reset state if needed
        >
          <span className={commonDigitClasses}>{formattedPreviousValue}</span>
        </div>

         {/* Flipping Bottom Half (Current Value) - Appears from Top */}
         <div
          className={cn(
            commonHalfClasses,
            "top-1/2 h-1/2 rounded-b-lg bg-primary/80 text-primary-foreground pt-1 items-start", // Align to top edge
            "origin-top transform-style-3d backface-hidden",
            isFlipping ? 'animate-flip-up' : ''
          )}
          style={{ zIndex: isFlipping ? 2 : 0 }} // Ensure it's behind the top flip but above static
           key={`${label}-bottom-flip-${currentValue}`}
        >
          <span className={commonDigitClasses}>{formattedValue}</span>
        </div>

        {/* Divider line - Adjusted position and color */}
        <div className="absolute top-1/2 left-0 w-full h-px bg-black/20 z-[4]"></div>
         {/* Shadow effect (optional) */}
         <div className="absolute inset-0 rounded-lg shadow-inner shadow-black/10 pointer-events-none z-[5]"></div>
      </div>

      {/* Label */}
      <span className="text-xs md:text-sm uppercase text-muted-foreground pt-2 font-medium tracking-wider">{label}</span>
    </div>
  );
});

FlipUnit.displayName = 'FlipUnit';


export const Countdown: React.FC<CountdownProps> = ({ targetDate, onComplete }) => {
  const targetTime = targetDate.getTime();
  const [currentTimeLeft, setCurrentTimeLeft] = useState<TimeLeft | null>(null);
  const [isClient, setIsClient] = useState(false);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    setIsClient(true);
    const initialTime = calculateTimeLeft(targetTime);
    setCurrentTimeLeft(initialTime);

    if (initialTime === null) {
      console.log("Countdown initial check detected completion.");
      onComplete();
      return;
    }

    intervalRef.current = setInterval(() => {
      const newTimeLeft = calculateTimeLeft(targetTime);
      setCurrentTimeLeft(newTimeLeft);

      if (newTimeLeft === null) {
        console.log("Countdown interval detected completion.");
        onComplete();
        if (intervalRef.current) {
          clearInterval(intervalRef.current);
        }
      }
    }, 1000);

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [targetTime, onComplete]);


  if (!isClient || currentTimeLeft === null) {
    // Render placeholders
    return (
        <div className="flex justify-center items-start space-x-2 sm:space-x-4 md:space-x-6 p-4">
            {(['days', 'hours', 'minutes', 'seconds']).map((label) => (
                <div key={label} className="flex flex-col items-center text-center w-16 h-24 md:w-24 md:h-32">
                     <div className="relative w-full h-full bg-primary/10 rounded-lg flex flex-col">
                         <div className="h-1/2 w-full bg-primary/20 rounded-t-lg"></div>
                         <div className="h-1/2 w-full bg-primary/30 rounded-b-lg"></div>
                         <div className="absolute inset-0 rounded-lg shadow-inner shadow-black/10"></div>
                         <div className="absolute top-1/2 left-0 w-full h-px bg-black/20"></div>
                     </div>
                    <span className="text-xs md:text-sm uppercase text-muted-foreground pt-2 font-medium tracking-wider">{label}</span>
                </div>
            ))}
        </div>
    );
  }


  return (
      <div className="flex justify-center items-start space-x-2 sm:space-x-4 md:space-x-6 p-4">
        {(Object.keys(currentTimeLeft) as Array<keyof TimeLeft>).map((interval) => (
          <FlipUnit
            key={interval}
            currentValue={currentTimeLeft[interval]}
            label={interval}
          />
        ))}
      </div>
  );
};

// Ensure necessary CSS for perspective, backface-visibility, and flip animations
// are defined in globals.css or injected elsewhere.
/* Make sure these keyframes and utility classes are in globals.css:
.perspective-\\[500px\\] { perspective: 500px; }
.transform-style-3d { transform-style: preserve-3d; }
.backface-hidden { backface-visibility: hidden; -webkit-backface-visibility: hidden; }

@keyframes flip-down {
  0% { transform: rotateX(0deg); }
  100% { transform: rotateX(-90deg); }
}
.animate-flip-down {
  animation: flip-down 0.5s ease-in forwards;
}

@keyframes flip-up {
  0% { transform: rotateX(90deg); }
  100% { transform: rotateX(0deg); }
}
.animate-flip-up {
   Add slight delay to start after top flip finishes
   animation: flip-up 0.5s ease-out forwards;
}
*/
