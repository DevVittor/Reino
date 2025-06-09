import { rateLimit } from "express-rate-limit";

const rateLimitConfig = rateLimit({
  windowMs: 1 * 60 * 1000, // 1 minuto
  limit: 300, // até 300 requisições por IP por minuto
  standardHeaders: "draft-8",
  legacyHeaders: false,
  validate: { trustProxy: true },
});

export default rateLimitConfig;
