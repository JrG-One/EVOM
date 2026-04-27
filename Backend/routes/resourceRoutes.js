const express = require("express");
const router = express.Router();
const resourceController = require("../controllers/resourceController"); 
const {requireAuth, isAdmin} = require("../middleware/auth.middleware");
const {featureToggle} = require("../middleware/featureToggle");
router.use(requireAuth);

router.get("/", resourceController.getAllResources);
router.post("/", isAdmin, featureToggle('ENABLE_FILE_UPLOADS'), resourceController.addResource);
router.put("/:id", isAdmin, featureToggle('ENABLE_FILE_UPLOADS'), resourceController.updateResource);
router.delete("/:id", isAdmin, resourceController.deleteResource);

module.exports = router;
