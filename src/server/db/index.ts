// import { drizzle } from "drizzle-orm/libsql";

// import * as schema from "./schema";
// import { createClient } from "@libsql/client";

// export const client = createClient({
//   url: process.env.DB_FILE_NAME!,
//   authToken: process.env.TURSO_AUTH_TOKEN!,
// });

// export const db = drizzle(client, { schema, logger: true });

import { createClient, type Client } from "@libsql/client";
import { drizzle } from "drizzle-orm/libsql";

// import { env } from "~/env";
import * as schema from "./schema";

/**
 * Cache the database connection in development. This avoids creating a new connection on every HMR
 * update.
 */
const globalForDb = globalThis as unknown as {
  client: Client | undefined;
};

export const client =
  globalForDb.client ??
  createClient({
    url: process.env.AUTH_DRIZZLE_URL!,
    authToken: process.env.AUTH_DRIZZLE_TOKEN,
  });
if (process.env.NODE_ENV !== "production") globalForDb.client = client;

export const db = drizzle(client, { schema });
