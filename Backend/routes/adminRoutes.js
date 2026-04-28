const express = require("express");
const router = express.Router();
const {
  getDashboardStats,
  getAdminOverview,
  getAllUsers,
  updateUserRole,
  updateUserStatus,
  deleteUser,
  getAllInterviews,
  deleteInterview,
  getAllResources,
  createResource,
  updateResource,
  deleteResource,
  getFeatureFlags,
  upsertFeatureFlag,
  getUserActivityLogs,
  getCreditsSummary,
  getUserCredits,
  exportAdminReport,
} = require("../controllers/adminController");
const { requireAuth, isAdmin } = require("../middleware/auth.middleware");

// All admin routes require authentication and at least admin role
router.use(requireAuth);
router.use(isAdmin);

router.get("/overview", getAdminOverview);
router.get("/dashboard-stats", getDashboardStats); // backward-compatible endpoint

// User Management
router.get("/users", getAllUsers);
router.put("/users/role", updateUserRole);
router.patch("/users/:id", updateUserRole);
router.patch("/users/:id/status", updateUserStatus);
router.delete("/users/:userId", deleteUser);
router.get("/users/:id/activity-logs", getUserActivityLogs);
router.get("/users/:id/credits", getUserCredits);

// Interview Management
router.get("/interviews", getAllInterviews);
router.delete("/interviews/:id", deleteInterview);

// Resource Management
router.get("/resources", getAllResources);
router.post("/resources", createResource);
router.put("/resources/:id", updateResource);
router.delete("/resources/:id", deleteResource);

// Feature Toggles
router.get("/feature-flags", getFeatureFlags);
router.patch("/feature-flags/:key", upsertFeatureFlag);

// AI Credits
router.get("/credits/summary", getCreditsSummary);

// Exports
router.get("/exports/:type", exportAdminReport);

module.exports = router;
