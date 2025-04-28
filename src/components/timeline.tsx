"use client";

import React, { useRef, useEffect, useState } from 'react';
import Image from 'next/image';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { cn } from '@/lib/utils';
import { BookOpen, GraduationCap, Pencil, Heart } from 'lucide-react'; // Example icons

interface TimelineEvent {
  date: string;
  title: string;
  description: string;
  icon?: React.ReactNode;
  imageUrl?: string; // Optional: Image URL for placeholder
}

interface TimelineProps {
  events: TimelineEvent[];
}

const PlaceholderImage = ({ title }: { title: string }) => (
  <div className="w-full aspect-video bg-secondary rounded-md flex items-center justify-center text-muted-foreground text-center p-4">
    <p>Image for "{title}"</p>
  </div>
);

const getIcon = (title: string) => {
  if (title.toLowerCase().includes('met')) return <Heart className="w-5 h-5 text-primary" />;
  if (title.toLowerCase().includes('exam') || title.toLowerCase().includes('aspirant') || title.toLowerCase().includes('jee')) return <Pencil className="w-5 h-5 text-primary" />;
  if (title.toLowerCase().includes('school') || title.toLowerCase().includes('study') || title.toLowerCase().includes('itf') ) return <BookOpen className="w-5 h-5 text-primary" />;
  if (title.toLowerCase().includes('confession') || title.toLowerCase().includes('love')) return <Heart className="w-5 h-5 text-primary" />;
   if (title.toLowerCase().includes('graduation') || title.toLowerCase().includes('future')) return <GraduationCap className="w-5 h-5 text-primary" />;
  return <Heart className="w-5 h-5 text-primary" />; // Default icon
};


export const Timeline: React.FC<TimelineProps> = ({ events }) => {
  const refs = useRef<(HTMLDivElement | null)[]>([]);
  const [visibleEvents, setVisibleEvents] = useState<boolean[]>([]);

  useEffect(() => {
    setVisibleEvents(Array(events.length).fill(false)); // Initialize all as not visible

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const index = refs.current.findIndex((ref) => ref === entry.target);
            if (index !== -1) {
              setVisibleEvents((prev) => {
                const newState = [...prev];
                newState[index] = true;
                return newState;
              });
              observer.unobserve(entry.target); // Stop observing once visible
            }
          }
        });
      },
      { threshold: 0.1 } // Trigger when 10% of the item is visible
    );

    refs.current.forEach((ref) => {
      if (ref) {
        observer.observe(ref);
      }
    });

    return () => {
      refs.current.forEach((ref) => {
        if (ref) {
          observer.unobserve(ref);
        }
      });
    };
  }, [events.length]);


  return (
    <div className="relative w-full max-w-3xl mx-auto py-12 px-4">
      {/* Central line */}
      <div className="absolute left-1/2 top-0 bottom-0 w-1 bg-primary/30 transform -translate-x-1/2 rounded-full" aria-hidden="true"></div>

      {events.map((event, index) => (
        <div
          key={index}
          ref={(el) => (refs.current[index] = el)}
          className={cn(
            "mb-12 flex items-center w-full transition-all duration-1000 ease-out",
            index % 2 === 0 ? 'justify-start' : 'justify-end',
            visibleEvents[index] ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
          )}
        >
          <div className={cn("w-1/2", index % 2 === 0 ? 'pr-8' : 'pl-8')}>
             <Card className="shadow-lg hover:shadow-xl transition-shadow duration-300 bg-background/90 backdrop-blur-sm border-primary/50">
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between mb-1">
                   <CardDescription className="text-xs font-semibold text-primary uppercase tracking-wider">{event.date}</CardDescription>
                   <div className="absolute top-1/2 -translate-y-1/2 bg-background p-2 rounded-full border-2 border-primary shadow-md z-10"
                        style={index % 2 === 0 ? { right: '-1.25rem' } : { left: '-1.25rem' }}>
                     {event.icon || getIcon(event.title)}
                   </div>
                </div>
                <CardTitle className="text-xl font-semibold text-foreground">{event.title}</CardTitle>
              </CardHeader>
              <CardContent>
                 {event.imageUrl ? (
                   <Image
                     src={event.imageUrl}
                     alt={event.title}
                     width={400}
                     height={225}
                     className="rounded-md mb-3 object-cover w-full aspect-video"
                   />
                 ) : (
                    <PlaceholderImage title={event.title} />
                 )}
                <p className="text-sm text-muted-foreground mt-2">{event.description}</p>
              </CardContent>
            </Card>
          </div>
        </div>
      ))}
    </div>
  );
};
