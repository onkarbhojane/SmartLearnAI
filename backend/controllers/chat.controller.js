import User from "../models/user.model.js";
import { chatbotService } from "../services/transformQuery.js";

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