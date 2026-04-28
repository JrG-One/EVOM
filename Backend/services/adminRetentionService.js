const prisma = require("../lib/prisma");
const logger = require("../utils/logger");

let cleanupTimer = null;

const purgeExpiredActivityLogs = async () => {
  try {
    const retentionDays = parseInt(process.env.ADMIN_ACTIVITY_RETENTION_DAYS || "90", 10);
    const cutoff = new Date();
    cutoff.setDate(cutoff.getDate() - retentionDays);

    const result = await prisma.userActivityLog.deleteMany({
      where: { createdAt: { lt: cutoff } },
    });
    if (result.count > 0) {
      logger.info(`Purged ${result.count} user activity logs older than ${retentionDays} days`);
    }
  } catch (error) {
    logger.error("Failed to purge expired activity logs", { error: error.message });
  }
};

const startAdminRetentionJobs = () => {
  // Run once at startup and then every 24 hours.
  purgeExpiredActivityLogs();
  cleanupTimer = setInterval(purgeExpiredActivityLogs, 24 * 60 * 60 * 1000);
};

const stopAdminRetentionJobs = () => {
  if (cleanupTimer) {
    clearInterval(cleanupTimer);
    cleanupTimer = null;
  }
};

module.exports = {
  startAdminRetentionJobs,
  stopAdminRetentionJobs,
};
