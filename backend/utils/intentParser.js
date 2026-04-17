const Groq = require('groq-sdk');

const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

const parseIntent = async(message) => {
    const prompt = `You are a finance assistant intent parser. Given a user message, return ONLY a JSON object, no explanation, no markdown.

Valid categories: Food, Transport, Bills, Health, Entertainment, Shopping, Other



Rules:
1. If user wants to ADD an expense:
{"intent":"add","amount":50,"category":"Food","description":"lunch","date":"2026-04-11"}
if no date mentioned, use today:${new Date().toISOString().split("T")[0]} 
2. If user wants to READ/LIST expenses (with optional filters):
{"intent":"read","filters":{"category":"Food","from":"2026-04-01","to":"2026-04-30","minAmount":null,"maxAmount":null}}
- from/to must be ISO date strings or null
- Resolve relative dates like "this month", "last week" to actual dates based on today
- All filter fields are optional, use null if not mentioned

3. If user wants a SUMMARY or REPORT (total spent, remaining budget, breakdown):
{"intent":"report"}
- extract month and year from what the user says
- if no month mentioned use current month

- if no year mentioned use current year: ${new Date().getFullYear()}

4. If unclear:
{"intent":"unknown"}

User message: "${message}"

`;
    const response = await groq.chat.completions.create({
      model: "llama-3.1-8b-instant",
        messages: [{ role: 'user', content: prompt }],
        temperature:0
    });
    
    const text = response.choices[0].message.content.trim();
    try {
        return JSON.parse(text);
    }
    catch (_) {
        return { intent: 'unknown' };
    }
};

module.exports = parseIntent;