import { Router } from "express";
import { db } from "../db.js";
import { requireAuth, AuthenticatedRequest } from "../middleware/auth.js";

const router = Router();

/** GET /api/notices — List all notices (public) */
router.get("/", (_req, res) => {
  res.json(db.getNotices());
});

/** POST /api/notices — Create a notice (protected) */
router.post("/", requireAuth, (req: AuthenticatedRequest, res) => {
  const newNotice = db.createNotice(req.body);
  res.status(201).json(newNotice);
});

/** DELETE /api/notices/:id — Delete a notice (protected) */
router.delete("/:id", requireAuth, (req: AuthenticatedRequest, res) => {
  db.deleteNotice(req.params.id);
  res.json({ success: true });
});

export default router;
