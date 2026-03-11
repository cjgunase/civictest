import { auth } from "@clerk/nextjs/server";
import LandingPage from "@/components/LandingPage";
import MainApp from "@/components/MainApp";

export default async function Home() {
  const { userId } = await auth();

  if (!userId) {
    return <LandingPage />;
  }

  return <MainApp />;
}
