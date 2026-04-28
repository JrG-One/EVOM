const prisma = require("../lib/prisma");

const featureToggle = (featureName) => {
  return async (req, res, next) => {
    try {
      const dbFlag = await prisma.featureFlag.findUnique({
        where: { key: featureName },
        select: { enabled: true },
      });

      // Backward-compatible fallback to env if DB flag doesn't exist yet.
      const fallbackEnabled = process.env[featureName] !== "false";
      const isEnabled = dbFlag ? dbFlag.enabled : fallbackEnabled;

      if (!isEnabled) {
        return res.status(403).json({
          error: "This feature is currently disabled.",
          code: "FEATURE_DISABLED",
        });
      }
      return next();
    } catch (error) {
      return res.status(500).json({
        error: "Feature flag check failed",
        code: "FEATURE_FLAG_ERROR",
      });
    }
  };
};

module.exports = { featureToggle };
