import { NextFunction, Response, Request } from "express";
import rateLimit from "express-rate-limit";

const rateLimiter = ({
  seconds = 60,
  max = 100,
}: {
  seconds?: number;
  max?: number;
}) =>
  process.env.NODE_ENV === "production"
    ? rateLimit({
        windowMs: seconds * 1000, // time window for rate limit
        max: max, // max requests in set time window
        statusCode: 429,
      })
    : (req: Request, res: Response, next: NextFunction) => next();

export default rateLimiter;
