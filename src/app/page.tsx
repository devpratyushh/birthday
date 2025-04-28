
'use client';

import { useState, useEffect } from 'react';
import { Countdown } from '@/components/countdown';
import { VerticalTimeline } from '@/components/vertical-timeline'; // Import VerticalTimeline
import BirthdayLetter from '@/components/birthday-letter';
import BackgroundAnimation from '@/components/background-animation';
import { timelineEvents } from '@/data/timeline-events'; // Import timeline data

// Target date: April 30th, 2025, 00:00:00 IST
const TARGET_DATE = new Date('2025-04-30T00:00:00+05:30').getTime();

export default function Home() {
  const [timeLeft, setTimeLeft] = useState<number | null>(null);
  const [isClient, setIsClient] = useState(false);
  const [showLetter, setShowLetter] = useState(false);

  useEffect(() => {
    // This ensures the component runs only on the client
    setIsClient(true);

    const calculateTimeLeft = () => {
      const now = new Date().getTime();
      const difference = TARGET_DATE - now;

      // Only update state if the component is still mounted
      if (difference <= 0) {
        setShowLetter(true);
        setTimeLeft(0); // Set time left to 0 when target is reached
      } else {
        setTimeLeft(difference);
        setShowLetter(false); // Ensure letter is hidden if time resets or page reloads before target
      }
    };

    calculateTimeLeft(); // Initial calculation on mount

    // Set up the interval timer
    const timer = setInterval(calculateTimeLeft, 1000);

    // Cleanup function to clear the interval when the component unmounts
    return () => clearInterval(timer);
  }, []); // Empty dependency array ensures this runs only once on mount

  // Avoid rendering potentially mismatched content on the server
  if (!isClient) {
    return (
      <main className="flex min-h-screen flex-col items-center justify-center relative overflow-hidden bg-background p-4 md:p-8">
        <BackgroundAnimation />
        <div className="z-10 w-full max-w-4xl text-center">
          <div className="text-2xl text-foreground">Loading...</div>
        </div>
      </main>
    );
  }

  return (
    <main className="flex min-h-screen flex-col items-center relative overflow-hidden bg-background p-4 md:p-8 pt-16 md:pt-24"> {/* Added padding top */}
      <BackgroundAnimation />
      <div className="z-10 w-full max-w-5xl text-center">
        {showLetter ? (
          <BirthdayLetter />
        ) : (
          <>
            {/* Countdown Section */}
            <div className="mb-16 md:mb-24 flex flex-col items-center">
               <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-6 text-primary animate-fade-in">
                 Pookie's Birthday Surprise!
               </h1>
               <p className="text-lg md:text-xl text-foreground mb-8 animate-fade-in" style={{ animationDelay: '0.2s' }}>
                 Counting down until the special moment...
               </p>
               {timeLeft !== null ? (
                 <Countdown targetTimestamp={TARGET_DATE} />
               ) : (
                 <div className="text-xl text-foreground">Calculating time...</div>
               )}
            </div>

            {/* Timeline Section */}
            <div className="w-full px-4 md:px-0">
              <h2 className="text-2xl sm:text-3xl md:text-4xl font-semibold mb-10 md:mb-12 text-secondary-foreground animate-fade-in" style={{ animationDelay: '0.4s' }}>
                Our Journey So Far...
              </h2>
              <VerticalTimeline events={timelineEvents} />
            </div>
          </>
        )}
      </div>
       {/* Optional Footer */}
       {!showLetter && (
         <footer className="z-10 mt-16 md:mt-24 text-center text-muted-foreground text-sm animate-fade-in" style={{ animationDelay: '0.6s' }}>
           Made with love ❤️
         </footer>
       )}
    </main>
  );
}
