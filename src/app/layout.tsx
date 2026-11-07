import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Academic & Research Portfolio | Computer Science & AI",
  description: "Personal academic and research portfolio showcasing work in Robotics, Reinforcement Learning, Computer Vision, and Intelligent Systems.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <body className="bg-background text-primary-text antialiased selection:bg-accent selection:text-background min-h-screen flex flex-col">
        {children}
      </body>
    </html>
  );
}