// backend/services/quizService.js
import User from "../models/user.model.js";
import { Pinecone } from "@pinecone-database/pinecone";
import { GoogleGenerativeAIEmbeddings } from "@langchain/google-genai";
import { GoogleGenAI } from "@google/genai";

export async function generateQuizService(userId, pdfId, quizType = "multiple-choice", numQuestions = 5) {
  try {
    // 1️⃣ Fetch user and PDF
    const user = await User.findById(userId);
    if (!user) throw new Error("User not found");

    const pdf = user.study_materials.id(pdfId);
    if (!pdf) throw new Error("PDF not found for this user");
    if (!pdf.RAG_id) throw new Error("RAG database not set for this PDF");

    // 2️⃣ Retrieve content from Pinecone
    const embeddings = new GoogleGenerativeAIEmbeddings({
      apiKey: process.env.GEMINI_API_KEY,
      model: "text-embedding-004",
    });

    const queryVector = await embeddings.embedQuery("Generate quiz questions from this document");
    const pinecone = new Pinecone({ apiKey: process.env.PINECONE_API_KEY });
    const pineconeIndex = pinecone.Index(pdf.RAG_id);

    const searchResults = await pineconeIndex.query({
      topK: 10,
      vector: queryVector,
      includeMetadata: true,
    });

    const chunks = searchResults.matches.map(m => m.metadata?.text || m.metadata?.pageContent || "");
    const context = chunks.join("\n\n");

    // 3️⃣ Generate quiz using Google Gemini LLM
    const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
    const prompt = `
You are an expert quiz generator. Generate ${numQuestions} ${quizType} questions 
based on the following document content. 

${context}

Format the output as JSON array:
[
  {
    "question": "<question_text>",
    "options": ["Option A", "Option B", "Option C", "Option D"], // for multiple-choice only
    "correctAnswer": "<correct_option_or_answer>",
    "explanation": "<optional_explanation>"
  }
]
`;

    const response = await ai.models.generateContent({
      model: "gemini-2.0-flash",
      contents: [{ role: "user", parts: [{ text: prompt }] }],
    });

    // 4️⃣ Safely parse JSON from LLM output
    let jsonText = response.text.trim();
    jsonText = jsonText.replace(/```json/g, "").replace(/```/g, "").trim();
    const start = jsonText.indexOf("[");
    const end = jsonText.lastIndexOf("]") + 1;
    if (start === -1 || end === -1) throw new Error("No JSON array found in LLM output");

    const quiz = JSON.parse(jsonText.slice(start, end));

    // 5️⃣ Save empty quiz attempt (for tracking answers later)
    if (!pdf.quiz_attempts) pdf.quiz_attempts = [];
    pdf.quiz_attempts.push({
      totalQuestions: numQuestions,
      answers: quiz.map(q => ({
        question: q.question,
        userAnswer: "",
        correctAnswer: q.correctAnswer,
        isCorrect: null,
        explanation: q.explanation || "",
      })),
      attemptedAt: new Date(),
    });

    await user.save();

    return quiz;
  } catch (err) {
    console.error("❌ generateQuizService error:", err);
    throw err;
  }
}
