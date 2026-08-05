import { PrismaClient } from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import pg from "pg";
import bcrypt from "bcryptjs";
import dotenv from "dotenv";

dotenv.config();

const { Pool } = pg;

async function updatePassword() {
  const DATABASE_URL = process.env.DATABASE_URL;
  if (!DATABASE_URL) {
    console.error("DATABASE_URL is missing.");
    process.exit(1);
  }

  const pool = new Pool({ connectionString: DATABASE_URL });
  const adapter = new PrismaPg(pool);
  const prisma = new PrismaClient({ adapter } as any);

  const email = "ayeshawadood02@gmail.com";
  const newPassword = "ayesha@08";
  const hash = await bcrypt.hash(newPassword, 12);

  const updated = await prisma.adminUser.update({
    where: { email },
    data: { passwordHash: hash }
  });

  console.log(`Password updated successfully for: ${updated.email}`);
  console.log(`New hashed password stored in database.`);

  await pool.end();
}

updatePassword().catch((e) => {
  console.error("Error updating password:", e);
  process.exit(1);
});
