import { drizzle } from "drizzle-orm/libsql";

import * as schema from "./schema";
import { createClient } from "@libsql/client";

export const client = createClient({
  url: process.env.TURSO_DATABASE_URL!,
  authToken: process.env.TURSO_AUTH_TOKEN!,
});

export const db = drizzle(client, { schema, logger: true });
