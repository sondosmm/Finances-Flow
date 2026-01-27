const express = require("express");
const router = express.Router();
const reportController = require("../controllers/reportController");
const auth = require("../middleware/auth");


const validate = require('../middleware/validateMiddleware');
const { monthlyReportSchema } = require('../validators/reportValidator');

router.get("/export/excel", auth, validate(monthlyReportSchema), reportController.getMonthlyExcel);

module.exports=router