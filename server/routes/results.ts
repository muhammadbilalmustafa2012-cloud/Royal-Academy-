import { Router } from "express";
import { db } from "../db.js";
import { requireAuth, AuthenticatedRequest } from "../middleware/auth.js";

const router = Router();

/** GET /api/results — Search board results (public) */
router.get("/", (req, res) => {
  const query = (req.query.q as string) || "";
  res.json(db.getResults(query));
});

/** POST /api/results — Add a result (protected) */
router.post("/", requireAuth, (req: AuthenticatedRequest, res) => {
  const newResult = db.createResult(req.body);
  res.status(201).json(newResult);
});

export default router;
