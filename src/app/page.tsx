import { api, HydrateClient } from "@/trpc/server";
import { auth } from "@/server/auth";
import Dashboard from "./_components/Dashboard";

export default async function Home() {
  // const hello = await api.post.hello({ text: "from tRPC" });
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
          </div>
        </div>
      </main>
    </HydrateClient>
  );
}
