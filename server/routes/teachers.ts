import { Router } from "express";
import { db } from "../db.js";
import { requireAuth, AuthenticatedRequest } from "../middleware/auth.js";

const router = Router();

/** GET /api/teachers — List all teachers (public) */
router.get("/", (_req, res) => {
  res.json(db.getTeachers());
});

/** POST /api/teachers — Add a teacher (protected) */
router.post("/", requireAuth, (req: AuthenticatedRequest, res) => {
  const newTeacher = db.createTeacher(req.body);
  res.status(201).json(newTeacher);
});

export default router;
