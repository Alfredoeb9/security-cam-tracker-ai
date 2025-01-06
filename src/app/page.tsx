import Link from "next/link";
import { api, HydrateClient } from "@/trpc/server";
import { auth } from "@/server/auth";

// import { LatestPost } from "@/app/_components/post";

import { LatestPost } from "./_components/Post";
import Webcam from "./_components/Webcam";
import CanvasLayout from "./_components/CanvasLayout";
import SidePanel from "./_components/SidePanel";
import Dashboard from "./_components/Dashboard";
import CocoModel from "./_components/CocoModel";

export default async function Home() {
  const hello = await api.post.hello({ text: "from tRPC" });
  const session = await auth();

  if (session?.user) {
    void api.post.getLatest.prefetch();
  }

  return (
    <HydrateClient>
      <main className="flex min-h-screen">
        <div className="relative flex flex-col w-full">
          <div className="relative h-screen w-full flex flex-row">
            <Dashboard />
            <CocoModel />
          </div>
        </div>

        {/* <SidePanel /> */}
        {/* <div className="container flex flex-col items-center justify-center gap-12 px-4 py-16">
          <h1 className="text-5xl font-extrabold tracking-tight sm:text-[5rem]">
            Initial Set-Up
          </h1>
          <div className="flex flex-col items-center gap-2">
            <p className="text-2xl text-white">
              {hello ? hello.greeting : "Loading tRPC query..."}
            </p>

            <div className="flex flex-col items-center justify-center gap-4">
              <p className="text-center text-2xl text-white">
                {session && <span>Logged in as {session.user?.name}</span>}
              </p>
              <Link
                href={session ? "/api/auth/signout" : "/api/auth/signin"}
                className="rounded-full bg-white/10 px-10 py-3 font-semibold no-underline transition hover:bg-white/20"
              >
                {session ? "Sign out" : "Sign in"}
              </Link>
            </div>
          </div>

          {session?.user && <LatestPost />}
          {session?.user && <Webcam />}
        </div> */}
      </main>
    </HydrateClient>
  );
}
