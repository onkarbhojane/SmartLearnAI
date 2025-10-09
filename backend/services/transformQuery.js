import dotenv from "dotenv";
dotenv.config();
import User from "../models/user.model.js";
import { Pinecone } from "@pinecone-database/pinecone";
import { GoogleGenerativeAIEmbeddings } from "@langchain/google-genai";
import { GoogleGenAI } from "@google/genai";

async function transformQuery(question, chatMessages) {
  const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

  const history = chatMessages.map((msg) => ({
    role: msg.role === "assistant" ? "model" : "user",
    parts: [{ text: msg.content }],
  }));

  const response = await ai.models.generateContent({
    model: "gemini-2.0-flash",
    contents: [
      ...history,
      { role: "user", parts: [{ text: question }] },
    ],
    config: {
      systemInstruction: `
        You are a query rewriting expert.
        Rewrite the user's question into a standalone question.
        Output ONLY the rewritten question.
      `,
    },
  });

  return response.text.trim();
}

export async function chatbotService(userId, pdfId, question) {
  try {
    const user = await User.findById(userId);
    if (!user) throw new Error("User not found");

    const pdf = user.study_materials.id(pdfId);
    if (!pdf) throw new Error("PDF not found for this user");

    const chatSession = pdf.chat_sessions[0] || { messages: [] };
    const chatMessages = chatSession.messages || [];

    // 1️⃣ Rewrite question
    const refinedQuestion = await transformQuery(question, chatMessages);

    // 2️⃣ Create embeddings
    const embeddings = new GoogleGenerativeAIEmbeddings({
      apiKey: process.env.GEMINI_API_KEY,
      model: "text-embedding-004",
    });
    const queryVector = await embeddings.embedQuery(refinedQuestion);

    // 3️⃣ Query Pinecone
    const pinecone = new Pinecone({ apiKey: process.env.PINECONE_API_KEY });
    const pineconeIndex = pinecone.Index(pdf.RAG_id);

    const searchResults = await pineconeIndex.query({
      topK: 5,
      vector: queryVector,
      includeMetadata: true,
    });

    // 🧠 Build context with citations
    const contextParts = searchResults.matches.map((m, i) => {
      const text = m.metadata?.text || m.metadata?.pageContent || "";
      const page = m.metadata?.page || "Unknown";
      const snippet = text.length > 250 ? text.slice(0, 250) + "..." : text;
      return `Source ${i + 1} (Page ${page}): "${snippet}"`;
    });

    const context = contextParts.join("\n---\n");

    // 4️⃣ Generate answer with citations
    const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
    const response = await ai.models.generateContent({
      model: "gemini-2.0-flash",
      contents: [
        ...chatMessages.map((msg) => ({
          role: msg.role === "assistant" ? "model" : "user",
          parts: [{ text: msg.content }],
        })),
        {
          role: "user",
          parts: [
            {
              text: `
Question: ${question}
Use the following context snippets from the PDF to answer. 
Cite the page numbers only like defination from [page 3].
Context:
${context}

If you cannot find the answer, say:
"I could not find the answer in the provided document."
              `,
            },
          ],
        },
      ],
    });

    const answer = response.text.trim();

    // 5️⃣ Append answer + citations to history
    chatMessages.push({ role: "user", content: question });
    chatMessages.push({ role: "assistant", content: answer });

    if (pdf.chat_sessions.length === 0) {
      pdf.chat_sessions.push({ messages: chatMessages });
    } else {
      pdf.chat_sessions[0].messages = chatMessages;
    }

    await user.save();

    return {
      refinedQuestion,
      answer,
      chatHistory: chatMessages,
      citations: contextParts, // optional: you can show these separately in frontend
    };
  } catch (err) {
    console.error("❌ chatbotService error:", err);
    throw err;
  }
}
