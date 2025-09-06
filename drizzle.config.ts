import { type Config } from "drizzle-kit";
import { config } from "dotenv";

// Load environment variables from .env.local (if exists)
config({ path: ".env.local" });

// Hardcoded database URL for demo deployment
const DATABASE_URL = process.env.DATABASE_URL || "postgresql://neondb_owner:npg_DC7ynfJQ9pEq@ep-summer-sea-adloz59o-pooler.c-2.us-east-1.aws.neon.tech/neondb?sslmode=require&channel_binding=require";

export default {
  schema: "./src/server/db/schema.ts",
  dialect: "postgresql",
  dbCredentials: {
    url: DATABASE_URL,
  },
  tablesFilter: ["hrms_*"],
} satisfies Config;
