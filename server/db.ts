import { PrismaClient } from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import pg from "pg";
import bcrypt from "bcryptjs";
import {
  INITIAL_COURSES,
  INITIAL_TEACHERS,
  INITIAL_NOTICES,
  INITIAL_GALLERY,
  INITIAL_RESULTS
} from "../src/data/initialData.js";

const { Pool } = pg;

// ─── Singleton Prisma Client ──────────────────────────────────────────────────
function createPrismaClient() {
  const DATABASE_URL = process.env.DATABASE_URL;
  if (!DATABASE_URL) {
    console.warn("[Database] DATABASE_URL not set – using JSON file fallback (dev mode).");
    return null;
  }
  const pool = new Pool({ connectionString: DATABASE_URL });
  const adapter = new PrismaPg(pool);
  return new PrismaClient({ adapter } as any);
}

let prisma = createPrismaClient();

// ─── JSON File Fallback (for environments without PostgreSQL) ─────────────────
import fs from "fs";
import path from "path";
import {
  Course,
  Teacher,
  AdmissionApplication,
  ContactMessage,
  GalleryItem,
  Notice,
  StudentResult
} from "../src/types.js";
import {
  INITIAL_ADMISSIONS,
  INITIAL_CONTACT_MESSAGES
} from "../src/data/initialData.js";

const DB_FILE = path.join(process.cwd(), "data", "royal_academy_db.json");

interface JsonDb {
  courses: any[];
  teachers: any[];
  admissions: any[];
  messages: any[];
  gallery: any[];
  notices: any[];
  results: any[];
  admins: any[];
  logs: any[];
}

function loadJson(): JsonDb {
  try {
    const dir = path.dirname(DB_FILE);
    if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
    if (fs.existsSync(DB_FILE)) return JSON.parse(fs.readFileSync(DB_FILE, "utf-8"));
  } catch (_) {}

  const salt = bcrypt.genSaltSync(10);
  const defaults: JsonDb = {
    courses: [...INITIAL_COURSES],
    teachers: [...INITIAL_TEACHERS],
    admissions: INITIAL_ADMISSIONS.map((a: any) => ({
      ...a,
      fatherName: a.fatherName || "N/A",
      email: a.email || "",
      phone: a.phone || "03290247580",
      gender: a.gender || "Male",
      dateOfBirth: a.dateOfBirth || "N/A",
      address: a.address || "Mansoorabad, Faisalabad",
      previousEducation: a.previousEducation || "BISE Faisalabad",
      cnicBForm: a.cnicBForm || "",
      guardianPhone: a.guardianPhone || a.phone || "03290247580",
      additionalNotes: a.additionalNotes || "",
      submissionTime: a.createdAt || new Date().toISOString(),
      createdAt: a.createdAt || new Date().toISOString(),
      googleSheetsSynced: false
    })),
    messages: INITIAL_CONTACT_MESSAGES.map((m: any) => ({
      ...m,
      date: m.date || new Date().toISOString()
    })),
    gallery: [...INITIAL_GALLERY],
    notices: [...INITIAL_NOTICES],
    results: INITIAL_RESULTS.map((r: any) => ({ ...r, status: r.status || "Pass" })),
    admins: [
      {
        id: "admin-1",
        username: "ayeshawadood02",
        name: "Miss Ayesha Wadood (Principal / Admin)",
        email: "ayeshawadood02@gmail.com",
        passwordHash: bcrypt.hashSync("ayesha@08", salt),
        role: "Super Admin"
      },
      {
        id: "admin-2",
        username: "admin",
        name: "Royal Academy Official Admin",
        email: "admin@royalacademy.pk",
        passwordHash: bcrypt.hashSync("royal2026", salt),
        role: "Administrator"
      }
    ],
    logs: []
  };
  fs.writeFileSync(DB_FILE, JSON.stringify(defaults, null, 2));
  return defaults;
}

function saveJson(data: JsonDb) {
  try {
    const dir = path.dirname(DB_FILE);
    if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
    fs.writeFileSync(DB_FILE, JSON.stringify(data, null, 2));
  } catch (e) {
    console.error("[DB JSON write error]", e);
  }
}

let jsonData: JsonDb | null = null;

function jdb(): JsonDb {
  if (!jsonData) jsonData = loadJson();
  return jsonData;
}

