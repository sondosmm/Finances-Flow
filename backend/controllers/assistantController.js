const asyncHandler = require('express-async-handler');
const  parseIntent  = require('../utils/intentParser');
const Groq = require("groq-sdk");
const fs = require('fs');
const ApiError = require('../utils/apiError');
const Expense = require('../models/expenseModel');
const User = require("../models/userModel");
const reportHelper = require("../utils/reportHelper");
const { toFile } = require('groq-sdk');

const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

const FriendlyReply = async (userMessage, data) => {
     
    const response = await groq.chat.completions.create({
      model: "llama-3.1-8b-instant",
      messages: [
        {
          role: "user",
          content: `You are a friendly personal finance assistant.
The user said: "${userMessage}"
Here is the relevant data: ${JSON.stringify(data)}
Reply based ONLY on the data provided. Do not assume or invent any information not present in the data.
Be concise and helpful.`,
        },
      ],
    });
    
   
    return response.choices[0].message.content.trim();
};

const handleAdd = async (parsed, userId) => {
    await Expense.create({
        userId,
        amount: parsed.amount,
        category: parsed.category,
        description: parsed.description,
        date: parsed.date? new Date(parsed.date) :new Date()
    });
    return { reply: `Done Added ${parsed.amount} for ${parsed.category}, ${parsed.description}` };
};

const handleRead = async (parsed, message, userId) => {
    const data = { userId }
    const filter = parsed.filters || {};
    if (filter.category)
        data.category = filter.category;
    if (filter.from || filter.to) data.date = {};
    if (filter.from)
        data.date.$gte = new Date(filter.from);
    if (filter.to)
        data.date.$lte = new Date(filter.to);

    const expenses = await Expense.find(data).sort({ date: -1 }).limit(50);
    const reply = await FriendlyReply(message, expenses);
    return { reply, expenses };
};

const handleReport = async (parsed, message, userId) => {
    const now = new Date();
    const month = parsed.month || now.getMonth() + 1;
    const year = parsed.year || now.getFullYear();
    const summary = await reportHelper.getSummary(userId, month,year);
    const reply = await FriendlyReply(message, summary);
    return { reply, summary };
}

const processMessage = async (message, userId) => {
    const parsed = await parseIntent(message);
     console.log("parsed intent:", JSON.stringify(parsed));
    if (parsed.intent === 'add')
        return handleAdd(parsed, userId);
    if (parsed.intent === "read")
        return handleRead(parsed, message, userId);
    if (parsed.intent === "report")
        return handleReport(parsed,message, userId);
    return {
        intent: 'unknown',
        reply: "I didn't understand. Try 'add 50 for food' or 'show this month expenses'."
    };
};

const transcribeAudio = async (file) => {
    try {
        const transcription = await groq.audio.transcriptions.create({
            file: await toFile(fs.createReadStream(file.path), file.originalname),
            model: "whisper-large-v3",
        });
        return transcription.text.trim();
    }
    catch (err) {
        throw new ApiError('Failed to transcribe audio', 500);
    }
    finally {
        if (file && file.path && fs.existsSync(file.path)) {
            fs.unlinkSync(file.path);
        }
    }
};

exports.chat = asyncHandler(async (req, res, next) => {
    const { message } = req.body;
    if (!message)
        return next(new ApiError("message is required", 400));
    
    const result = await processMessage(message, req.user.id);
    res.status(200).json(result);
});

exports.voiceChat = asyncHandler(async (req, res, next) => {
    if (!req.file)
        return next(new ApiError('audio file is required', 400));
    
    const message = await transcribeAudio(req.file);
    const result = await processMessage(message, req.user.id);
    res.status(200).json({ result, transcribed: message });
});