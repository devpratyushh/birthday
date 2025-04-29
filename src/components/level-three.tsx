
'use client';

import React from 'react';
import Image from 'next/image';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Video } from 'lucide-react'; // Icon for the meet link

interface LevelThreeProps {
  imageUrl: string;
  meetLink: string;
}

const LevelThree: React.FC<LevelThreeProps> = ({ imageUrl, meetLink }) => {

    const placeholderImageUrl = (seed: string, width = 600, height = 400) =>
       `https://picsum.photos/seed/${seed}/${width}/${height}`;


  return (
    <div className="w-full max-w-3xl mx-auto animate-fade-in">
      <Card className="shadow-xl bg-card/95 backdrop-blur-md rounded-xl overflow-hidden">
        <CardHeader className="text-center">
          <CardTitle className="text-3xl md:text-4xl font-bold text-primary-highlight">
            Level 3: One Last Surprise! ✨
          </CardTitle>
        </CardHeader>
        <CardContent className="flex flex-col items-center space-y-6 p-6 md:p-8">
          <p className="text-lg text-foreground/90">A special memory, framed just for you.</p>

          {/* Framed Image */}
          <div className="relative p-4 bg-gradient-to-br from-yellow-800 via-yellow-900 to-yellow-950 rounded-lg shadow-inner border-4 border-yellow-700/50 w-full max-w-xl aspect-[4/3] overflow-hidden">
             {/* Inner shadow/bevel effect */}
             <div className="absolute inset-1 border border-black/20 rounded-sm pointer-events-none"></div>
             <div className="absolute inset-2 border border-white/10 rounded-xs pointer-events-none"></div>

              <Image
                 src={imageUrl || placeholderImageUrl('final-image')} // Use provided URL or placeholder
                 alt="Our Special Moment"
                 layout="fill"
                 objectFit="cover"
                 className="rounded-sm"
                  onError={(e) => { (e.target as HTMLImageElement).src = placeholderImageUrl('final-image-error'); }}
              />
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
  );
};

export default LevelThree;