// ─── Admin type returned to API layer ────────────────────────────────────────
export interface AdminUser {
  id: string;
  username: string;
  name: string;
  email: string;
  role: string;
}

// ═══════════════════════════════════════════════════════════════════════════════
// Database class — delegates to PostgreSQL (Prisma) when available, falls back
// to local JSON file otherwise so the app always boots successfully.
// ═══════════════════════════════════════════════════════════════════════════════
class Database {
  private pg = prisma; // null when DATABASE_URL is not set

  // ── ADMISSIONS ─────────────────────────────────────────────────────────────
  async getAdmissions(filter?: {
    search?: string;
    classFilter?: string;
    status?: string;
    startDate?: string;
    endDate?: string;
  }) {
    if (!this.pg) return this._jsonGetAdmissions(filter);
    try {
      const where: any = {};
      if (filter?.search) {
        const q = filter.search.trim();
        where.OR = [
          { studentName: { contains: q, mode: "insensitive" } },
          { fatherName: { contains: q, mode: "insensitive" } },
          { phone: { contains: q } },
          { cnicBForm: { contains: q } },
          { id: { contains: q, mode: "insensitive" } }
        ];
      }
      if (filter?.classFilter && filter.classFilter !== "all") {
        where.courseName = { contains: filter.classFilter, mode: "insensitive" };
      }
      if (filter?.status && filter.status !== "all") {
        where.status = filter.status;
      }
      if (filter?.startDate || filter?.endDate) {
        where.createdAt = {};
        if (filter?.startDate) where.createdAt.gte = new Date(filter.startDate);
        if (filter?.endDate) where.createdAt.lte = new Date(new Date(filter.endDate).getTime() + 86400000);
      }
      const rows = await (this.pg as PrismaClient).admission.findMany({ where, orderBy: { createdAt: "desc" } });
      return rows.map((r: any) => ({ ...r, createdAt: r.createdAt.toISOString() }));
    } catch (e) {
      console.error("[DB.getAdmissions]", e);
      return [];
    }
  }

  async getAdmissionById(q: string) {
    if (!this.pg) return this._jsonGetAdmissionById(q);
    try {
      const row = await (this.pg as PrismaClient).admission.findFirst({
        where: {
          OR: [
            { id: { equals: q, mode: "insensitive" } },
            { phone: { contains: q } },
            { cnicBForm: { contains: q } }
          ]
        }
      });
      if (!row) return null;
      return { ...row, createdAt: row.createdAt.toISOString() };
    } catch (e) {
      console.error("[DB.getAdmissionById]", e);
      return null;
    }
  }

  async createAdmission(input: any) {
    const id = `APP-2026-${Math.floor(100 + Math.random() * 900)}`;
    const targetCourse = input.courseName || input.class || "Matric / Intermediate";
    const now = new Date();

    if (!this.pg) return this._jsonCreateAdmission(id, input, targetCourse, now);
    try {
      const row = await (this.pg as PrismaClient).admission.create({
        data: {
          id,
          studentName: input.studentName || "N/A",
          fatherName: input.fatherName || "N/A",
          email: input.email || "",
          phone: input.phone || "03290247580",
          gender: input.gender || "Male",
          dateOfBirth: input.dateOfBirth || "N/A",
          address: input.address || "Mansoorabad, Faisalabad",
          courseId: input.courseId || "general",
          courseName: targetCourse,
          previousEducation: input.previousEducation || input.previousSchool || "BISE Faisalabad",
          cnicBForm: input.cnicBForm || "",
          guardianPhone: input.guardianPhone || input.phone || "03290247580",
          additionalNotes: input.additionalNotes || "",
          status: input.status || "Pending",
          adminNotes: input.adminNotes || "",
          googleSheetsSynced: false
        }
      });
      await this.createLog("ADMISSION_SUBMITTED", `Application ${id} created for ${row.studentName}`);
      return { ...row, createdAt: row.createdAt.toISOString() };
    } catch (e) {
      console.error("[DB.createAdmission]", e);
      throw e;
    }
  }

