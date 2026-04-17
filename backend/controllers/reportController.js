const excel = require('../utils/excel.js');
const reportHelper = require('../utils/reportHelper');
const fs = require('fs');
const asyncHandler = require('express-async-handler');


exports.getMonthlyExcel = asyncHandler(async (req, res, next) => {
    const { month, year } = req.query;

    const summary = await reportHelper.getSummary(req.user.id, month * 1, year * 1);

    const filePath = await excel.generateExcel(summary);
    res.download(filePath
        , () => { fs.unlinkSync(filePath) } 
    );
});
exports.getMonthlyReport = aysncHandler(async (req, res, next) => {
    const { month, year } = req.query;
    const summary = await reportHelper.getSummary(req.user.id, month * 1, year * 1);
    res.status(200).json({ summary });
    
})

exports.getYearlyReport = asyncHandler(async (req, res, next) => {
    const year = req.query.year;
    const summary =await reportHelper.getYearlySummary(req.user.id, year * 1);
    res.status(200).json({year,summary});

});