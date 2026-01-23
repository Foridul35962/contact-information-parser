import genAI from "../config/gemini.js";
import db from "../db.connect.js";

export const parser = async (req, res) => {
    try {
        const { text, llm } = req.body;
        if (!text) {
            return res.status(400).json({ success: false, message: "text are required" });
        }

        const model = genAI.getGenerativeModel({
            model: "gemini-2.5-flash-lite",
            systemInstruction: "You are a specialized data extractor. Your job is to extract contact details from text and return them in strictly valid JSON format."
        });

        const userPrompt = `Extract contact information from the following text: "${text}"
            Return a JSON object with these fields:
            - name: The person's full name (string or null)
            - email: The email address (string or null)
            - phone: The phone number (string or null)
            Return ONLY the JSON object, no other text.`;

        const result = await model.generateContent({
            contents: [{ role: "user", parts: [{ text: userPrompt }] }],
            generationConfig: {
                responseMimeType: "application/json",
            },
        });
        const response = await result.response;

        const reply = JSON.parse(response.text());

        const email = reply.email
        if (!email) {
            return res.status(400).json({ success: false, message: "email are required" });
        }

        const dbUser = await db.oneOrNone(
            `SELECT c.email, co.name as company_name 
             FROM contacts c 
             LEFT JOIN companies co ON c.company_id = co.company_id 
             WHERE c.email = $1`,
            [email]
        );

        // Final response structure
        const finalResponse = {
            name: reply.name,
            email: reply.email,
            phone: reply.phone,
            found_in_database: !!dbUser,
            company: dbUser ? dbUser.company_name : null
        };

        return res.json({ success: true, data: finalResponse });

    } catch (err) {
        console.error("Gemini API Error:", err);
        return res.status(500).json({
            success: false,
            error: err.message || "Something went wrong with Gemini",
        });
    }
};