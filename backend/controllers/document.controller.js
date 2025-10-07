import fs from "fs";
import path from "path";
import cloudinary from "../utils/cloudinary.js";
import User from "../models/user.model.js";
import { RecursiveCharacterTextSplitter } from "@langchain/textsplitters";
import { GoogleGenerativeAIEmbeddings } from "@langchain/google-genai";
import { Pinecone } from "@pinecone-database/pinecone";
import { PDFLoader } from "@langchain/community/document_loaders/fs/pdf";
import { PineconeStore } from "@langchain/pinecone";

// Upload PDF Controller
export const uploadDocument = async (req, res) => {
  try {
    const { title, description } = req.body;
    const filePath = req.file.path;

    // 1️⃣ Upload to Cloudinary
    const result = await cloudinary.uploader.upload(filePath, {
      resource_type: "auto",
      folder: "smartlearnai/pdfs",
    });

    // 2️⃣ Sanitize file name for Pinecone
    const fileName = path
      .basename(filePath, path.extname(filePath))
      .toLowerCase()
      .replace(/[^a-z0-9-]/g, "-"); // replace invalid chars with '-'

    const indexName = `${fileName}-${Date.now()}`;
    console.log(`📦 Creating new Pinecone index: ${indexName}`);

    // 3️⃣ Load PDF
    const pdfLoader = new PDFLoader(filePath);
    const rawDocs = await pdfLoader.load();
    console.log("✅ PDF loaded");

    // 4️⃣ Split into chunks
    const textSplitter = new RecursiveCharacterTextSplitter({
      chunkSize: 1000,
      chunkOverlap: 200,
    });
    const chunkedDocs = await textSplitter.splitDocuments(rawDocs);
    console.log(`✅ Chunking completed: ${chunkedDocs.length} chunks`);

    // 5️⃣ Configure embeddings (Gemini)
    const embeddings = new GoogleGenerativeAIEmbeddings({
      apiKey: process.env.GEMINI_API_KEY,
      model: "text-embedding-004",
    });
    console.log("✅ Embedding model configured");

    // 6️⃣ Connect to Pinecone
    const pinecone = new Pinecone({ apiKey: process.env.PINECONE_API_KEY });

    // 7️⃣ Create Pinecone index
    const dimension = 768; // for Gemini 'text-embedding-004'
    await pinecone.createIndex({
      name: indexName,
      dimension: dimension,
      metric: "cosine",
      spec: { serverless: { cloud: "aws", region: "us-east-1" } },
    });
    console.log("⏳ Waiting for Pinecone index to be ready...");
    await new Promise((r) => setTimeout(r, 10000));

    const pineconeIndex = pinecone.Index(indexName);
    console.log(`✅ Pinecone index ready: ${indexName}`);

    // 8️⃣ Store chunks in Pinecone
    await PineconeStore.fromDocuments(chunkedDocs, embeddings, {
      pineconeIndex,
      maxConcurrency: 5,
    });
    console.log(`✅ PDF chunks stored successfully in Pinecone`);

    // 9️⃣ Delete local file
    fs.unlinkSync(filePath);

    // 🔟 Add PDF to user's study_materials
    const user = await User.findById(req.user.id);
    if (!user) return res.status(404).json({ msg: "User not found" });

    user.study_materials.push({
      title,
      description,
      pdfUrl: result.secure_url,
      quiz_attempts: [],
      chat_sessions: [],
      RAG_id: indexName,
    });

    await user.save();

    res.status(200).json({
      msg: "PDF uploaded successfully",
      study_materials: user.study_materials,
    });
  } catch (error) {
    console.error("PDF upload error:", error);
    res.status(500).json({ success: false, message: "Server Error", error });
  }
};

// Get User Documents
export const getUserDocuments = async (req, res) => {
  try {
    const userId = req.user.id;
    const documents = await User.findById(userId).select("study_materials");
    res.json({ success: true, documents });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: "Server Error" });
  }
};

// Delete Document
export const deleteDocument = async (req, res) => {
  try {
    const userId = req.user.id;
    const { id } = req.params;

    const document = await Document.findOne({ _id: id, user: userId });
    if (!document)
      return res
        .status(404)
        .json({ success: false, message: "Document not found" });

    // Remove file from uploads folder
    fs.unlinkSync(path.join("uploads", path.basename(document.fileUrl)));

    await document.deleteOne();
    res.json({ success: true });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: "Server Error" });
  }
};


export const getStudyMaterials = async (req, res) => {
  try {
    console.log(req.params.id);
    const user = await User.findById(req.params.id)
      .select('name email study_materials progress chat_sessions');
    if (!user) return res.status(404).json({ message: 'User not found' });
    res.json(user);
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
}