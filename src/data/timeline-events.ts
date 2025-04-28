
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

// Updated Imgur links based on user request
// Image 3 is a placeholder
const imgurLinks = [
    "https://i.imgur.com/nX5MPO4.jpeg", // 1. First Encounter
    "https://i.imgur.com/4QJIaV3.jpeg", // 2. Confession
    placeholderImageUrl("whispers", 400, 225), // 3. Placeholder for Whispers & Cafe Dreams
    "https://i.imgur.com/HrPjQyS.png", // 4. Study Buddies
    "https://i.imgur.com/WicaBr7.jpeg", // 5. You and Me to Us (Originally index 5 / Image 6) - Now at index 4
    "https://i.imgur.com/WPiDZhs.jpeg", // 6. Pouch Exchange (Originally index 4 / Image 5) - Now at index 5
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
    imageUrl: imgurLinks[2], // Using placeholder for #3
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
    id: 5, // ID 5: "You and me to Us" card
    date: 'Gradually...',
    title: 'From You and Me to Us ❤️',
    description: 'The journey wasn\'t instant, but every shared moment, every laugh, every hurdle overcome, brought us closer, transforming "you" and "me" into "us".',
    icon: Users, // Icon representing partnership/togetherness
    imageUrl: imgurLinks[4], // Use the image originally intended for #6 (index 4)
   },
   {
    id: 6, // ID 6: "Pouch Exchange" card
    date: 'Around the Same Time',
    title: 'The Pouch Exchange ✨',
    description: 'A small but significant exchange that holds a special place in our story.',
    icon: Gift,
    imageUrl: imgurLinks[5], // Use the image originally intended for #5 (index 5)
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
