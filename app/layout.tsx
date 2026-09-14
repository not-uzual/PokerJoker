import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import NavBar from "@/components/navbar";
import { GameProvider } from "@/components/contexts/gameContext";
import BackendHealthCheck from "@/components/backendHealthCheck";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Poker Joker",
  description: "Poker Game",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} antialiased`}
    >
      <body className="w-dvw h-dvh flex justify-center items-center overflow-hidden">
        <BackendHealthCheck />
        <NavBar/>
        <GameProvider>
          {children}
        </GameProvider>
      </body>
    </html>
  );
}
