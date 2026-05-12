const express = require('express');
const router = express.Router();
const { getWeeklyReport, getMonthlyReport, getBMI } = require('../controllers/reportController');
const { protect } = require('../middleware/auth');

router.use(protect);
router.get('/weekly', getWeeklyReport);
router.get('/monthly', getMonthlyReport);
router.get('/bmi', getBMI);

module.exports = router;
