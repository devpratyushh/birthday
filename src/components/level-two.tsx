
'use client';

import React, { useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import YoutubeEmbed from './youtube-embed';
import { ArrowRight } from 'lucide-react';

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
    <div className="w-full max-w-3xl mx-auto animate-fade-in">
      <Card className="shadow-xl bg-card/95 backdrop-blur-md rounded-xl">
        <CardHeader className="text-center">
          <CardTitle className="text-3xl md:text-4xl font-bold text-primary-highlight">
            Level 2: The Longg Story ⏳ {/* Updated title */}
          </CardTitle>
        </CardHeader>
        <CardContent className="flex flex-col items-center space-y-6 p-6 md:p-8">
           <p className="text-lg text-foreground/90">I have something to tell you...</p> {/* Updated subtitle */}

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
  );
};

export default LevelTwo;

