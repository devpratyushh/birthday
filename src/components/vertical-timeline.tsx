"use client";

import React, { useEffect, useRef } from 'react';
import Image from 'next/image';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { cn } from '@/lib/utils';
import { BookOpen, GraduationCap, Pencil, Heart, Gift, Handshake, MessageSquare, Clock, Package } from 'lucide-react'; // Added Package for pouch exchange

interface TimelineEvent {
  date: string;
  title: string;
  description: string;
  icon?: React.ReactNode;
  imageUrl?: string;
}

interface VerticalTimelineProps {
  events: TimelineEvent[];
}

// Icon mapping (refined)
const getIcon = (title: string) => {
  const lowerTitle = title.toLowerCase();
  if (lowerTitle.includes('encounter') || lowerTitle.includes('met') || lowerTitle.includes('school')) return <Handshake className="w-5 h-5 text-primary" />;
  if (lowerTitle.includes('confession') || lowerTitle.includes('love') || lowerTitle.includes('pookie') || lowerTitle.includes('heart') || lowerTitle.includes('romance')) return <Heart className="w-5 h-5 text-primary" />;
  if (lowerTitle.includes('conversation') || lowerTitle.includes('talks') || lowerTitle.includes('chats') || lowerTitle.includes('whispering') || lowerTitle.includes('btw hi')) return <MessageSquare className="w-5 h-5 text-primary" />;
  if (lowerTitle.includes('exam') || lowerTitle.includes('aspirant') || lowerTitle.includes('jee') || lowerTitle.includes('pencil')) return <Pencil className="w-5 h-5 text-primary" />;
  if (lowerTitle.includes('study') || lowerTitle.includes('itf') || lowerTitle.includes('lit')) return <BookOpen className="w-5 h-5 text-primary" />;
  if (lowerTitle.includes('pouch') || lowerTitle.includes('exchange') || lowerTitle.includes('chocolates') || lowerTitle.includes('cafe')) return <Package className="w-5 h-5 text-primary" />;
  if (lowerTitle.includes('us') || lowerTitle.includes('together') || lowerTitle.includes('journey') || lowerTitle.includes('hand')) return <Heart className="w-5 h-5 text-primary" />;
  if (lowerTitle.includes('birthday') || lowerTitle.includes('bday')) return <Gift className="w-5 h-5 text-primary" />;
  if (lowerTitle.includes('adulting') || lowerTitle.includes('graduation') || lowerTitle.includes('future')) return <GraduationCap className="w-5 h-5 text-primary" />;
  if (lowerTitle.includes('now') || lowerTitle.includes('day') || lowerTitle.includes('date')) return <Clock className="w-5 h-5 text-primary" />;
  return <Heart className="w-5 h-5 text-primary" />; // Default icon
};

const PlaceholderImage = ({ title }: { title: string }) => (
  <div className="w-full aspect-video bg-secondary rounded-md flex items-center justify-center text-muted-foreground text-center p-4">
    <p className="text-xs">Image: {title}</p>
  </div>
);

export const VerticalTimeline: React.FC<VerticalTimelineProps> = ({ events }) => {
  const timelineRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('visible');
            // Optional: Unobserve after animation to save resources
            // observer.unobserve(entry.target);
          } else {
             // Optional: Remove class if you want animation to replay on scroll up
             // entry.target.classList.remove('visible');
          }
        });
      },
      {
        threshold: 0.1, // Trigger when 10% of the item is visible
        rootMargin: '0px 0px -50px 0px' // Trigger animation slightly before it's fully in view
      }
    );

    const items = timelineRef.current?.querySelectorAll('.timeline-item');
    if (items) {
      items.forEach((item) => observer.observe(item));
    }

    return () => {
      if (items) {
        items.forEach((item) => observer.unobserve(item));
      }
    };
  }, [events]); // Rerun effect if events change

  return (
    <div ref={timelineRef} className="vertical-timeline">
      {events.map((event, index) => (
        <div key={index} className="timeline-item">
           {/* Icon on the center line */}
           <div className="timeline-icon" title={event.title}>
               {getIcon(event.title)}
           </div>

          {/* Card content */}
          <Card className="timeline-card shadow-lg hover:shadow-xl transition-shadow duration-300 bg-card/90 backdrop-blur-sm border-primary/50 flex flex-col">
            <CardHeader className="pb-3">
              <CardTitle className="text-lg md:text-xl font-semibold text-foreground">{event.title}</CardTitle>
              <CardDescription className="text-xs font-semibold text-primary uppercase tracking-wider pt-1">{event.date}</CardDescription>
            </CardHeader>
            <CardContent className="flex-grow flex flex-col p-4 pt-0">
              {event.imageUrl ? (
                 <div className="relative w-full aspect-video mb-3 rounded-md overflow-hidden">
                  <Image
                    src={event.imageUrl}
                    alt={event.title}
                    fill // Use fill layout
                    sizes="(max-width: 768px) 100vw, 350px" // Responsive sizes
                    style={{ objectFit: 'cover' }} // Ensure image covers the area
                    className="transition-transform duration-300 group-hover:scale-105"
                    placeholder="blur"
                    blurDataURL="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mP8z8BQDwAEhQGAhKmMIQAAAABJRU5ErkJggg==" // Simple blur placeholder
                    onError={(e) => {
                      // console.error("Failed to load image:", event.imageUrl);
                      const target = e.target as HTMLImageElement;
                      target.style.display = 'none'; // Hide broken image
                      const parent = target.parentElement;
                      if (parent) {
                        parent.classList.add('bg-secondary', 'flex', 'items-center', 'justify-center');
                        const placeholderText = document.createElement('p');
                        placeholderText.className = 'text-xs text-muted-foreground';
                        placeholderText.textContent = `Image: ${event.title}`;
                        parent.appendChild(placeholderText);
                      }
                    }}
                  />
                 </div>
              ) : (
                <PlaceholderImage title={event.title} />
              )}
              <p className="text-sm text-muted-foreground mt-auto flex-grow">{event.description}</p>
            </CardContent>
          </Card>
        </div>
      ))}
    </div>
  );
};
