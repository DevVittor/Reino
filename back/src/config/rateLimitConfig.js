import { rateLimit } from "express-rate-limit";

const rateLimitConfig = rateLimit({
  windowMs: 10 * 60 * 1000, // 10 minutes
  limit: 15, // Limit each IP to 15 requests per `window` (here, per 10 minutes).
  standardHeaders: "draft-8", // draft-6: `RateLimit-*` headers; draft-7 & draft-8: combined `RateLimit` header
  legacyHeaders: false, // Disable the `X-RateLimit-*` headers.
  validate: { trustProxy: false },
});
export default rateLimitConfig;
