
'use client';

import React, { useEffect, useRef } from 'react';
import Image from 'next/image';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { BookOpen, GraduationCap, Heart, Pencil, Calendar } from 'lucide-react'; // Import relevant icons

// Define the structure for a timeline event
interface TimelineEvent {
  id: number;
  date: string;
  title: string;
  description: string;
  icon?: React.ElementType; // Optional specific icon
  imageUrl?: string; // Optional image URL
}

interface VerticalTimelineProps {
  events: TimelineEvent[];
}

// Default icon mapping based on keywords
const getIconForEvent = (title: string): React.ElementType => {
  const lowerTitle = title.toLowerCase();
  if (lowerTitle.includes('met') || lowerTitle.includes('first')) return Heart;
  if (lowerTitle.includes('exam') || lowerTitle.includes('jee') || lowerTitle.includes('study')) return Pencil;
   if (lowerTitle.includes('school') || lowerTitle.includes('class')) return BookOpen;
   if (lowerTitle.includes('graduate') || lowerTitle.includes('result')) return GraduationCap;
  return Calendar; // Default icon
};

export const VerticalTimeline: React.FC<VerticalTimelineProps> = ({ events }) => {
    const timelineRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const observer = new IntersectionObserver(
        (entries) => {
            entries.forEach((entry) => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                // Optional: Unobserve after animation for performance,
                // but keep observing if you want re-animation on scroll up/down
                // observer.unobserve(entry.target);
            } else {
                 // Optional: Remove 'visible' if you want re-animation when scrolling out of view
                 // entry.target.classList.remove('visible');
            }
            });
        },
        {
            threshold: 0.2, // Trigger when 20% of the item is visible
            rootMargin: '0px 0px -10% 0px', // Trigger slightly before it enters the viewport bottom (adjust percentage as needed)
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
      <div className="absolute top-0 bottom-0 left-4 md:left-1/2 w-1 bg-gradient-to-b from-primary/20 via-primary/40 to-accent/30 rounded-full -translate-x-1/2 z-0"></div>

      {/* Timeline Items */}
      <div className="space-y-12">
        {events.map((event, index) => {
          const IconComponent = event.icon || getIconForEvent(event.title);
          const isOdd = index % 2 !== 0; // Use index for consistent odd/even placement

          return (
            <div
              key={event.id}
              className={`timeline-item relative flex items-start ${isOdd ? 'md:flex-row-reverse' : 'md:flex-row'}`}
            >
              {/* Icon Dot on the Line */}
              <div className={`absolute top-5 left-4 md:left-1/2 w-8 h-8 rounded-full bg-accent border-4 border-background flex items-center justify-center -translate-x-1/2 z-10 shadow-md`}>
                <IconComponent className="w-4 h-4 text-accent-foreground" />
              </div>

              {/* Content Card */}
              <div className={`w-full md:w-[calc(50%-2rem)] ${isOdd ? 'md:pl-0 md:pr-8' : 'md:pl-8 md:pr-0'} pl-12 md:pl-0`}>
                 <Card className={`w-full shadow-md border-secondary hover:border-primary transition-colors duration-300 ${isOdd ? 'md:text-right' : 'md:text-left'}`}>
                   <CardHeader className="pb-2">
                     <CardDescription className={`text-xs uppercase tracking-wider ${isOdd ? 'md:text-right' : 'md:text-left'} text-muted-foreground`}>{event.date}</CardDescription>
                     <CardTitle className={`text-xl font-semibold ${isOdd ? 'md:text-right' : 'md:text-left'} text-secondary-foreground`}>{event.title}</CardTitle>
                   </CardHeader>
                   <CardContent className={`${isOdd ? 'md:text-right' : 'md:text-left'}`}>
                     {event.imageUrl && (
                       <div className="relative w-full aspect-video mb-3 rounded-md overflow-hidden bg-muted">
                          <Image
                           src={event.imageUrl} // Use the actual image URL from data
                           alt={`${event.title} illustration`}
                           layout="fill"
                           objectFit="cover"
                           className="transition-transform duration-300 group-hover:scale-105"
                         />
                       </div>
                     )}
                     <p className="text-foreground/90">{event.description}</p>
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
