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
        Based on the chat history, rewrite the user's question into a standalone question.
        Only output the rewritten question.
      `,
    },
  });

  return response.text.trim();
}

export async function chatbotService(userId, pdfId, question) {
  try {
    const user = await User.findById(userId);
    if (!user) throw new Error("User not found");
    // Find the specific PDF material
    const pdf = user.study_materials.id(pdfId);
    if (!pdf) throw new Error("PDF not found for this user");
    // console.log("PDF found:", pdf.title);

    const chatSession = pdf.chat_sessions[0] || { messages: [] };
    const chatMessages = chatSession.messages || [];

    // Step 1: Rewrite question
    const refinedQuestion = await transformQuery(question, chatMessages);
    // console.log("Refined question:", refinedQuestion);
    // Step 2: Create embeddings
    const embeddings = new GoogleGenerativeAIEmbeddings({
      apiKey: process.env.GEMINI_API_KEY,
      model: "text-embedding-004",
    });
    const queryVector = await embeddings.embedQuery(refinedQuestion);

    // console.log("Query vector:", queryVector);
    // Step 3: Query Pinecone using RAG_id
    const pinecone = new Pinecone({ apiKey: process.env.PINECONE_API_KEY });
    const pineconeIndex = pinecone.Index(pdf.RAG_id);

    const searchResults = await pineconeIndex.query({
      topK: 10,
      vector: queryVector,
      includeMetadata: true,
    });

    // console.log("Search results:", searchResults);
    const context = searchResults.matches
      .map((m) => m.metadata?.text || "")
      .join("\n---\n");

    // Step 4: Generate answer
    const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
    const response = await ai.models.generateContent({
      model: "gemini-2.0-flash",
      contents: [
        ...chatMessages.map((msg) => ({
          role: msg.role === "assistant" ? "model" : "user",
          parts: [{ text: msg.content }],
        })),
        { role: "user", parts: [{ text: question }] },
      ],
      config: {
        systemInstruction: `
          You are a helpful teacher.
          Use ONLY the provided context.
          If the answer isn't in context, say: "I could not find the answer in the provided document."
          Be concise and educational.
          Context: ${context}
        `,
      },
    });

    const answer = response.text.trim();
    // console.log("Answer:", answer);
    // Step 5: Save messages to DB
    chatMessages.push({
      role: "user",
      content: question,
    });
    chatMessages.push({
      role: "assistant",
      content: answer,
    });

    // console.log("Chat messages:", chatMessages);

    if (pdf.chat_sessions.length === 0) {
      pdf.chat_sessions.push({ messages: chatMessages });
    } else {
      pdf.chat_sessions[0].messages = chatMessages;
    }

    // console.log("Updated chat sessions:", pdf.chat_sessions);
    await user.save();

    return { refinedQuestion, answer, chatHistory: chatMessages };
  } catch (err) {
    console.error("❌ chatbotService error:", err);
    throw err;
  }
}
