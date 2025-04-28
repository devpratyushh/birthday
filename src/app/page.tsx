'use client';

import { useState, useEffect } from 'react';
import { Countdown } from '@/components/countdown';
import BirthdayLetter from '@/components/birthday-letter';
import BackgroundAnimation from '@/components/background-animation'; // Assuming this was part of the initial version

// Target date: April 30th, 2025, 00:00:00 IST
const TARGET_DATE = new Date('2025-04-30T00:00:00+05:30').getTime();

export default function Home() {
  const [timeLeft, setTimeLeft] = useState<number | null>(null);
  const [isClient, setIsClient] = useState(false);
  const [showLetter, setShowLetter] = useState(false);

  useEffect(() => {
    setIsClient(true); // Indicate that the component has mounted on the client

    const calculateTimeLeft = () => {
      const now = new Date().getTime();
      const difference = TARGET_DATE - now;
      setTimeLeft(difference);
      if (difference <= 0) {
        setShowLetter(true);
      }
    };

    calculateTimeLeft(); // Initial calculation

    const timer = setInterval(calculateTimeLeft, 1000);

    // Cleanup function to clear the interval when the component unmounts
    return () => clearInterval(timer);
  }, []);

  if (!isClient) {
    // Render nothing or a loading state on the server to avoid hydration mismatch
    return null;
  }

  return (
    <main className="flex min-h-screen flex-col items-center justify-center relative overflow-hidden bg-background p-4 md:p-8">
      <BackgroundAnimation />
      <div className="z-10 w-full max-w-4xl text-center">
        {showLetter || (timeLeft !== null && timeLeft <= 0) ? (
          <BirthdayLetter />
        ) : timeLeft !== null ? (
          <div className="flex flex-col items-center justify-center h-full">
             <h1 className="text-4xl md:text-6xl font-bold mb-8 text-primary animate-pulse">
               It's Almost Time...
             </h1>
            <Countdown targetTimestamp={TARGET_DATE} />
          </div>
        ) : (
          // Optional: Loading state while calculating time
          <div className="text-2xl text-foreground">Loading...</div>
        )}
      </div>
    </main>
  );
}
