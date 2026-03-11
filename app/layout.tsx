import type { Metadata } from "next";
import { ClerkProvider } from "@clerk/nextjs";
import "./globals.css";

export const metadata: Metadata = {
  title: "2025 Citizenship Test & New Civic Test Prep | CivicTest",
  description:
    "Master the new citizenship test with our 2025 Citizenship test simulator. Practice all 128 USCIS questions for the new civic test, including voice-based simulated interviews, flashcards, and complete study guides to pass your civic test exam.",
  keywords: "new citizenship test, 2025 Citizenship test, new civic test, civic test, USCIS naturalization interview, citizenship exam simulator",
  openGraph: {
    title: "2025 Citizenship Test & New Civic Test Simulator",
    description: "Prepare for your U.S. naturalization interview with our new citizenship test simulator.",
    type: "website",
    locale: "en_US",
  },
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <ClerkProvider>
      <html lang="en">
        <head>
          <link rel="preconnect" href="https://fonts.googleapis.com" />
          <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
          <link
            href="https://fonts.googleapis.com/css2?family=Playfair+Display:wght@700;900&family=Inter:wght@400;500;600;700&display=swap"
            rel="stylesheet"
          />
        </head>
        <body className="antialiased">
          {children}
        </body>
      </html>
    </ClerkProvider>
  );
}
