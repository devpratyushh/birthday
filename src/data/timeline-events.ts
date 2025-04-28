
import { Heart, MessageSquare, Sparkles, Pencil, Gift, Users, Cake, LucideProps, Flower2 } from 'lucide-react'; // Added Users, Cake, Flower2

// Define the structure for a timeline event
export interface TimelineEvent {
  id: number;
  date: string; // Keep as string for display flexibility
  title: string;
  description: string;
  icon?: React.ElementType<LucideProps>; // Optional specific icon
  imageUrl?: string; // Optional image URL
}

// Placeholder image base URL - using picsum.photos for variety if needed
const placeholderImageUrl = (seed: number | string, width = 400, height = 225) =>
  `https://picsum.photos/seed/${seed}/${width}/${height}`;

// Correct Direct Imgur links (extracted from previous history / assumed from albums)
const imgurLinks = [
    "https://i.imgur.com/pL3JRJy.jpeg", // Album 1: First Encounter
    "https://i.imgur.com/o8gR9r5.jpeg", // Album 2: Confession
    "https://i.imgur.com/FkUjH7s.jpeg", // Album 3: Whispers & Cafe Dreams
    "https://i.imgur.com/L1m0k5o.jpeg", // Album 4: Study Buddies
    "https://i.imgur.com/rAnDOmN.jpeg", // Album 5: Pouch Exchange
    "https://i.imgur.com/9mEzAqY.jpeg", // Album 6: You and Me to Us
];

export const timelineEvents: TimelineEvent[] = [
  {
    id: 1,
    date: 'Somewhere in 2022',
    title: 'First Encounter 👀',
    description: 'The day our paths crossed unexpectedly at the sarkari school. A simple "ye aage kyu hai?" started it all.',
    icon: Heart,
    imageUrl: imgurLinks[0],
  },
   {
    id: 2,
    date: 'A Few Days Later',
    title: 'The Confession & Late Night Talks 💬',
    description: 'Took a leap of faith (maybe too soon!) but it led to hours of conversation, even if the "proposal" flopped.',
    icon: MessageSquare,
    imageUrl: imgurLinks[1],
  },
  {
    id: 3,
    date: 'High School Days',
    title: 'Whispers & Cafe Dreams ☕',
    description: 'From shy "Btw Hi" whispers to "cafe hai kya?" moments, building memories one interaction at a time.',
    icon: Sparkles,
    imageUrl: imgurLinks[2],
  },
  {
    id: 4,
    date: 'Exam Season',
    title: 'Study Buddies & Chocolate Breaks 🍫',
    description: 'Stressing about exams but finding joy in shared chocolates and study sessions (like ITF & English Lit!).',
    icon: Pencil,
    imageUrl: imgurLinks[3],
  },
   {
    id: 5, // Renumbered ID - This becomes "You and me to Us"
    date: 'Gradually...',
    title: 'From You and Me to Us ❤️',
    description: 'The journey wasn\'t instant, but every shared moment, every laugh, every hurdle overcome, brought us closer, transforming "you" and "me" into "us".',
    icon: Users, // Icon representing partnership/togetherness
    imageUrl: imgurLinks[5], // Use the 6th image (index 5) for this new card
   },
   {
    id: 6, // Renumbered ID - This becomes "Pouch Exchange"
    date: 'Around the Same Time',
    title: 'The Pouch Exchange ✨',
    description: 'A small but significant exchange that holds a special place in our story.',
    icon: Gift,
    imageUrl: imgurLinks[4], // Use the 5th image (index 4) for this card
  },
   {
    id: 7,
    date: 'April 30th, 2025',
    title: 'Happy Birthday! 🎂',
    description: 'Celebrating you today! Welcome to adulting, may your year be filled with joy, love, and success. ',
    icon: Cake, // Using Cake icon
    imageUrl: placeholderImageUrl("birthdaycake", 400, 225), // Placeholder for a cake image
  },
   {
    id: 8,
    date: 'The Future...',
    title: 'Our Life Together Continues 💖',
    description: 'Looking forward to countless more memories, adventures, nok-jhok, and celebrating life side-by-side, holding hands forever.',
    icon: Flower2, // Using Flower2 icon for future/growth
    imageUrl: placeholderImageUrl("futurelove", 400, 225), // Keep placeholder or update later
  },
];
