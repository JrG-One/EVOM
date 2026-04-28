const crypto = require("crypto");
const prisma = require("../lib/prisma");

const buildEventType = (method, path) => {
  const normalized = `${method}_${path.replace(/\//g, "_").replace(/[^a-zA-Z0-9_]/g, "").toUpperCase()}`;
  return normalized.slice(0, 80);
};

const userActivityTracker = async (req, res, next) => {
  try {
    if (!req.user?.id) {
      return next();
    }

    const rawIp = req.ip || req.headers["x-forwarded-for"] || "unknown";
    const ipHash = crypto.createHash("sha256").update(String(rawIp)).digest("hex");

    await prisma.userActivityLog.create({
      data: {
        userId: req.user.id,
        eventType: buildEventType(req.method, req.path),
        meta: {
          method: req.method,
          path: req.path,
          query: req.query,
        },
        ipHash,
      },
    });
    return next();
  } catch (error) {
    return next();
  }
};

module.exports = { userActivityTracker };
