import express from "express";
import cors from "cors";
import jwt from "jsonwebtoken";
import { GoogleGenAI } from "@google/genai";
import { db } from "../server/db.js";
import { syncAdmissionToGoogleSheets } from "../server/googleSheets.js";

const JWT_SECRET = process.env.JWT_SECRET || "royal_academy_secret_key_2026_faisalabad";
const PRIMARY_DOMAIN = "https://www.royalacademy.pk";

const app = express();
app.use(cors());
app.use(express.json());

// Helper for Gemini AI Client
let aiClient: GoogleGenAI | null = null;
function getGeminiClient() {
  if (!aiClient) {
    const apiKey = process.env.GEMINI_API_KEY;
    if (apiKey) {
      aiClient = new GoogleGenAI({
        apiKey,
        httpOptions: {
          headers: {
            "User-Agent": "aistudio-build"
          }
        }
      });
    }
  }
  return aiClient;
}

// --- SEO ROUTE: sitemap.xml ---
app.get("/sitemap.xml", (_req, res) => {
  res.header("Content-Type", "application/xml");
  const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <url>
    <loc>${PRIMARY_DOMAIN}/</loc>
    <lastmod>${new Date().toISOString().split("T")[0]}</lastmod>
    <changefreq>daily</changefreq>
    <priority>1.0</priority>
  </url>
  <url>
    <loc>${PRIMARY_DOMAIN}/about</loc>
    <changefreq>weekly</changefreq>
    <priority>0.8</priority>
  </url>
  <url>
    <loc>${PRIMARY_DOMAIN}/courses</loc>
    <changefreq>daily</changefreq>
    <priority>0.9</priority>
  </url>
  <url>
    <loc>${PRIMARY_DOMAIN}/admissions</loc>
    <changefreq>daily</changefreq>
    <priority>0.9</priority>
  </url>
  <url>
    <loc>${PRIMARY_DOMAIN}/teachers</loc>
    <changefreq>weekly</changefreq>
    <priority>0.8</priority>
  </url>
  <url>
    <loc>${PRIMARY_DOMAIN}/gallery</loc>
    <changefreq>weekly</changefreq>
    <priority>0.7</priority>
  </url>
  <url>
    <loc>${PRIMARY_DOMAIN}/notices</loc>
    <changefreq>daily</changefreq>
    <priority>0.8</priority>
  </url>
  <url>
    <loc>${PRIMARY_DOMAIN}/results</loc>
    <changefreq>weekly</changefreq>
    <priority>0.8</priority>
  </url>
  <url>
    <loc>${PRIMARY_DOMAIN}/contact</loc>
    <changefreq>monthly</changefreq>
    <priority>0.8</priority>
  </url>
</urlset>`;
  res.send(sitemap);
});

// --- SEO ROUTE: robots.txt ---
app.get("/robots.txt", (_req, res) => {
  res.header("Content-Type", "text/plain");
  const robots = `User-agent: *
Allow: /
Disallow: /admin
Disallow: /api/admin/

Sitemap: ${PRIMARY_DOMAIN}/sitemap.xml`;
  res.send(robots);
});

// --- API ROUTES FOR VERCEL SERVERLESS ---

// Health check
app.get("/api/health", (_req, res) => {
  res.json({
    status: "ok",
    institute: "Royal Academy Faisalabad",
    domain: PRIMARY_DOMAIN,
    location: "Street 14, Farooqabad, Mansoorabad, Faisalabad, Punjab, Pakistan",
    phone: "03290247580"
  });
});

// System Stats
app.get("/api/stats", async (_req, res) => {
  const admissions = await db.getAdmissions();
  const courses = await db.getCourses();
  const teachers = await db.getTeachers();
  const messages = await db.getMessages();

  res.json({
    totalStudents: 850 + admissions.filter((a: any) => a.status === "Approved").length,
    totalCourses: courses.length,
    pendingAdmissions: admissions.filter((a: any) => a.status === "Pending").length,
    approvedAdmissions: admissions.filter((a: any) => a.status === "Approved").length,
    totalTeachers: teachers.length,
    unreadMessages: messages.filter((m: any) => m.status === "Unread").length,
    totalApplications: admissions.length
  });
});

// 1. ADMISSIONS API
app.get("/api/admissions", async (req, res) => {
  const { search, class: classFilter, status, startDate, endDate } = req.query;
  const admissions = await db.getAdmissions({
    search: search as string,
    classFilter: classFilter as string,
    status: status as string,
    startDate: startDate as string,
    endDate: endDate as string
  });
  res.json(admissions);
});

app.get("/api/admissions/export/csv", async (_req, res) => {
  const csvData = await db.exportAdmissionsCSV({});
  res.setHeader("Content-Type", "text/csv");
  res.setHeader("Content-Disposition", 'attachment; filename="royal_academy_admissions.csv"');
  res.send(csvData);
});

app.get("/api/admissions/status/:query", async (req, res) => {
  const match = await db.getAdmissionById(req.params.query);
  if (!match) {
    return res.status(404).json({ error: "No admission application found matching this ID, Phone, or CNIC." });
  }
  res.json(match);
});

app.post("/api/admissions", async (req, res) => {
  const { studentName, fatherName, phone, courseName, class: classField } = req.body;
  const targetCourse = courseName || classField;

  if (!studentName || !phone || !targetCourse) {
    return res
      .status(400)
      .json({ error: "Please fill in all required fields (Student Name, Phone, and Class/Course)." });
  }

  const newApp = db.createAdmission({
    ...req.body,
    courseName: targetCourse
  });

  syncAdmissionToGoogleSheets(newApp).catch((e) => console.error(e));
  res.status(201).json(newApp);
});

app.patch("/api/admissions/:id", (req, res) => {
  const updated = db.updateAdmission(req.params.id, req.body);
  if (!updated) return res.status(404).json({ error: "Application not found" });
  res.json(updated);
});

app.put("/api/admissions/:id/status", (req, res) => {
  const updated = db.updateAdmission(req.params.id, {
    status: req.body.status,
    adminNotes: req.body.adminNotes
  });
  if (!updated) return res.status(404).json({ error: "Application not found" });
  res.json(updated);
});

app.delete("/api/admissions/:id", (req, res) => {
  const success = db.deleteAdmission(req.params.id);
  if (!success) return res.status(404).json({ error: "Application not found" });
  res.json({ success: true, id: req.params.id });
});

// 2. CONTACT MESSAGES API
app.get("/api/messages", (_req, res) => {
  res.json(db.getMessages());
});

app.post("/api/messages", (req, res) => {
  const { name, message } = req.body;
  if (!name || !message) {
    return res.status(400).json({ error: "Name and message are required." });
  }
  const newMsg = db.createMessage(req.body);
  res.status(201).json(newMsg);
});

app.put("/api/messages/:id/status", (req, res) => {
  const updated = db.updateMessageStatus(req.params.id, req.body.status);
  if (!updated) return res.status(404).json({ error: "Message not found" });
  res.json(updated);
});

app.delete("/api/messages/:id", (req, res) => {
  const success = db.deleteMessage(req.params.id);
  if (!success) return res.status(404).json({ error: "Message not found" });
  res.json({ success: true });
});

// 3. COURSES API
app.get("/api/courses", (_req, res) => {
  res.json(db.getCourses());
});

app.post("/api/courses", (req, res) => {
  const newCourse = db.createCourse(req.body);
  res.status(201).json(newCourse);
});

app.put("/api/courses/:id", (req, res) => {
  const updated = db.updateCourse(req.params.id, req.body);
  if (!updated) return res.status(404).json({ error: "Course not found" });
  res.json(updated);
});

app.delete("/api/courses/:id", (req, res) => {
  db.deleteCourse(req.params.id);
  res.json({ success: true });
});

// 4. TEACHERS API
app.get("/api/teachers", (_req, res) => {
  res.json(db.getTeachers());
});

app.post("/api/teachers", (req, res) => {
  const newTeacher = db.createTeacher(req.body);
  res.status(201).json(newTeacher);
});

// 5. NOTICES API
app.get("/api/notices", (_req, res) => {
  res.json(db.getNotices());
});

app.post("/api/notices", (req, res) => {
  const newNotice = db.createNotice(req.body);
  res.status(201).json(newNotice);
});

app.delete("/api/notices/:id", (req, res) => {
  db.deleteNotice(req.params.id);
  res.json({ success: true });
});

// 6. BOARD RESULTS API
app.get("/api/results", (req, res) => {
  const query = (req.query.q as string) || "";
  res.json(db.getResults(query));
});

app.post("/api/results", (req, res) => {
  const newResult = db.createResult(req.body);
  res.status(201).json(newResult);
});

// 7. ADMIN AUTHENTICATION
app.post("/api/auth/login", async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return res.status(400).json({ error: "Email and password are required." });
  }

  const admin = await db.verifyAdminPassword(email, password);
  if (!admin) {
    return res.status(401).json({ error: "Invalid admin email or password." });
  }

  const token = jwt.sign(
    { id: admin.id, email: admin.email, role: admin.role },
    JWT_SECRET,
    { expiresIn: "24h" }
  );

  res.json({
    success: true,
    user: {
      id: admin.id,
      username: admin.username,
      name: admin.name,
      email: admin.email,
      role: admin.role,
      token
    }
  });
});

app.post("/api/auth/change-password", async (req, res) => {
  const { email, oldPassword, newPassword } = req.body;
  if (!email || !oldPassword || !newPassword) {
    return res.status(400).json({ error: "Email, old password, and new password are required." });
  }

  const success = await db.changeAdminPassword(email, oldPassword, newPassword);
  if (!success) {
    return res.status(400).json({ error: "Failed to change password. Please verify your old password." });
  }

  res.json({ success: true, message: "Password updated successfully." });
});

// 8. GEMINI AI ASSISTANT API
app.post("/api/ai/chat", async (req, res) => {
  try {
    const { message } = req.body;
    if (!message || typeof message !== "string") {
      return res.status(400).json({ error: "Message is required" });
    }

    const ai = getGeminiClient();
    if (!ai) {
      return res.json({
        reply:
          "Welcome to **Royal Academy Faisalabad**!\n\n📍 **Location**: Street 14, Farooqabad, Mansoorabad, Faisalabad, Punjab, Pakistan\n📞 **Helpline**: 03290247580\n🌐 **Official Website**: https://www.royalacademy.pk\n\nWe offer Matric (Science/Arts), F.Sc Pre-Medical, F.Sc Pre-Engineering, ICS, MDCAT/ECAT Entry Test, Spoken English, and IT Computer courses. How may I assist your admission today?"
      });
    }

    const systemPrompt = `You are the official Royal Academy AI Admissions & Student Advisory Assistant.
Official Details for Royal Academy:
- Institute Name: Royal Academy
- Primary Domain: https://www.royalacademy.pk
- Location: Street 14, Farooqabad, Mansoorabad, Faisalabad, Punjab, Pakistan
- Helpline / Phone: 03290247580
- WhatsApp: 03290247580 (0329-0247580)
- Programs offered: Matriculation, F.Sc Pre-Medical, F.Sc Pre-Engineering, ICS, MDCAT & ECAT Entry Test, Spoken English, Computer IT Short Courses.
- Timings: Morning & Evening batches.
- Tone: Extremely polite, encouraging, professional, structured, and helpful.
- Encourage students to fill out the online admission form on https://www.royalacademy.pk or call 03290247580.`;

    const response = await ai.models.generateContent({
      model: "gemini-2.0-flash",
      contents: [{ role: "user", parts: [{ text: `${systemPrompt}\n\nUser Question: ${message}` }] }]
    });

    const reply =
      response.text ||
      "Thank you for contacting Royal Academy! Please call 03290247580 or visit our campus at Street 14, Farooqabad, Mansoorabad, Faisalabad for complete admission guidance.";
    res.json({ reply });
  } catch (error: any) {
    console.error("Gemini AI error:", error);
    res.json({
      reply:
        "Thank you for reaching out to **Royal Academy**! For immediate registration details, call us directly at **03290247580** or visit our campus at Street 14, Farooqabad, Mansoorabad, Faisalabad, Punjab, Pakistan."
    });
  }
});

export default app;
