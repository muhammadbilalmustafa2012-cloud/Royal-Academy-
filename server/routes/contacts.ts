import { Router } from "express";
import { db } from "../db.js";
import { requireAuth, AuthenticatedRequest } from "../middleware/auth.js";
import { validateBody, isRequired, maxLength } from "../middleware/validate.js";
import { formLimiter } from "../middleware/rateLimiter.js";

const router = Router();

/** GET /api/messages — List all contact messages (protected) */
router.get("/", (req, res) => {
  res.json(db.getMessages());
});

/** POST /api/messages — Submit a contact message (public, rate-limited) */
router.post(
  "/",
  formLimiter,
  validateBody({
    name: [isRequired, maxLength(200)],
    message: [isRequired, maxLength(5000)]
  }),
  (req, res) => {
    const newMsg = db.createMessage(req.body);
    res.status(201).json(newMsg);
  }
);

/** PUT /api/messages/:id/status — Update message status (protected) */
router.put("/:id/status", requireAuth, (req: AuthenticatedRequest, res) => {
  const updated = db.updateMessageStatus(req.params.id, req.body.status);
  if (!updated) return res.status(404).json({ error: "Message not found" });
  res.json(updated);
});

/** DELETE /api/messages/:id — Delete a message (protected) */
router.delete("/:id", requireAuth, (req: AuthenticatedRequest, res) => {
  const success = db.deleteMessage(req.params.id);
  if (!success) return res.status(404).json({ error: "Message not found" });
  res.json({ success: true });
});

export default router;
