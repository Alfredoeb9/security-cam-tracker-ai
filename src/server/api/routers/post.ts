import { publicProcedure } from "@/server/api/trpc";
import { createTRPCRouter } from "../trpc";

export const postRouter = createTRPCRouter({
  getSecretMessage: publicProcedure.query(() => {
    return "hello from post router";
  }),
});
