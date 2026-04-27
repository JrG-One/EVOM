const path = require("path");
require("dotenv").config({ path: path.join(__dirname, "../.env") });
const express = require("express");
const app = express();
const bodyParser = require("body-parser");
const interviewRoutes = require("./routes/interviewRoutes");
const userRoutes = require("./routes/userRoute");
const verifyRoutes = require("./routes/verify");
const resourceRoutes = require("./routes/resourceRoutes");
const forgetPassRoute = require("./routes/forgetPassRoute");
const portalRoute = require("./routes/portal");
const resumeRoutes = require("./routes/resumeRoutes");
const chatRoutes = require("./routes/chatRoutes");
const codeRoutes = require("./routes/codeRoutes");
const adminRoutes = require("./routes/adminRoutes");
const logger = require("./utils/logger");
const helmet = require("helmet");
const rateLimit = require("express-rate-limit");

const cookieParser = require("cookie-parser");
const cors = require("cors");
// const { connect } = require("./db/connect"); // Removed MongoDB

const PORT = process.env.PORT || 3000;

app.set('trust proxy', 1);

app.use(helmet());

const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, 
  max: 100, 
  message: { error: 'Too many requests, please try again later.' },
  standardHeaders: true,
  legacyHeaders: false,
});
app.use('/api/', apiLimiter);

app.use(bodyParser.urlencoded({ extended: true, limit: '5mb' }));
app.use(express.static("public"));
app.use(express.json({ limit: '5mb' }));
app.use(cookieParser());

const allowedOrigins = [
  "http://localhost:5173",
  process.env.FRONTEND_URL,
].filter(Boolean);

app.use(
  cors({
    origin: (origin, callback) => {
      if (!origin || allowedOrigins.includes(origin) || origin.endsWith(".amplifyapp.com")) {
        callback(null, true);
      } else {
        callback(new Error("Not allowed by CORS"));
      }
    },
    credentials: true,
  }),
);

// mongodb connection
// connect(); // Removed

app.use((req, res, next) => {
  logger.info(`${req.method} ${req.path}`);
  next();
});

app.use("/api/reset", forgetPassRoute);
app.use("/api/user", userRoutes);
app.use("/api/verify", verifyRoutes);
app.use("/api/interview", interviewRoutes);
app.use("/api/resources", resourceRoutes);
app.use("/api/portal", portalRoute);
app.use("/api/resume", resumeRoutes);
app.use("/api", chatRoutes);
app.use("/api/code", codeRoutes);
app.use("/api/admin", adminRoutes);


app.get("/", (req, res) => {
  res.send("Entervue Backend (PostgreSQL) - Production Ready");
});

// ─── Global Error Handler ───────────────────────────────────────
app.use((err, req, res, next) => {
  logger.error(`Error: ${err.message}`, { stack: err.stack, path: req.path });
  
  const statusCode = err.statusCode || 500;
  const message = err.message || 'Internal Server Error';
  const code = err.code || 'INTERNAL_ERROR';

  res.status(statusCode).json({
    error: message,
    code: code
  });
});

app.listen(PORT, () => {
  logger.info(`Server is running on port ${PORT}`);
});

// ─── Graceful Shutdown ───────────────────────────────────────────
// Close RAG service connection pool on shutdown
const { closePool } = require("./services/ragService");

process.on("SIGTERM", async () => {
  logger.info("SIGTERM received. Closing connections...");
  await closePool();
  process.exit(0);
});

process.on("SIGINT", async () => {
  logger.info("SIGINT received. Closing connections...");
  await closePool();
  process.exit(0);
});