  async updateAdmission(id: string, updates: any) {
    if (!this.pg) return this._jsonUpdateAdmission(id, updates);
    try {
      const data: any = {};
      const allowed = [
        "status", "adminNotes", "studentName", "fatherName", "email", "phone",
        "gender", "dateOfBirth", "address", "cnicBForm", "guardianPhone", "additionalNotes"
      ];
      allowed.forEach(k => { if (updates[k] !== undefined) data[k] = updates[k]; });
      if (updates.previousSchool) data.previousEducation = updates.previousSchool;
      if (updates.previousEducation) data.previousEducation = updates.previousEducation;

      const row = await (this.pg as PrismaClient).admission.update({ where: { id }, data });
      await this.createLog("ADMISSION_UPDATED", `Application ${id} updated`);
      return { ...row, createdAt: row.createdAt.toISOString() };
    } catch (e) {
      console.error("[DB.updateAdmission]", e);
      return null;
    }
  }

  async deleteAdmission(id: string) {
    if (!this.pg) return this._jsonDeleteAdmission(id);
    try {
      await (this.pg as PrismaClient).admission.delete({ where: { id } });
      await this.createLog("ADMISSION_DELETED", `Application ${id} deleted`);
      return true;
    } catch (e) {
      console.error("[DB.deleteAdmission]", e);
      return false;
    }
  }

  async getUnsyncedAdmissions() {
    if (!this.pg) return jdb().admissions.filter((a: any) => !a.googleSheetsSynced);
    try {
      const rows = await (this.pg as PrismaClient).admission.findMany({ where: { googleSheetsSynced: false } });
      return rows.map((r: any) => ({ ...r, createdAt: r.createdAt.toISOString() }));
    } catch (e) {
      return [];
    }
  }

  async markAdmissionSynced(id: string) {
    if (!this.pg) {
      const a = jdb().admissions.find((x: any) => x.id === id);
      if (a) { a.googleSheetsSynced = true; saveJson(jdb()); }
      return;
    }
    try {
      await (this.pg as PrismaClient).admission.update({ where: { id }, data: { googleSheetsSynced: true } });
    } catch (e) { console.error("[DB.markAdmissionSynced]", e); }
  }

  // ── CONTACTS ───────────────────────────────────────────────────────────────
  async getMessages() {
    if (!this.pg) return jdb().messages;
    try {
      const rows = await (this.pg as PrismaClient).contact.findMany({ orderBy: { date: "desc" } });
      return rows.map((r: any) => ({ ...r, date: r.date.toISOString() }));
    } catch (e) { console.error("[DB.getMessages]", e); return []; }
  }

  async createMessage(input: any) {
    if (!this.pg) return this._jsonCreateMessage(input);
    try {
      const row = await (this.pg as PrismaClient).contact.create({
        data: {
          id: `msg-${Date.now()}`,
          name: input.name || "Anonymous",
          email: input.email || "",
          phone: input.phone || "",
          subject: input.subject || "General Inquiry",
          message: input.message || "",
          status: "Unread"
        }
      });
      return { ...row, date: row.date.toISOString() };
    } catch (e) { console.error("[DB.createMessage]", e); throw e; }
  }

  async updateMessageStatus(id: string, status: string) {
    if (!this.pg) {
      const m = jdb().messages.find((x: any) => x.id === id);
      if (!m) return null;
      m.status = status; saveJson(jdb()); return m;
    }
    try {
      const row = await (this.pg as PrismaClient).contact.update({ where: { id }, data: { status } });
      return { ...row, date: row.date.toISOString() };
    } catch (e) { console.error("[DB.updateMessageStatus]", e); return null; }
  }

  async deleteMessage(id: string) {
    if (!this.pg) {
      const before = jdb().messages.length;
      jdb().messages = jdb().messages.filter((m: any) => m.id !== id);
      if (jdb().messages.length !== before) { saveJson(jdb()); return true; }
      return false;
    }
    try {
      await (this.pg as PrismaClient).contact.delete({ where: { id } }); return true;
    } catch (e) { console.error("[DB.deleteMessage]", e); return false; }
  }

  // ── COURSES ────────────────────────────────────────────────────────────────
  async getCourses() {
    if (!this.pg) return jdb().courses;
    try { return await (this.pg as PrismaClient).course.findMany(); } catch (e) { return []; }
  }

