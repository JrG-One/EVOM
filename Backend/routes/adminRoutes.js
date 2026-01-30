const express = require("express");
const router = express.Router();
const {
    getDashboardStats,
    getAllUsers,
    updateUserRole,
    deleteUser,
    getAllInterviews,
    deleteInterview,
    getAllResources,
    createResource,
    updateResource,
    deleteResource
} = require("../controllers/adminController");
const { requireAuth, isSuperAdmin } = require("../middleware/auth.middleware");

// All admin routes require authentication and super admin role
router.use(requireAuth);
router.use(isSuperAdmin);

router.get("/dashboard-stats", getDashboardStats);

// User Management
router.get("/users", getAllUsers);
router.put("/users/role", updateUserRole);
router.delete("/users/:userId", deleteUser);

// Interview Management
router.get("/interviews", getAllInterviews);
router.delete("/interviews/:id", deleteInterview);

// Resource Management
router.get("/resources", getAllResources);
router.post("/resources", createResource);
router.put("/resources/:id", updateResource);
router.delete("/resources/:id", deleteResource);

module.exports = router;
