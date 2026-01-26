const ExcelJs = require('exceljs');
const fs = require('fs');
const path = require('path');
const ApiError = require('./apiError');
exports.generateExcel = async (summary) => {
    try {
        const workbook = new ExcelJs.Workbook;
    const sheet = workbook.addWorksheet("monthly report");

    sheet.columns = [
        { header: "Category", key: "category", width: 25 },
        {header:"Total",key:"total",width:20}
    ];

    sheet.getRow(1).font = { bold: true };


    summary.categories.forEach(cat => {
        sheet.addRow(
            {
                category: cat._id,
                total: cat.total
            }
        );
    });

    sheet.addRow({});
    sheet.addRow({ category: "Budget", total: summary.budget });
    sheet.addRow({ category: "Total Spent", total: summary.totalSpent });
    sheet.addRow({ category: "Remaining", total: summary.remaining });

    const exportDir = path.join(__dirname, '../exports');
    if (!fs.existsSync(exportDir))
        fs.mkdirSync(exportDir, { recursive: true });
    const filePath = path.join(exportDir, `report-${summary.month}.xlsx`);
    await workbook.xlsx.writeFile(filePath);
    return filePath;
    }
    catch (err) {
        throw new ApiError("Failed to Generate Excel File", 500);
    }
}
