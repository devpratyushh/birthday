
"use client";

import { useState, useEffect, memo, useRef } from 'react';
import { cn } from '@/lib/utils';

interface TimeLeft {
  days: number;
  hours: number;
  minutes: number;
  // Removed seconds
}

interface CountdownProps {
  targetDate: Date;
  onComplete: () => void;
}

// Calculate time left, ensuring seconds are handled internally for accuracy
const calculateTimeLeft = (target: number): TimeLeft | null => {
  const difference = target - Date.now();

  if (difference <= 0) {
    return null;
  }

  // Still calculate seconds internally to accurately determine when a minute flips
  const totalSeconds = Math.floor(difference / 1000);
  const days = Math.floor(totalSeconds / (60 * 60 * 24));
  const hours = Math.floor((totalSeconds / (60 * 60)) % 24);
  const minutes = Math.floor((totalSeconds / 60) % 60);

  return {
    days,
    hours,
    minutes,
  };
};

interface FlipUnitProps {
  currentValue: number;
  label: string;
}

// Memoized FlipUnit component remains largely the same
const FlipUnit: React.FC<FlipUnitProps> = memo(({ currentValue, label }) => {
  const [isFlipping, setIsFlipping] = useState(false);
  const previousValueRef = useRef(currentValue);
  const [displayValue, setDisplayValue] = useState(currentValue);
  const [hasMounted, setHasMounted] = useState(false);

  const formattedDisplayValue = String(displayValue).padStart(2, '0');
  const formattedPreviousValue = String(previousValueRef.current).padStart(2, '0');

   useEffect(() => {
    setHasMounted(true);
  }, []);


  useEffect(() => {
     if (!hasMounted || currentValue === previousValueRef.current) {
       setDisplayValue(currentValue); // Ensure initial render is correct
       previousValueRef.current = currentValue;
       return;
     }

    setIsFlipping(true);
    // Animation duration should match CSS animation time
    const timer = setTimeout(() => {
      setDisplayValue(currentValue); // Update display value after flip starts visually
      previousValueRef.current = currentValue; // Update previous value ref
      setIsFlipping(false); // End the flipping state *after* visual update
    }, 490); // Near the end of the 0.5s animation

    return () => clearTimeout(timer);
  }, [currentValue, hasMounted]);


  const commonDigitClasses = "text-3xl md:text-5xl font-bold tabular-nums";
  const commonHalfClasses = "absolute inset-0 flex items-center justify-center overflow-hidden";

  return (
    <div className="flex flex-col items-center text-center w-16 h-24 md:w-24 md:h-32">
      <div className="relative w-full h-full perspective-[500px]">
        {/* Static Bottom Half (Shows current display value) */}
        <div className={cn(
          commonHalfClasses,
          "top-1/2 h-1/2 rounded-b-lg bg-primary text-primary-foreground pt-1 items-start" // Align to top edge
        )}>
          <span className={commonDigitClasses}>{formattedDisplayValue}</span>
        </div>

        {/* Static Top Half (Shows current display value) */}
        <div className={cn(
          commonHalfClasses,
          "bottom-1/2 h-1/2 rounded-t-lg bg-primary/80 text-primary-foreground pb-1 items-end" // Align to bottom edge
        )}>
          <span className={commonDigitClasses}>{formattedDisplayValue}</span>
        </div>

        {/* Flipping Top Half (Shows previous value) - Flips Down */}
        <div
          className={cn(
            commonHalfClasses,
            "bottom-1/2 h-1/2 rounded-t-lg bg-primary text-primary-foreground pb-1 items-end", // Align to bottom edge
            "origin-bottom transform-style-3d backface-hidden",
            isFlipping ? 'animate-flip-down' : ''
          )}
          style={{ zIndex: 3 }} // Ensure it's on top during flip
          key={`${label}-top-flip-${previousValueRef.current}`} // Key helps react detect change
        >
          <span className={commonDigitClasses}>{formattedPreviousValue}</span>
        </div>

         {/* Flipping Bottom Half (Shows new current value) - Appears from Top */}
         <div
          className={cn(
            commonHalfClasses,
            "top-1/2 h-1/2 rounded-b-lg bg-primary/80 text-primary-foreground pt-1 items-start", // Align to top edge
            "origin-top transform-style-3d backface-hidden",
             // Apply flip-up animation *only when flipping*
            isFlipping ? 'animate-flip-up' : 'transform rotate-x-90', // Start flipped up if not animating
          )}
          style={{ zIndex: 2 }} // Ensure it's behind the top flip but above static
           key={`${label}-bottom-flip-${currentValue}`} // Key helps react detect change
        >
          <span className={commonDigitClasses}>{formattedDisplayValue}</span>
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
    setIsClient(true); // Ensures this runs only on the client

    const checkTime = () => {
        const timeLeft = calculateTimeLeft(targetTime);
        setCurrentTimeLeft(timeLeft);

        if (timeLeft === null) {
            console.log("Countdown check detected completion.");
            onComplete();
            if (intervalRef.current) {
                 clearInterval(intervalRef.current);
            }
        }
    };

    checkTime(); // Initial check

    // Set up the interval only if not already completed
    if (calculateTimeLeft(targetTime) !== null) {
        intervalRef.current = setInterval(checkTime, 1000); // Update every second
    }

    // Cleanup function
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [targetTime, onComplete]); // Rerun effect only if targetTime or onComplete changes


  if (!isClient || currentTimeLeft === null) {
    // Render placeholders or nothing while hydrating or if completed
    // Updated to only show placeholders for days, hours, minutes
    return (
        <div className="flex justify-center items-start space-x-2 sm:space-x-4 md:space-x-6 p-4">
            {(['days', 'hours', 'minutes']).map((label) => (
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
      // Updated to map only over days, hours, minutes
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
// are defined in globals.css.
