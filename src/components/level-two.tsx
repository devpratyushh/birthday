
'use client';

import React, { useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import YoutubeEmbed from './youtube-embed';
import { ArrowRight, Heart, PartyPopper, Star } from 'lucide-react'; // Added Heart, PartyPopper, Star

interface LevelTwoProps {
  videoId: string;
  onLevelComplete: () => void;
}

const LevelTwo: React.FC<LevelTwoProps> = ({ videoId, onLevelComplete }) => {
    const [videoEnded, setVideoEnded] = React.useState(false);

    // Callback for when the YouTube video ends
    const handleVideoEnd = () => {
        console.log("Proposal video ended.");
        setVideoEnded(true);
    };

    useEffect(() => {
        // Optional: Add any specific logic for when Level Two mounts
        console.log("Level Two mounted");
        // Reset video ended state if component remounts (e.g., due to navigation)
        setVideoEnded(false);
    }, []);


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
          <Star // Added a star
            className="absolute bottom-1/4 -left-8 w-5 h-5 text-secondary/40 animate-twinkle opacity-60 z-20"
            style={{ animationDelay: '1.5s', animationDuration: '9s' }}
            fill="currentColor"
            strokeWidth={0.2}
            />
         <PartyPopper
            className="absolute -bottom-6 -left-14 w-10 h-10 text-purple-400/60 transform rotate-10 animate-balloon-float-3 opacity-85 z-20"
            style={{ animationDelay: '0.3s', animationDuration: '9s' }}
          />

        {/* Card container */}
        <div className="relative z-10">
            <Card className="shadow-xl bg-card/95 backdrop-blur-md rounded-xl overflow-hidden">
            <CardHeader className="text-center">
                <CardTitle className="text-3xl md:text-4xl font-bold text-primary-highlight">
                Level 2: The Longg Story ⏳
                </CardTitle>
            </CardHeader>
            <CardContent className="flex flex-col items-center space-y-6 p-6 md:p-8">
            <p className="text-lg text-foreground/90">I have something to tell you...</p>

            {/* YouTube Embed */}
            <div className="w-full max-w-2xl aspect-video rounded-lg overflow-hidden shadow-lg border border-secondary/30">
                <YoutubeEmbed embedId={videoId} onEnd={handleVideoEnd} />
            </div>

            {/* Button to proceed - appears after video ends */}
            {videoEnded && (
                <Button
                    onClick={onLevelComplete}
                    variant="default"
                    size="lg"
                    className="mt-6 animate-bounce bg-primary hover:bg-primary/90" // Added bounce animation
                >
                    See What's Next <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
            )}
            {!videoEnded && (
                    <p className="text-sm text-muted-foreground mt-4">Watch the video to continue...</p>
            )}

            </CardContent>
            </Card>
        </div>
    </div>
  );
};

export default LevelTwo;
