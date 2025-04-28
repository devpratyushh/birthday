
import { Heart, MessageSquare, Sparkles, Pencil, Gift, Users, Cake, LucideProps } from 'lucide-react'; // Added Users, Cake

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

// Direct Imgur links based on provided albums
const imgurLinks = [
    "https://i.imgur.com/pL3JRJy.jpeg", // First Encounter
    "https://i.imgur.com/o8gR9r5.jpeg", // Confession
    "https://i.imgur.com/FkUjH7s.jpeg", // Whispers & Cafe Dreams
    "https://i.imgur.com/L1m0k5o.jpeg", // Study Buddies
    "https://i.imgur.com/rAnDOmN.jpeg", // Pouch Exchange (Assuming link 5 was this one)
    "https://i.imgur.com/9mEzAqY.jpeg", // You and Me to Us (Using link 6 image)
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
    id: 5,
    date: 'Around the Same Time',
    title: 'The Pouch Exchange ✨',
    description: 'A small but significant exchange that holds a special place in our story.',
    icon: Gift,
    imageUrl: imgurLinks[4],
  },
   {
    id: 6, // New Card ID
    date: 'Gradually...',
    title: 'From You and Me to Us ❤️',
    description: 'The journey wasn\'t instant, but every shared moment, every laugh, every hurdle overcome, brought us closer, transforming "you" and "me" into "us".',
    icon: Users, // Icon representing partnership/togetherness
    imageUrl: imgurLinks[5], // Use the 6th image for this new card
   },
   {
    id: 7, // Renumbered ID
    date: 'April 30th, 2025',
    title: 'Happy Birthday! 🎂',
    description: 'Celebrating you today! Welcome to adulting, may your year be filled with joy, love, and success. ',
    icon: Cake, // Using Cake icon
    imageUrl: placeholderImageUrl("birthdaycake", 400, 225), // Placeholder for a cake image
  },
   {
    id: 8, // Renumbered ID
    date: 'The Future...',
    title: 'Our Life Together Continues 💖',
    description: 'Looking forward to countless more memories, adventures, nok-jhok, and celebrating life side-by-side, holding hands forever.',
    icon: Heart,
    imageUrl: placeholderImageUrl("futurelove", 400, 225), // Keep placeholder or update later
  },
];
