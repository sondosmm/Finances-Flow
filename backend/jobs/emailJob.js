const email = require('../utils/email');
const excel = require("../utils/excel");
const reportHelper = require("../utils/reportHelper");
const User = require('../models/userModel');
const cron = require('node-cron');

const reportJob=async () => {
    const users = await User.find();
    const now = new Date();
    let month = now.getMonth();
    let year = now.getFullYear();
    if (month === 0)
    {
        month = 12;
        year = year - 1;
    }
    for (const user of users)
    {
        const summary = await reportHelper.getSummary(user._id, month, year);
        const filePath = await excel.generateExcel(summary);
        await email.sendEmail({
            to: user.email,
            subject: `Your ${year}-${month} Finance Report`,
            html: `<h2>Monthly Report</h2>
            <p>Total Spent : ${summary.totalSpent}</p>
            <p>Remaining : ${summary.remaining}</p>`,
            attachments: [{
                filename:"monthly-report.xlsx",
                path: filePath
            }]
        });
    }
};


cron.schedule("0 0 1 * *", reportJob);

reportJob();