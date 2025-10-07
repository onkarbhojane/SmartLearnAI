import Document from "../models/document.model.js";
import Chat from "../models/Chat.model.js";
import User from "../models/user.model.js";
export const getUserDocuments = async (req, res) => {
  try {
    const { documentId } = req.params;
    const userId = req.user.id;
-    console.log("Fetching document for user:", documentId);
    // Find user with matching material _id
    const user = await User.findOne(
      { _id: userId, "study_materials._id": documentId },
      { "study_materials.$": 1 } // projection to return only matched material
    );

    if (!user || user.study_materials.length === 0) {
      return res.status(404).json({ message: "Document not found" });
    }

    const document = user.study_materials[0];

    res.status(200).json({
      message: "Document fetched successfully",
      document,
    });
  } catch (error) {
    console.error("❌ Error fetching user document:", error);
    res.status(500).json({
      message: "Error fetching document",
      error: error.message,
    });
  }
};

// ✅ Fetch all chat sessions for a document
export const getDocumentChats = async (req, res) => {
  try {
    const { userId, documentId } = req.params;
    const chat = await Chat.findOne({ user: userId, document: documentId });
    res.json(chat ? chat.messages : []);
  } catch (error) {
    res.status(500).json({ message: "Error fetching chats", error });
  }
};

// ✅ Add a new chat message
export const addChatMessage = async (req, res) => {
  try {
    const { userId, documentId } = req.params;
    const { role, content } = req.body;

    let chat = await Chat.findOne({ user: userId, document: documentId });

    if (!chat) {
      chat = new Chat({ user: userId, document: documentId, messages: [] });
    }

    chat.messages.push({ role, content });
    await chat.save();

    res.json(chat.messages);
  } catch (error) {
    res.status(500).json({ message: "Error saving chat", error });
  }
};

// ✅ Delete chat history
export const deleteDocumentChats = async (req, res) => {
  try {
    const { userId, documentId } = req.params;
    await Chat.deleteOne({ user: userId, document: documentId });
    res.json({ message: "Chat deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Error deleting chat", error });
  }
};
