import { Router } from "express";
import { db } from "../db.js";
import { requireAuth, AuthenticatedRequest } from "../middleware/auth.js";

const router = Router();

/** GET /api/courses — List all courses (public) */
router.get("/", (_req, res) => {
  res.json(db.getCourses());
});

/** POST /api/courses — Create a course (protected) */
router.post("/", requireAuth, (req: AuthenticatedRequest, res) => {
  const newCourse = db.createCourse(req.body);
  res.status(201).json(newCourse);
});

/** PUT /api/courses/:id — Update a course (protected) */
router.put("/:id", requireAuth, (req: AuthenticatedRequest, res) => {
  const updated = db.updateCourse(req.params.id, req.body);
  if (!updated) return res.status(404).json({ error: "Course not found" });
  res.json(updated);
});

/** DELETE /api/courses/:id — Delete a course (protected) */
router.delete("/:id", requireAuth, (req: AuthenticatedRequest, res) => {
  db.deleteCourse(req.params.id);
  res.json({ success: true });
});

export default router;
