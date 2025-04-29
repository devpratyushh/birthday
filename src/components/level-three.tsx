
'use client';

import React from 'react';
import Image from 'next/image';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Video, Heart, PartyPopper, Star, Flower2 } from 'lucide-react'; // Import icons

interface LevelThreeProps {
  imageUrl: string;
  meetLink: string;
}

const LevelThree: React.FC<LevelThreeProps> = ({ imageUrl, meetLink }) => {

    const placeholderImageUrl = (seed: string, width = 400, height = 533) => // Adjusted height for portrait
       `https://picsum.photos/seed/${seed}/${width}/${height}`;


  return (
    <div className="relative w-full max-w-3xl mx-auto animate-fade-in pt-6"> {/* Added relative and padding */}
        {/* Floating Decorations */}
         <Heart
            className="absolute -top-2 -left-10 w-10 h-10 text-primary/60 animate-gentle-sway opacity-80 z-20"
            style={{ animationDelay: '0.2s', animationDuration: '6s' }}
            fill="currentColor"
            strokeWidth={0}
         />
         <PartyPopper
            className="absolute -top-4 -right-8 w-12 h-12 text-pink-400/70 transform -rotate-12 animate-balloon-float-1 opacity-90 z-20"
             style={{ animationDelay: '0s', animationDuration: '8s' }}
          />
           <Heart
            className="absolute -bottom-8 -right-12 w-14 h-14 text-accent/70 animate-slow-spin-fade opacity-70 z-20"
            style={{ animationDelay: '0.5s', animationDuration: '18s' }}
            fill="currentColor"
            strokeWidth={0}
          />
           <Flower2 // Added flower
            className="absolute bottom-1/4 -left-8 w-5 h-5 text-secondary/40 animate-twinkle opacity-60 z-20"
            style={{ animationDelay: '1.5s', animationDuration: '9s' }}
            fill="currentColor"
            strokeWidth={0.2}
           />
           <PartyPopper
            className="absolute -bottom-6 -left-14 w-10 h-10 text-purple-400/60 transform rotate-10 animate-balloon-float-3 opacity-85 z-20"
            style={{ animationDelay: '0.3s', animationDuration: '9s' }}
          />

        {/* Card Container */}
        <div className="relative z-10">
          <Card className="shadow-xl bg-card/95 backdrop-blur-md rounded-xl overflow-hidden">
            <CardHeader className="text-center">
              <CardTitle className="text-3xl md:text-4xl font-bold text-primary-highlight">
                Level 3: One Last Surprise! ✨
              </CardTitle>
            </CardHeader>
            <CardContent className="flex flex-col items-center space-y-6 p-6 md:p-8">
              <p className="text-lg text-foreground/90">A special memory, framed just for you.</p>

              {/* Updated Frame Styling: Thick pink border */}
              {/* The p-2 acts as the inner padding/matte, the border-[12px] is the thick frame */}
              <div className="relative p-2 bg-primary/20 rounded-md shadow-lg border-[12px] border-primary/70 w-full max-w-md aspect-[3/4] overflow-hidden mx-auto"> {/* Thick pink border, adjusted background */}

                  <Image
                     src={imageUrl || placeholderImageUrl('final-image')} // Use provided URL or placeholder
                     alt="Our Special Moment"
                     layout="fill"
                     objectFit="cover" // Cover ensures image fills the frame nicely
                     className="rounded-sm" // Apply slight rounding to the image itself
                      onError={(e) => { (e.target as HTMLImageElement).src = placeholderImageUrl('final-image-error'); }}
                  />
                   {/* Optional: Subtle inner shadow for depth inside the frame */}
                  <div className="absolute inset-2 border border-black/10 rounded-sm pointer-events-none shadow-inner"></div>
              </div>


              <p className="text-lg text-foreground/90 mt-8">And finally... let's talk?</p>

              {/* Google Meet Link Button */}
              <Button
                asChild // Allows the button to act as a link
                variant="secondary"
                size="lg"
                className="bg-green-600 hover:bg-green-700 text-white font-semibold"
              >
                <a href={meetLink} target="_blank" rel="noopener noreferrer">
                  <Video className="mr-2 h-5 w-5" />
                  Join the Meet
                </a>
              </Button>

               <p className="text-sm text-muted-foreground mt-4">I'll be waiting! ❤️</p>

            </CardContent>
          </Card>
        </div>
    </div>
  );
};

export default LevelThree;
