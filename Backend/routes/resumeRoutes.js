const express = require('express');
const {requireAuth} = require("../middleware/auth.middleware");
const {featureToggle} = require("../middleware/featureToggle");
const {calculateATS, getOverallComments, getImprovementTips, uploadResume} = require('../controllers/resumeController');

const router = express.Router();
const fileUpload = require('express-fileupload');
router.use(fileUpload());

// Toggle 'ENABLE_FILE_UPLOADS'
router.post('/ats-score', requireAuth, featureToggle('ENABLE_FILE_UPLOADS'), calculateATS);
router.post('/resume-feedback', requireAuth, featureToggle('ENABLE_FILE_UPLOADS'), getOverallComments);
router.post('/resume-improvement-tips', requireAuth, featureToggle('ENABLE_FILE_UPLOADS'), getImprovementTips);
router.put('/upload-resume', requireAuth, featureToggle('ENABLE_FILE_UPLOADS'), uploadResume);

module.exports = router;