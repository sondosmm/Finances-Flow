const express = require("express");
const router = express.Router();
const reportController = require("../controllers/reportController");
const auth = require("../middleware/auth");

router.get("/export/excel", auth, reportController.getMonthlyExcel);

module.exports=router