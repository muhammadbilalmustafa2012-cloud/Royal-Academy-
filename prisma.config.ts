import { defineConfig } from "prisma/config";
import { PrismaPg } from "@prisma/adapter-pg";
import dotenv from "dotenv";

dotenv.config();

const connectionString = process.env.DATABASE_URL || "";

export default defineConfig({
  schema: "./prisma/schema.prisma",
  datasource: {
    url: connectionString
  },
  migrate: {
    async adapter() {
      const { Pool } = await import("pg");
      const pool = new Pool({ connectionString });
      return new PrismaPg(pool);
    },
  },
});
