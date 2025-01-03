import { DrizzleAdapter } from "@auth/drizzle-adapter";
import GoogleProvider from "next-auth/providers/google";
import { getServerSession, type NextAuthOptions, type User } from "next-auth";
// import { type Adapter } from "next-auth/adapters";
import { db } from "./db";
import { createTable } from "./db/schema";
import { Adapter } from "next-auth/adapters";
// import { Adapter } from "next-auth/adapters";
// import { accounts, users } from "./db/schema";
// import { Adapter } from "next-auth/adapters";
// import { BaseSQLiteDatabase } from "drizzle-orm/sqlite-core";
// import CredentialsProvider from "next-auth/providers/credentials";
// import { eq } from "drizzle-orm";
// import { env } from "@/env";
// import { db } from "@/server/db";
// import { createTable } from "@/server/db/schema";
// import { compare } from "bcrypt";

// import validator from "validator";
// import { type DefaultSQLiteSchema } from "node_modules/@auth/drizzle-adapter/src/lib/sqlite";
// import Credentials from "next-auth/providers/credentials";
// import { type DefaultSQLiteSchema } from "drizzle-orm/libsql";

/**
 * Module augmentation for `next-auth` types. Allows us to add custom properties to the `session`
 * object and keep type safety.
 *
 * @see https://next-auth.js.org/getting-started/typescript#module-augmentation
 */
// declare module "next-auth" {
//   interface User {
//     id: string
//     username: string
//     firstName: string
//     lastName: string
//   }
//   interface Session extends DefaultSession {
//     user: User & {
//       id: string;
//       // username: string;
//       // firstName: string;
//       // lastName: string
//       // ...other properties
//       // role: UserRole;
//     } & DefaultSession["user"];
//   }

//   // interface User {
//   //   // ...other properties
//   //   // role: UserRole;
//   // }
// }

const providers = [];

if (typeof GoogleProvider === "function") {
  providers.push(
    GoogleProvider({
      clientId: process.env.GOOGLE_ID!,
      clientSecret: process.env.GOOGLE_SECRET!,
    })
  );
}

/**
 * Options for NextAuth.js used to configure adapters, providers, callbacks, etc.
 *
 * @see https://next-auth.js.org/configuration/options
 */
export const authOptions: NextAuthOptions = {
  // callbacks: {
  //   session: ({ session, user }) => ({
  //     ...session,
  //     user: {
  //       ...session.user,
  //       id: user.id,
  //     },
  //   }),
  // },

  // providers: [
  //   DiscordProvider({
  //     clientId: env.DISCORD_CLIENT_ID,
  //     clientSecret: env.DISCORD_CLIENT_SECRET,
  //   }),
  //   /**
  //    * ...add more providers here.
  //    *
  //    * Most other providers require a bit more work than the Discord provider. For example, the
  //    * GitHub provider requires you to add the `refresh_token_expires_in` field to the Account
  //    * model. Refer to the NextAuth.js docs for the provider you want to use. Example:
  //    *
  //    * @see https://next-auth.js.org/providers/github
  //    */
  // ],
  providers,
  //   jwt: {
  //     maxAge: 24 * 60 * 60 * 1000,
  //   },
  secret: process.env.NEXTAUTH_SECRET,
  adapter: DrizzleAdapter(
    db,
    // @ts-expect-error umm types are weird
    createTable
  ) as Adapter,
  pages: {
    signIn: "/sign-in",
  },
  session: {
    strategy: "jwt",
  },
  callbacks: {
    async jwt({ token, account }) {
      // Persist the OAuth access_token to the token right after signin
      if (account) {
        token.accessToken = account.access_token;
      }

      return token;
    },
    // jwt({ token, account, user, trigger, session }) {
    //   if (user) {
    //     return {
    //       ...token,
    //       id: (user as unknown as User).id,
    //       username: (user as unknown as User).username,
    //       firstName: (user as unknown as User).firstName,
    //       lastName: (user as unknown as User).lastName,
    //       role: user.role,
    //     };
    //   }

    //   if (account) {
    //     token.accessToken = account.access_token;
    //     token.id = token.id;
    //     token.username = (user as unknown as User).username;
    //     token.firstName = (user as unknown as User).firstName;
    //     token.lastName = (user as unknown as User).lastName;
    //     token.role = (user as User).role;
    //   }

    //   if (trigger === "update" && session) {
    //     // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
    //     token.username = session.username;
    //   }

    //   return token;
    // },
    async session({ session, token, user }) {
      console.log("session", session);
      console.log("toke", token);
      console.log("user", user);
      if (user) {
        console.log("user 2222", user);
      }
      // if (token) {
      // Send properties to the client, like an access_token from a provider.
      return {
        ...session,

        user: {
          ...session.user,
          id: token?.id,
          username: token?.username,
          firstName: token?.firstName,
          lastName: token?.lastName,
          role: token?.role,
        },
      };
      // }

      return session;
    },
  },
};

/**
 * Wrapper for `getServerSession` so that you don't need to import the `authOptions` in every file.
 *
 * @see https://next-auth.js.org/configuration/nextjs
 */
export const getServerAuthSession = async (): Promise<User | null> => {
  const session = await getServerSession(authOptions);
  if (session && session.user) {
    const user = session.user as User;
    if (user.id) {
      return user;
    }
  }
  return null;
};
