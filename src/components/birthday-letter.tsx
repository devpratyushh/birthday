'use client';

import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

const BirthdayLetter: React.FC = () => {
  return (
    <Card className="w-full max-w-2xl mx-auto shadow-lg bg-background/90 backdrop-blur-sm animate-fade-in">
      <CardHeader className="text-center">
        <CardTitle className="text-3xl font-bold text-primary drop-shadow-md">
          Happy Birthday, My Dearest!
        </CardTitle>
      </CardHeader>
      <CardContent className="text-lg text-foreground leading-relaxed space-y-4">
        <p>
          My Love,
        </p>
        <p>
          Words feel inadequate to express the depth of my feelings for you, especially today, on your special day. Happy Birthday! 🎉
        </p>
        <p>
          From the moment you came into my life, everything became brighter, more colourful, more meaningful. You are the melody to my heart's song, the sunshine on my cloudy days, and my absolute favourite person in the entire world.
        </p>
        <p>
          Remember [Insert a sweet shared memory here]? Thinking back on moments like that always brings a smile to my face. Every memory we've created together is a treasure I hold dear.
        </p>
        <p>
          I admire so many things about you – your kindness, your strength, your laugh, the way you [mention a specific positive trait or habit]. You inspire me every single day.
        </p>
        <p>
          I hope today is filled with everything that brings you joy – laughter, love, cake (lots of cake!), and the company of those who cherish you. May this year ahead be your best one yet, full of adventures, success, and endless happiness.
        </p>
        <p>
          Know that I'm celebrating you today and every day. Thank you for being you.
        </p>
        <p>
          With all my love, always and forever,
        </p>
        <p className="text-right font-semibold">
          Your [Your Name/Nickname]
        </p>
      </CardContent>
    </Card>
  );
};

export default BirthdayLetter;
