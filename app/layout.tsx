import type { Metadata } from "next";
import { ClerkProvider, SignInButton, SignUpButton, UserButton } from "@clerk/nextjs";
import { auth } from "@clerk/nextjs/server";

import "./globals.css";

export const metadata: Metadata = {
  title: "CivicTest MVP",
  description: "Voice-first civics interview simulator MVP",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const { userId } = await auth();

  return (
    <ClerkProvider>
      <html lang="en">
        <body className="antialiased">
          <header className="border-b border-border bg-background px-4 py-3 sm:px-8">
            <div className="mx-auto flex w-full max-w-5xl items-center justify-between">
              <p className="text-sm font-semibold">CivicTest</p>
              <div className="flex items-center gap-3">
                {userId ? (
                  <UserButton />
                ) : (
                  <>
                    <SignInButton mode="modal">
                      <button className="inline-flex h-8 items-center rounded-lg border border-border px-3 text-xs">
                        Sign in
                      </button>
                    </SignInButton>
                    <SignUpButton mode="modal">
                      <button className="inline-flex h-8 items-center rounded-lg bg-primary px-3 text-xs text-primary-foreground">
                        Sign up
                      </button>
                    </SignUpButton>
                  </>
                )}
              </div>
            </div>
          </header>
          {children}
        </body>
      </html>
    </ClerkProvider>
  );
}
