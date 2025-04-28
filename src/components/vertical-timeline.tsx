
'use client';

import React, { useEffect, useRef } from 'react';
import Image from 'next/image';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { BookOpen, GraduationCap, Heart, Pencil, Calendar, Cake, Users, MessageSquare, Sparkles, Gift, Flower2 } from 'lucide-react'; // Import relevant icons, added Flower2 explicitly
import type { TimelineEvent } from '@/data/timeline-events'; // Import type

interface VerticalTimelineProps {
  events: TimelineEvent[];
}

// Default icon mapping based on keywords - Ensure all imported icons are handled or have fallbacks
const getIconForEvent = (title: string): React.ElementType => {
  const lowerTitle = title.toLowerCase();
  if (lowerTitle.includes('met') || lowerTitle.includes('first encounter')) return Heart;
  if (lowerTitle.includes('confession') || lowerTitle.includes('talks')) return MessageSquare;
  if (lowerTitle.includes('whispers') || lowerTitle.includes('dreams')) return Sparkles;
  if (lowerTitle.includes('exam') || lowerTitle.includes('study')) return Pencil;
  if (lowerTitle.includes('pouch') || lowerTitle.includes('exchange') || lowerTitle.includes('gift')) return Gift;
  if (lowerTitle.includes('us') || lowerTitle.includes('together')) return Users;
  if (lowerTitle.includes('birthday') || lowerTitle.includes('cake')) return Cake;
  if (lowerTitle.includes('school') || lowerTitle.includes('class')) return BookOpen;
  if (lowerTitle.includes('graduate') || lowerTitle.includes('result')) return GraduationCap;
  if (lowerTitle.includes('future') || lowerTitle.includes('continues')) return Flower2; // Added mapping for Flower2
  return Calendar; // Default icon
};

// Helper function for placeholder
const placeholderImageUrl = (seed: string, width = 400, height = 225) =>
  `https://picsum.photos/seed/${seed}/${width}/${height}`;


export const VerticalTimeline: React.FC<VerticalTimelineProps> = ({ events }) => {
    const timelineRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const observer = new IntersectionObserver(
        (entries) => {
            entries.forEach((entry) => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                // Optional: Unobserve after animation for performance
                 observer.unobserve(entry.target);
            } else {
                 // Optional: Remove 'visible' if you want re-animation when scrolling out of view
                 // entry.target.classList.remove('visible');
            }
            });
        },
        {
            threshold: 0.15, // Trigger when 15% of the item is visible
            rootMargin: '0px 0px -5% 0px', // Trigger slightly before it enters the viewport bottom
        }
        );

        const items = timelineRef.current?.querySelectorAll('.timeline-item');
        items?.forEach((item) => observer.observe(item));

        // Cleanup function
        return () => {
            items?.forEach((item) => {
              if (item) { // Check if item exists before unobserving
                observer.unobserve(item);
              }
            });
        };
    }, [events]); // Re-run if events change


  return (
    <div ref={timelineRef} className="relative w-full max-w-3xl mx-auto pl-4 md:pl-0">
      {/* Central Line */}
      <div className="absolute top-0 bottom-0 left-4 md:left-1/2 w-1 bg-gradient-to-b from-primary/30 via-primary/50 to-accent/40 rounded-full -translate-x-1/2 z-0"></div>

      {/* Timeline Items */}
      <div className="space-y-12">
        {events.map((event, index) => {
          const IconComponent = event.icon || getIconForEvent(event.title);
          const isOdd = index % 2 !== 0; // Use index for consistent odd/even placement

          return (
            <div
              key={event.id}
              className={`timeline-item group relative flex items-start ${isOdd ? 'md:flex-row-reverse' : 'md:flex-row'}`} // Added group class
            >
              {/* Icon Dot on the Line */}
              <div className={`absolute top-5 left-4 md:left-1/2 w-8 h-8 rounded-full bg-accent border-4 border-background flex items-center justify-center -translate-x-1/2 z-10 shadow-md transition-transform duration-300 group-hover:scale-110`}>
                <IconComponent className="w-4 h-4 text-accent-foreground" />
              </div>

              {/* Decorative Hearts */}
               <Heart className={`absolute w-3 h-3 text-primary/30 animate-float ${isOdd ? 'top-2 -right-2 md:-left-6' : 'top-2 -left-2 md:-right-6'} opacity-0 group-[.visible]:opacity-100 transition-opacity duration-1000 delay-500`} style={{ animationDuration: '14s', animationDelay: `${0.1 + index * 0.1}s` }} fill="currentColor" />
               <Heart className={`absolute w-4 h-4 text-accent/40 animate-twinkle ${isOdd ? 'bottom-4 -right-4 md:left-[-4rem]' : 'bottom-4 -left-4 md:right-[-4rem]'} opacity-0 group-[.visible]:opacity-100 transition-opacity duration-1000 delay-700`} style={{ animationDuration: '8s', animationDelay: `${0.3 + index * 0.1}s` }} fill="currentColor" />
               <Flower2 className={`absolute w-3 h-3 text-secondary/30 animate-float ${isOdd ? 'top-1/3 -right-5 md:left-[-3rem]' : 'top-1/3 -left-5 md:right-[-3rem]'} opacity-0 group-[.visible]:opacity-100 transition-opacity duration-1000 delay-600`} style={{ animationDuration: '16s', animationDelay: `${0.2 + index * 0.15}s` }} fill="currentColor" />


              {/* Content Card */}
              <div className={`w-full md:w-[calc(50%-2rem)] ${isOdd ? 'md:pl-0 md:pr-8' : 'md:pl-8 md:pr-0'} pl-12 md:pl-0`}>
                 <Card className={`w-full shadow-lg hover:shadow-xl border-secondary/50 hover:border-primary/70 transition-all duration-300 rounded-lg overflow-hidden ${isOdd ? 'md:text-right' : 'md:text-left'}`}>
                   <CardHeader className="pb-2">
                     <CardDescription className={`text-xs uppercase tracking-wider ${isOdd ? 'md:text-right' : 'md:text-left'} text-muted-foreground`}>{event.date}</CardDescription>
                     <CardTitle className={`text-xl font-semibold ${isOdd ? 'md:text-right' : 'md:text-left'} text-card-foreground`}>{event.title}</CardTitle>
                   </CardHeader>
                   <CardContent className={`${isOdd ? 'md:text-right' : 'md:text-left'}`}>
                     {event.imageUrl && (
                       <div className="relative w-full aspect-[16/10] mb-3 rounded-md overflow-hidden bg-muted shadow-inner">
                          <Image
                           src={event.imageUrl} // Use the actual image URL from data
                           alt={event.title || 'Timeline event image'} // Add default alt text
                           layout="fill"
                           objectFit="cover"
                           className="transition-transform duration-500 ease-out group-hover:scale-105" // Slower, smoother scale
                           // Add error handling / placeholder
                            onError={(e) => { (e.target as HTMLImageElement).src = placeholderImageUrl(event.id.toString(), 400, 225); }} // Use placeholder function on error
                           unoptimized={event.imageUrl.startsWith('https://i.imgur.com')} // Consider unoptimized for Imgur if needed
                         />
                       </div>
                     )}
                     <p className="text-foreground/80">{event.description}</p> {/* Slightly lighter text */}
                   </CardContent>
                 </Card>
               </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
