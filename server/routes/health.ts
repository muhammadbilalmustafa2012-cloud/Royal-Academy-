import { Router } from "express";

const PRIMARY_DOMAIN = "https://www.royalacademy.pk";

const router = Router();

/** GET /api/health — Health check endpoint */
router.get("/", (_req, res) => {
  res.json({
    status: "ok",
    institute: "Royal Academy Faisalabad",
    domain: PRIMARY_DOMAIN,
    location: "Street 14, Farooqabad, Mansoorabad, Faisalabad, Punjab 38000, Pakistan",
    phone: "+92 329 0247580",
    timestamp: new Date().toISOString(),
    uptime: process.uptime()
  });
});

export default router;
