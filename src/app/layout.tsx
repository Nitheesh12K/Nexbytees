import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "NEXBYTEES | The Future of Technology, Explained",
  description:
    "NEXBYTEES is an elite technology intelligence platform covering artificial intelligence, quantum computing, humanoid robotics, deep silicon, and frontier tech breakthroughs.",
  keywords: [
    "technology news",
    "artificial intelligence",
    "humanoid robots",
    "semiconductors",
    "quantum computing",
    "AI agents",
    "emerging tech",
  ],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark scroll-smooth">
      <head>
        <link rel="icon" href="/favicon.ico" />
      </head>
      <body className="bg-[#030712] text-slate-100 min-h-screen antialiased selection:bg-sky-400 selection:text-slate-950">
        {children}
      </body>
    </html>
  );
}
