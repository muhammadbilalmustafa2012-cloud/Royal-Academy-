import { Router } from "express";
import { db } from "../db.js";
import { syncAdmissionToGoogleSheets } from "../googleSheets.js";
import { requireAuth, AuthenticatedRequest } from "../middleware/auth.js";
import { validateBody, isRequired, isPhone, isEmail, maxLength } from "../middleware/validate.js";
import { formLimiter } from "../middleware/rateLimiter.js";

const router = Router();

/** GET /api/admissions — List admissions with optional filters */
router.get("/", (req, res) => {
  const { search, class: classFilter, status, startDate, endDate } = req.query;
  const admissions = db.getAdmissions({
    search: search as string,
    classFilter: classFilter as string,
    status: status as string,
    startDate: startDate as string,
    endDate: endDate as string
  });
  res.json(admissions);
});

/** GET /api/admissions/export/csv — Export admissions as CSV */
router.get("/export/csv", (req, res) => {
  const csvData = db.exportAdmissionsCSV();
  res.setHeader("Content-Type", "text/csv");
  res.setHeader("Content-Disposition", 'attachment; filename="royal_academy_admissions.csv"');
  res.send(csvData);
});

/** GET /api/admissions/status/:query — Lookup admission by ID/Phone/CNIC */
router.get("/status/:query", (req, res) => {
  const match = db.getAdmissionById(req.params.query);
  if (!match) {
    return res.status(404).json({ error: "No admission application found matching this ID, Phone, or CNIC." });
  }
  res.json(match);
});

/** POST /api/admissions — Submit a new admission (public, rate-limited) */
router.post(
  "/",
  formLimiter,
  validateBody({
    studentName: [isRequired, maxLength(200)],
    fatherName: [isRequired, maxLength(200)],
    phone: [isRequired, isPhone],
    email: [isEmail],
    address: [isRequired, maxLength(500)]
  }),
  async (req, res) => {
    const { studentName, fatherName, phone, courseName, class: classField } = req.body;
    const targetCourse = courseName || classField;

    if (!targetCourse) {
      return res.status(400).json({ error: "Please select a Class/Course." });
    }

    // Duplicate detection: same phone + course within 24 hours
    const recentDuplicate = db.checkDuplicateAdmission(phone, targetCourse);
    if (recentDuplicate) {
      return res.status(409).json({
        error: "A duplicate application was detected. You have already submitted an admission for this course within the last 24 hours.",
        existingId: recentDuplicate.id
      });
    }

    const newApp = db.createAdmission({
      ...req.body,
      courseName: targetCourse
    });

    // Trigger Google Sheets sync (non-blocking)
    syncAdmissionToGoogleSheets(newApp).catch((e) => console.error("[Google Sheets Error]", e));

    res.status(201).json(newApp);
  }
);

/** PATCH /api/admissions/:id — Update admission (protected) */
router.patch("/:id", requireAuth, (req: AuthenticatedRequest, res) => {
  const updated = db.updateAdmission(req.params.id, req.body);
  if (!updated) return res.status(404).json({ error: "Application not found" });
  res.json(updated);
});

/** PUT /api/admissions/:id/status — Update status (protected) */
router.put("/:id/status", requireAuth, (req: AuthenticatedRequest, res) => {
  const updated = db.updateAdmission(req.params.id, {
    status: req.body.status,
    adminNotes: req.body.adminNotes
  });
  if (!updated) return res.status(404).json({ error: "Application not found" });
  res.json(updated);
});

/** DELETE /api/admissions/:id — Delete admission (protected) */
router.delete("/:id", requireAuth, (req: AuthenticatedRequest, res) => {
  const success = db.deleteAdmission(req.params.id);
  if (!success) return res.status(404).json({ error: "Application not found" });
  res.json({ success: true, id: req.params.id });
});

export default router;