  async createCourse(c: any) {
    if (!this.pg) {
      const nc = { id: `course-${Date.now()}`, ...c, appliesCount: 0, featured: Boolean(c.featured) };
      jdb().courses.unshift(nc); saveJson(jdb()); return nc;
    }
    try {
      return await (this.pg as PrismaClient).course.create({
        data: {
          id: `course-${Date.now()}`,
          title: c.title || "New Course",
          category: c.category || "Tuition Classes",
          shortDescription: c.shortDescription || "",
          fullDescription: c.fullDescription || "",
          duration: c.duration || "1 Month",
          fee: Number(c.fee) || 0,
          feePeriod: c.feePeriod || "per month",
          image: c.image || "https://images.unsplash.com/photo-1522202176988-66273c2fd55f?auto=format&fit=crop&q=80&w=800",
          features: c.features || [],
          schedule: c.schedule || "Mon - Sat",
          instructor: c.instructor || "Faculty Staff",
          appliesCount: 0,
          featured: Boolean(c.featured)
        }
      });
    } catch (e) { console.error("[DB.createCourse]", e); throw e; }
  }

  async updateCourse(id: string, updates: any) {
    if (!this.pg) {
      const idx = jdb().courses.findIndex((c: any) => c.id === id);
      if (idx === -1) return null;
      jdb().courses[idx] = { ...jdb().courses[idx], ...updates }; saveJson(jdb());
      return jdb().courses[idx];
    }
    try {
      return await (this.pg as PrismaClient).course.update({ where: { id }, data: updates });
    } catch (e) { console.error("[DB.updateCourse]", e); return null; }
  }

  async deleteCourse(id: string) {
    if (!this.pg) { jdb().courses = jdb().courses.filter((c: any) => c.id !== id); saveJson(jdb()); return true; }
    try { await (this.pg as PrismaClient).course.delete({ where: { id } }); return true; } catch (e) { return false; }
  }

  // ── TEACHERS ───────────────────────────────────────────────────────────────
  async getTeachers() {
    if (!this.pg) return jdb().teachers;
    try { return await (this.pg as PrismaClient).teacher.findMany(); } catch (e) { return []; }
  }

  async createTeacher(t: any) {
    if (!this.pg) {
      const nt = { id: `teach-${Date.now()}`, ...t, featured: Boolean(t.featured) };
      jdb().teachers.unshift(nt); saveJson(jdb()); return nt;
    }
    try {
      return await (this.pg as PrismaClient).teacher.create({
        data: {
          id: `teach-${Date.now()}`,
          name: t.name, role: t.role || "Faculty Member",
          qualification: t.qualification || "M.Sc / M.Phil",
          experience: t.experience || "5+ Years",
          subject: t.subject || "General Science",
          photo: t.photo || "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=600",
          bio: t.bio || "", email: t.email || "info@royalacademy.pk",
          phone: t.phone || "03290247580", featured: Boolean(t.featured)
        }
      });
    } catch (e) { console.error("[DB.createTeacher]", e); throw e; }
  }

  // ── NOTICES ────────────────────────────────────────────────────────────────
  async getNotices() {
    if (!this.pg) return jdb().notices;
    try { return await (this.pg as PrismaClient).notice.findMany(); } catch (e) { return []; }
  }

