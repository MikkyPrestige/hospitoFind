import rateLimit from "express-rate-limit";
import { logEvents } from "./logger.js";

const loginLimiter = rateLimit({
  windowMs: 60 * 1000,
  max: 5,
  message: { message: "Too many login attempts from this IP, please try again after 60 seconds" },
  handler: (req, res, options) => {
    // `${req.ip} reached login limit`
    logEvents(`Too Many Requests: ${options.message.message}\t${req.method}\t${req.url}\t${req.headers.origin}`, 'loginLimit.log')
    res.status(options.statusCode).send(options.message)
  },
  standardHeaders: true,
  legacyHeaders: false,
  skipFailedRequests: true,
});

export default loginLimiter;
