import { createTRPCRouter, createCallerFactory } from "@/server/api/trpc";
import { postRouter } from "./routers/post";

/**
 * This is the primary router for you server
 *
 * All routers added in /api/routers should be manually added here
 */

export const appRouter = createTRPCRouter({
  post: postRouter,
});

// export type definition of API
export type AppRouter = typeof appRouter;

/**
 * Create a server-side caller for the tRPC API.
 * @example
 * const trpc = createCaller(createContext);
 * const res = await trpc.post.all();
 *       ^? Post[]
 */
export const createCaller = createCallerFactory(appRouter);
