
import { BookOpen, GraduationCap, Heart, Pencil, Calendar, Sparkles, MessageSquare, Gift } from 'lucide-react';

// Define the structure for a timeline event
export interface TimelineEvent {
  id: number;
  date: string; // Keep as string for display flexibility
  title: string;
  description: string;
  icon?: React.ElementType; // Optional specific icon
  imageUrl?: string; // Optional image URL
}

// Placeholder image base URL - using picsum.photos for variety
const placeholderImageUrl = (seed: number, width = 400, height = 225) =>
  `https://picsum.photos/seed/${seed}/${width}/${height}`;

export const timelineEvents: TimelineEvent[] = [
  {
    id: 1,
    date: 'Somewhere in 2022',
    title: 'First Encounter 👀',
    description: 'The day our paths crossed unexpectedly at the sarkari school. A simple "ye aage kyu hai?" started it all.',
    icon: Heart,
    imageUrl: placeholderImageUrl(101), // Changed seed
  },
   {
    id: 2,
    date: 'A Few Days Later',
    title: 'The Confession & Late Night Talks 💬',
    description: 'Took a leap of faith (maybe too soon!) but it led to hours of conversation, even if the "proposal" flopped.',
    icon: MessageSquare,
    imageUrl: placeholderImageUrl(102), // Changed seed
  },
  {
    id: 3,
    date: 'High School Days',
    title: 'Whispers & Cafe Dreams ☕',
    description: 'From shy "Btw Hi" whispers to "cafe hai kya?" moments, building memories one interaction at a time.',
    icon: Sparkles, // Using Sparkles for magical/special moments
    imageUrl: placeholderImageUrl(103), // Changed seed
  },
  {
    id: 4,
    date: 'Exam Season',
    title: 'Study Buddies & Chocolate Breaks 🍫',
    description: 'Stressing about exams but finding joy in shared chocolates and study sessions (like ITF & English Lit!).',
    icon: Pencil,
    imageUrl: placeholderImageUrl(104), // Changed seed
  },
   {
    id: 5,
    date: 'Around the Same Time',
    title: 'The Pouch Exchange ✨',
    description: 'A small but significant exchange that holds a special place in our story.',
    icon: Gift, // Using Gift for exchange/special item
    imageUrl: placeholderImageUrl(105), // Changed seed
  },
  {
    id: 6,
    date: 'Present Day',
    title: 'JEE Aspirant Journey 📚',
    description: 'Navigating the challenges and dreams of being a JEE aspirant, supporting each other along the way.',
    icon: BookOpen,
    imageUrl: placeholderImageUrl(106), // Changed seed
  },
   {
    id: 7,
    date: 'April 30th, 2025',
    title: 'Happy Birthday! 🎉',
    description: 'Celebrating you today! Welcome to adulting, may your year be filled with joy and success. ',
    icon: GraduationCap, // Could also be a Gift or Cake icon if available
    imageUrl: placeholderImageUrl(107), // Changed seed
  },
   {
    id: 8,
    date: 'The Future...',
    title: 'Our Life Together ❤️',
    description: 'Looking forward to countless more memories, adventures, nok-jhok, and celebrating life side-by-side.',
    icon: Heart,
    imageUrl: placeholderImageUrl(108), // Changed seed
  },
];
