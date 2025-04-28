
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

// Placeholder image base URL - using picsum.photos for variety
const placeholderImageUrl = (seed: number | string, width = 400, height = 225) =>
  `https://picsum.photos/seed/${seed}/${width}/${height}`;


// Define specific image URLs directly in the events array now
export const timelineEvents: TimelineEvent[] = [
  {
    id: 1,
    date: 'Somewhere in 2022',
    title: 'First Encounter 👀',
    description: 'The day our paths crossed unexpectedly at the sarkari school. A simple "ye aage kyu hai?" started it all.',
    icon: Heart,
    imageUrl: "https://i.imgur.com/nX5MPO4.jpeg",
  },
   {
    id: 2,
    date: 'A Few Days Later',
    title: 'The Confession & Late Night Talks 💬',
    description: 'Took a leap of faith (maybe too soon!) but it led to hours of conversation, even if the "proposal" flopped.',
    icon: MessageSquare,
    imageUrl: "https://i.imgur.com/4QJIaV3.jpeg",
  },
  {
    id: 3,
    date: 'High School Days',
    title: 'Whispers & Cafe Dreams ☕',
    description: 'From shy "Btw Hi" whispers to "cafe hai kya?" moments, building memories one interaction at a time.',
    icon: Sparkles,
    imageUrl: placeholderImageUrl("whispers", 400, 225), // Placeholder for #3 - Update later if available
  },
  {
    id: 4,
    date: 'Exam Season',
    title: 'Study Buddies & Chocolate Breaks 🍫',
    description: 'Stressing about exams but finding joy in shared chocolates and study sessions (like ITF & English Lit!).',
    icon: Pencil,
    imageUrl: "https://i.imgur.com/HrPjQyS.png",
  },
   {
    id: 5, // ID 5: "From You and Me to Us" card - Now uses the image previously for #6
    date: 'Gradually...',
    title: 'From You and Me to Us ❤️',
    description: 'The journey wasn\'t instant, but every shared moment, every laugh, every hurdle overcome, brought us closer, transforming "you" and "me" into "us".',
    icon: Users, // Icon representing partnership/togetherness
    imageUrl: "https://i.imgur.com/WPiDZhs.jpeg", // Image swapped from #6
   },
   {
    id: 6, // ID 6: "Pouch Exchange" card - Now uses the image previously for #5
    date: 'Around the Same Time',
    title: 'The Pouch Exchange ✨',
    description: 'A small but significant exchange that holds a special place in our story.',
    icon: Gift,
    imageUrl: "https://i.imgur.com/WicaBr7.jpeg", // Image swapped from #5 (corrected URL)
  },
   {
    id: 7,
    date: 'April 30th, 2025',
    title: 'Happy Birthday! 🎂',
    description: 'Celebrating you today! Welcome to adulting, may your year be filled with joy, love, and success. ',
    icon: Cake, // Using Cake icon
    imageUrl: placeholderImageUrl("birthdaycake", 400, 225), // Added placeholder cake image
  },
   {
    id: 8,
    date: 'The Future...',
    title: 'Our Life Together Continues 💖',
    description: 'Looking forward to countless more memories, adventures, nok-jhok, and celebrating life side-by-side, holding hands forever.',
    icon: Flower2, // Using Flower2 icon for future/growth
    imageUrl: "https://i.imgur.com/9XybKcE.png", // Updated image for the last card
  },
];
