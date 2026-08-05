import { PrismaClient } from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import pg from "pg";
import bcrypt from "bcryptjs";
import {
  INITIAL_COURSES,
  INITIAL_TEACHERS,
  INITIAL_NOTICES,
  INITIAL_GALLERY,
  INITIAL_RESULTS,
  INITIAL_ADMISSIONS,
  INITIAL_CONTACT_MESSAGES
} from "../src/data/initialData.js";
import dotenv from "dotenv";

dotenv.config();

const { Pool } = pg;

async function seed() {
  const DATABASE_URL = process.env.DATABASE_URL;
  if (!DATABASE_URL) {
    console.error("DATABASE_URL environment variable is missing.");
    process.exit(1);
  }

  const pool = new Pool({ connectionString: DATABASE_URL });
  const adapter = new PrismaPg(pool);
  const prisma = new PrismaClient({ adapter } as any);

  try {
    console.log("Seeding courses...");
    for (const c of INITIAL_COURSES) {
      await prisma.course.upsert({
        where: { id: c.id },
        update: {},
        create: {
          id: c.id,
          title: c.title,
          category: c.category,
          shortDescription: c.shortDescription,
          fullDescription: c.fullDescription,
          duration: c.duration,
          fee: c.fee,
          feePeriod: c.feePeriod,
          image: c.image,
          features: c.features,
          schedule: c.schedule,
          instructor: c.instructor,
          appliesCount: c.appliesCount || 0,
          featured: c.featured || false
        }
      });
    }

    console.log("Seeding teachers...");
    for (const t of INITIAL_TEACHERS) {
      await prisma.teacher.upsert({
        where: { id: t.id },
        update: {},
        create: {
          id: t.id,
          name: t.name,
          role: t.role,
          qualification: t.qualification,
          experience: t.experience,
          subject: t.subject,
          photo: t.photo,
          bio: t.bio,
          email: t.email,
          phone: t.phone,
          featured: t.featured || false
        }
      });
    }

    console.log("Seeding notices...");
    for (const n of INITIAL_NOTICES) {
      await prisma.notice.upsert({
        where: { id: n.id },
        update: {},
        create: {
          id: n.id,
          title: n.title,
          category: n.category,
          content: n.content,
          date: n.date,
          urgent: n.urgent || false
        }
      });
    }

    console.log("Seeding gallery...");
    for (const g of INITIAL_GALLERY) {
      await prisma.galleryItem.upsert({
        where: { id: g.id },
        update: {},
        create: {
          id: g.id,
          title: g.title,
          category: g.category,
          image: g.image,
          date: g.date,
          description: g.description
        }
      });
    }

    console.log("Seeding results...");
    for (const r of INITIAL_RESULTS) {
      await prisma.studentResult.upsert({
        where: { rollNumber: r.rollNumber },
        update: {},
        create: {
          id: r.id,
          rollNumber: r.rollNumber,
          studentName: r.studentName,
          fatherName: r.fatherName,
          className: r.className,
          examName: r.examName,
          marksObtained: r.marksObtained,
          totalMarks: r.totalMarks,
          percentage: r.percentage,
          grade: r.grade,
          status: r.status || "Pass"
        }
      });
    }

    console.log("Seeding admin users...");
    const salt = bcrypt.genSaltSync(10);
    
    // Principal Account
    await prisma.adminUser.upsert({
      where: { email: "ayeshawadood02@gmail.com" },
      update: {},
      create: {
        id: "admin-1",
        username: "ayeshawadood02",
        name: "Miss Ayesha Wadood (Principal / Admin)",
        email: "ayeshawadood02@gmail.com",
        passwordHash: bcrypt.hashSync("ayeshafahad08", salt),
        role: "Super Admin"
      }
    });

    // General Admin Account
    await prisma.adminUser.upsert({
      where: { email: "admin@royalacademy.pk" },
      update: {},
      create: {
        id: "admin-2",
        username: "admin",
        name: "Royal Academy Official Admin",
        email: "admin@royalacademy.pk",
        passwordHash: bcrypt.hashSync("royal2026", salt),
        role: "Administrator"
      }
    });

    console.log("Database seeded successfully!");
  } catch (error) {
    console.error("Error seeding database:", error);
  } finally {
    await pool.end();
  }
}

seed();
