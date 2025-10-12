import User from "../models/user.model.js";
import { chatbotService } from "../services/transformQuery.js";
import dotenv from "dotenv";
dotenv.config();
import { GoogleGenAI } from "@google/genai";
export const chat = async (req, res) => {
  try {
    const { documentId } = req.params;
    const userId = req.user.id;
    const { question } = req.body;
    // Find user and specific PDF material
    const user = await User.findOne(
      { _id: userId, "study_materials._id": documentId },
      { "study_materials.$": 1 } // projection: only matched study_material
    );

    if (!user || user.study_materials.length === 0) {
      return res.status(404).json({ message: "Document not found" });
    }

    const document = user.study_materials[0];
    // Ensure chat_sessions array exists
    if (!document.chat_sessions) document.chat_sessions = [];
    if (document.chat_sessions.length === 0)
      document.chat_sessions.push({ messages: [] });
    // Call chatbot service
    const { refinedQuestion, answer, chatHistory } = await chatbotService(
      userId,
      document._id,
      question
    );

    // Update chat session
    document.chat_sessions[0].messages = chatHistory;

    // Save the user document
    await User.updateOne(
      { _id: userId, "study_materials._id": documentId },
      { $set: { "study_materials.$.chat_sessions.0.messages": chatHistory } }
    );

    // Respond to client
    res.status(200).json({
      refinedQuestion,
      answer,
      chatHistory: chatHistory,
    });
  } catch (error) {
    console.error("❌ Chat error:", error);
    res
      .status(500)
      .json({ message: "Internal server error", error: error.message });
  }
};

// Controller to fetch or generate page summary
export const summaryDocument = async (req, res) => {
  try {
    const { documentId, pageNo } = req.params;
    console.log(documentId, pageNo);
    // 1️⃣ Fetch user
    const user = await User.findById(req.user.id);
    if (!user) return res.status(404).json({ message: "User not found" });

    // 2️⃣ Fetch PDF
    const pdf = user.study_materials.id(documentId);
    if (!pdf) return res.status(404).json({ message: "PDF not found" });

    // 3️⃣ Fetch page
    const page = pdf.pages.find((p) => p.pageNumber === parseInt(pageNo));
    if (!page) return res.status(404).json({ message: "Page not found" });

    // 4️⃣ If summary is empty, generate it using Gemini AI
    if (!page.summary || page.summary.trim() === "") {
      const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

      const response = await ai.models.generateContent({
        model: "gemini-2.0-flash",
        contents: [
          {
            role: "user",
            parts: [
              {
                text: `Summarize the following text concisely in a few sentences:\n\n${page.text}`,
              },
            ],
          },
        ],
      });

      const generatedSummary = response.text.trim();

      // Save generated summary to MongoDB
      page.summary = generatedSummary;
      await user.save();
    }

    // 5️⃣ Return summary
    res.status(200).json({
      message: "Summary fetched successfully",
      pageId: page._id,
      pageNumber: page.pageNumber,
      summary: page.summary,
    });
  } catch (error) {
    console.error("❌ Error fetching summary:", error);
    res.status(500).json({
      message: "Failed to fetch summary",
      error: error.message,
    });
  }
};


// Add to your chat controller
export const getChatHistory = async (req, res) => {
  try {
    const { documentId } = req.params;
    const userId = req.user.id;

    const user = await User.findOne(
      { _id: userId, "study_materials._id": documentId },
      { "study_materials.$": 1 }
    );

    if (!user || user.study_materials.length === 0) {
      return res.status(404).json({ message: "Document not found" });
    }

    const document = user.study_materials[0];
    const chatHistory = document.chat_sessions?.[0]?.messages || [];

    res.status(200).json({
      chatHistory,
      documentTitle: document.title
    });
  } catch (error) {
    console.error("❌ Get chat history error:", error);
    res.status(500).json({ message: "Internal server error", error: error.message });
  }
};

// Add to your chat controller
export const clearChat = async (req, res) => {
  try {
    const { documentId } = req.params;
    const userId = req.user.id;

    await User.updateOne(
      { _id: userId, "study_materials._id": documentId },
      { $set: { "study_materials.$.chat_sessions": [] } }
    );

    res.status(200).json({ message: "Chat cleared successfully" });
  } catch (error) {
    console.error("❌ Clear chat error:", error);
    res.status(500).json({ message: "Internal server error", error: error.message });
  }
};