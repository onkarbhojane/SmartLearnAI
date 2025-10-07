import { PDFLoader } from "@langchain/community/document_loaders/fs/pdf";
import { RecursiveCharacterTextSplitter } from "@langchain/textsplitters";
import { GoogleGenerativeAIEmbeddings } from "@langchain/google-genai";
import { Pinecone } from "@pinecone-database/pinecone";
import { PineconeStore } from "@langchain/pinecone";
import dotenv from "dotenv";
dotenv.config();

async function indexDocument() {
  // 📄 Step 1: PDF Path
  const PDF_PATH = "./gate.pdf"; // change this to your new PDF each time

  // Extract filename (for index naming)
  const fileName = PDF_PATH.split("/").pop().split(".")[0];
  const indexName = `${fileName.toLowerCase()}-${Date.now()}`; // unique index name
  console.log(`📦 Creating new index: ${indexName}`);

  // 🧠 Step 2: Load PDF
  const pdfLoader = new PDFLoader(PDF_PATH);
  const rawDocs = await pdfLoader.load();
  console.log("✅ PDF loaded");

  // ✂️ Step 3: Split into chunks
  const textSplitter = new RecursiveCharacterTextSplitter({
    chunkSize: 1000,
    chunkOverlap: 200,
  });
  const chunkedDocs = await textSplitter.splitDocuments(rawDocs);
  console.log(`✅ Chunking completed: ${chunkedDocs.length} chunks`);

  // 🔤 Step 4: Configure Embeddings (Gemini)
  const embeddings = new GoogleGenerativeAIEmbeddings({
    apiKey: process.env.GEMINI_API_KEY,
    model: "text-embedding-004",
  });
  console.log("✅ Embedding model configured");

  // 🧱 Step 5: Connect to Pinecone
  const pinecone = new Pinecone({ apiKey: process.env.PINECONE_API_KEY });

  // 🔢 Step 6: Create new index
  const dimension = 768; // for Gemini 'text-embedding-004'
  await pinecone.createIndex({
    name: indexName,
    dimension: dimension,
    metric: "cosine",
    spec: { serverless: { cloud: "aws", region: "us-east-1" } },
  });
  console.log("⏳ Waiting for index to be ready...");
  await new Promise((r) => setTimeout(r, 10000));

  const pineconeIndex = pinecone.Index(indexName);
  console.log(`✅ Pinecone index ready: ${indexName}`);

  // 📥 Step 7: Store chunks
  await PineconeStore.fromDocuments(chunkedDocs, embeddings, {
    pineconeIndex,
    maxConcurrency: 5,
  });
  console.log(`✅ Data stored successfully in index: ${indexName}`);

  return indexName;
}

indexDocument()
  .then((indexName) => {
    console.log(`🎉 Done! Your PDF is indexed at: ${indexName}`);
  })
  .catch((err) => console.error("❌ Error:", err));
