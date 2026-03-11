import { SignInButton, SignUpButton } from "@clerk/nextjs";
import { auth } from "@clerk/nextjs/server";

import { MvpInterview } from "@/components/civics/mvp-interview";

export default async function Home() {
  const { userId } = await auth();

  return (
    <main className="min-h-screen bg-background px-4 py-10 sm:px-8">
      {!userId ? (
        <section className="mx-auto flex w-full max-w-3xl flex-col gap-6 rounded-xl border border-border bg-card p-6 sm:p-10">
          <h1 className="text-3xl font-semibold">CivicTest MVP</h1>
          <p className="text-sm text-muted-foreground">
            Practice a 2025-style civics interview with deterministic grading and official stop rules.
          </p>
          <div className="flex flex-wrap gap-3">
            <SignInButton mode="modal">
              <button className="inline-flex h-9 items-center rounded-lg bg-primary px-4 text-sm font-medium text-primary-foreground">
                Sign in
              </button>
            </SignInButton>
            <SignUpButton mode="modal">
              <button className="inline-flex h-9 items-center rounded-lg border border-border px-4 text-sm font-medium">
                Sign up
              </button>
            </SignUpButton>
          </div>
        </section>
      ) : (
        <MvpInterview />
      )}
    </main>
  );
}
