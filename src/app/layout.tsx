import type { Metadata } from "next";
import { Geist } from "next/font/google";
import type { NextFont } from "next/dist/compiled/@next/font";
import "./globals.css";
import { Toaster } from "@/components/ui/toaster";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Happy Birthday!",
  description: "Happiest birthday to my cutest and the sweetest Ananditaaa",
  icons: {
    icon: "https://i.imgur.com/cRIQIm4.png",
    apple: "/apple-touch-icon.png",
    
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className={`${geistSans.variable} font-sans`}>
        {children}      
        <Toaster />
      </body>
    </html>
  );
}
