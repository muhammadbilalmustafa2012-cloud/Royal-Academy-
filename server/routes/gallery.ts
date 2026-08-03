import { Router } from "express";
import { db } from "../db.js";

const router = Router();

/** GET /api/gallery — List all gallery items (public) */
router.get("/", (_req, res) => {
  res.json(db.getGallery());
});

export default router;