  async createNotice(n: any) {
    if (!this.pg) {
      const nn = { id: `notice-${Date.now()}`, ...n, date: new Date().toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" }), urgent: Boolean(n.urgent) };
      jdb().notices.unshift(nn); saveJson(jdb()); return nn;
    }
    try {
      return await (this.pg as PrismaClient).notice.create({
        data: {
          id: `notice-${Date.now()}`,
          title: n.title, content: n.content,
          date: new Date().toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" }),
          category: n.category || "Academic", urgent: Boolean(n.urgent)
        }
      });
    } catch (e) { console.error("[DB.createNotice]", e); throw e; }
  }

  async deleteNotice(id: string) {
    if (!this.pg) { jdb().notices = jdb().notices.filter((n: any) => n.id !== id); saveJson(jdb()); return true; }
    try { await (this.pg as PrismaClient).notice.delete({ where: { id } }); return true; } catch (e) { return false; }
  }

  // ── RESULTS ────────────────────────────────────────────────────────────────
  async getResults(query?: string) {
    if (!this.pg) {
      if (!query) return jdb().results;
      const q = query.toLowerCase();
      return jdb().results.filter((r: any) =>
        r.rollNumber.toLowerCase().includes(q) || r.studentName.toLowerCase().includes(q) || r.className.toLowerCase().includes(q)
      );
    }
    try {
      if (!query) return await (this.pg as PrismaClient).studentResult.findMany();
      const q = query.trim();
      return await (this.pg as PrismaClient).studentResult.findMany({
        where: { OR: [{ rollNumber: { contains: q, mode: "insensitive" } }, { studentName: { contains: q, mode: "insensitive" } }, { className: { contains: q, mode: "insensitive" } }] }
      });
    } catch (e) { return []; }
  }

  async createResult(r: any) {
    if (!this.pg) {
      const nr = { id: `res-${Date.now()}`, ...r, status: r.status || "Pass" };
      jdb().results.unshift(nr); saveJson(jdb()); return nr;
    }
    try {
      return await (this.pg as PrismaClient).studentResult.create({
        data: {
          id: `res-${Date.now()}`,
          rollNumber: r.rollNumber, studentName: r.studentName, fatherName: r.fatherName || "",
          className: r.className || "10th Science", totalMarks: Number(r.totalMarks) || 1100,
          marksObtained: Number(r.marksObtained) || 0,
          percentage: Number(r.percentage) || Number(((r.marksObtained / r.totalMarks) * 100).toFixed(1)),
          grade: r.grade || "A+", status: r.status || "Pass",
          examName: r.examName || "BISE Board Examination 2025"
        }
      });
    } catch (e) { console.error("[DB.createResult]", e); throw e; }
  }

  // ── ADMIN AUTH ─────────────────────────────────────────────────────────────
  async verifyAdminPassword(email: string, passwordInput: string): Promise<AdminUser | null> {
    const admins = this.pg ? await this._pgGetAdmins(email) : jdb().admins.filter((a: any) =>
      a.email.toLowerCase() === email.toLowerCase() || a.username.toLowerCase() === email.toLowerCase()
    );

    const admin = admins[0];
    if (!admin) return null;
    const match = await bcrypt.compare(passwordInput, admin.passwordHash);
    if (!match) {
      await this.createLog("FAILED_LOGIN", `Failed login for ${email}`);
      return null;
    }
    await this.createLog("ADMIN_LOGIN", `Admin ${admin.email} logged in`);
    return { id: admin.id, username: admin.username, name: admin.name, email: admin.email, role: admin.role };
  }

  private async _pgGetAdmins(email: string): Promise<any[]> {
    if (!this.pg) return [];
    try {
      return await (this.pg as PrismaClient).adminUser.findMany({
        where: { OR: [{ email: { equals: email, mode: "insensitive" } }, { username: { equals: email, mode: "insensitive" } }] }
      });
    } catch (e) { return []; }
  }

  async changeAdminPassword(email: string, oldPassword: string, newPassword: string): Promise<boolean> {
    const admin = await this._pgGetAdmins(email).then(a => a[0]) ?? jdb().admins.find((a: any) =>
      a.email.toLowerCase() === email.toLowerCase() || a.username.toLowerCase() === email.toLowerCase()
    );
    if (!admin) return false;
    const match = await bcrypt.compare(oldPassword, admin.passwordHash);
    if (!match) return false;
    const passwordHash = await bcrypt.hash(newPassword, 10);
    if (this.pg) {
      await (this.pg as PrismaClient).adminUser.update({ where: { id: admin.id }, data: { passwordHash } });
    } else {
      admin.passwordHash = passwordHash; saveJson(jdb());
    }
    await this.createLog("PASSWORD_CHANGED", `Password changed for ${email}`);
    return true;
  }

  // ── LOGS ───────────────────────────────────────────────────────────────────
  async createLog(action: string, details: string, ip?: string) {
    const logEntry = { id: `log-${Date.now()}`, action, details, ip: ip || "127.0.0.1", timestamp: new Date().toISOString() };
    if (!this.pg) {
      jdb().logs.unshift(logEntry);
      if (jdb().logs.length > 500) jdb().logs = jdb().logs.slice(0, 500);
      saveJson(jdb());
      return;
    }
    try {
      await (this.pg as PrismaClient).activityLog.create({ data: { id: logEntry.id, action, details, ip: logEntry.ip } });
    } catch (e) { /* non-critical */ }
  }

  async getLogs() {
    if (!this.pg) return jdb().logs;
    try {
      const rows = await (this.pg as PrismaClient).activityLog.findMany({ orderBy: { timestamp: "desc" }, take: 500 });
      return rows.map((r: any) => ({ ...r, timestamp: r.timestamp.toISOString() }));
    } catch (e) { return []; }
  }

  // ── CSV Export ─────────────────────────────────────────────────────────────
  exportAdmissionsCSV(list: any[]): string {
    const headers = ["Application ID","Student Name","Father Name","Phone","Guardian Phone","Email","Course / Class","Gender","Date of Birth","B-Form / CNIC","Previous Qualification","Address","Additional Notes","Status","Submission Time"];
    const esc = (v: any) => `"${String(v ?? "").replace(/"/g, '""')}"`;
    const rows = list.map(a => [
      esc(a.id), esc(a.studentName), esc(a.fatherName), esc(a.phone), esc(a.guardianPhone || a.phone),
      esc(a.email), esc(a.courseName), esc(a.gender || "Male"), esc(a.dateOfBirth),
      esc(a.cnicBForm), esc(a.previousEducation || a.previousSchool), esc(a.address),
      esc(a.additionalNotes || a.adminNotes), esc(a.status), esc(a.createdAt || a.submissionTime)
    ].join(","));
    return [headers.join(","), ...rows].join("\n");
  }

  // ── JSON fallback helpers ──────────────────────────────────────────────────
  private _jsonGetAdmissions(filter?: any) {
    let result = [...jdb().admissions];
    if (filter?.search) {
      const q = filter.search.toLowerCase();
      result = result.filter(a => a.studentName?.toLowerCase().includes(q) || a.phone?.includes(q) || a.id?.toLowerCase().includes(q));
    }
    if (filter?.classFilter && filter.classFilter !== "all") result = result.filter(a => a.courseName?.toLowerCase().includes(filter.classFilter.toLowerCase()));
    if (filter?.status && filter.status !== "all") result = result.filter(a => a.status === filter.status);
    return result.sort((a, b) => new Date(b.createdAt || b.submissionTime).getTime() - new Date(a.createdAt || a.submissionTime).getTime());
  }

  private _jsonGetAdmissionById(q: string) {
    return jdb().admissions.find((a: any) => a.id?.toLowerCase() === q.toLowerCase() || a.phone?.includes(q) || a.cnicBForm?.includes(q)) || null;
  }

  private _jsonCreateAdmission(id: string, input: any, targetCourse: string, now: Date) {
    const na = {
      id, studentName: input.studentName || "N/A", fatherName: input.fatherName || "N/A",
      email: input.email || "", phone: input.phone || "03290247580", gender: input.gender || "Male",
      dateOfBirth: input.dateOfBirth || "N/A", address: input.address || "Mansoorabad, Faisalabad",
      courseId: input.courseId || "general", courseName: targetCourse,
      previousEducation: input.previousEducation || input.previousSchool || "BISE Faisalabad",
      cnicBForm: input.cnicBForm || "", guardianPhone: input.guardianPhone || input.phone || "03290247580",
      additionalNotes: input.additionalNotes || "", status: input.status || "Pending",
      adminNotes: input.adminNotes || "", createdAt: now.toISOString(), submissionTime: now.toISOString(),
      googleSheetsSynced: false
    };
    jdb().admissions.unshift(na); saveJson(jdb());
    this.createLog("ADMISSION_SUBMITTED", `Application ${id} created for ${na.studentName}`);
    return na;
  }

  private _jsonUpdateAdmission(id: string, updates: any) {
    const idx = jdb().admissions.findIndex((a: any) => a.id === id);
    if (idx === -1) return null;
    jdb().admissions[idx] = { ...jdb().admissions[idx], ...updates }; saveJson(jdb());
    return jdb().admissions[idx];
  }

  private _jsonDeleteAdmission(id: string) {
    const before = jdb().admissions.length;
    jdb().admissions = jdb().admissions.filter((a: any) => a.id !== id);
    if (jdb().admissions.length !== before) { saveJson(jdb()); return true; }
    return false;
  }

  private _jsonCreateMessage(input: any) {
    const nm = { id: `msg-${Date.now()}`, name: input.name || "Anonymous", email: input.email || "", phone: input.phone || "", subject: input.subject || "General Inquiry", message: input.message || "", status: "Unread", date: new Date().toISOString() };
    jdb().messages.unshift(nm); saveJson(jdb()); return nm;
  }
}

export const db = new Database();
