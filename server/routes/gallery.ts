import { Router } from "express";
import { db } from "../db.js";

const router = Router();

/** GET /api/gallery — List all gallery items (public) */
router.get("/", async (_req, res) => {
  res.json(await db.getGallery());
});

export default router;
