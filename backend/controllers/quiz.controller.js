import User from "../models/user.model.js";
import { generateQuizService } from "../services/quizService.js";

/**
 * 🧠 Helper: Format quiz questions based on type
 */
const formatQuizData = (quizType, quizArray) => {
  return quizArray.map((q) => {
    const base = {
      question: q.question,
      userAnswer: "",
      isCorrect: false,
      explanation: q.explanation || "",
    };

    if (quizType === "mcq") {
      return {
        ...base,
        options: q.options || [],
        correctAnswer: q.correctAnswer || "",
      };
    } else {
      // SAQ or LAQ (no options)
      return {
        ...base,
        correctAnswer: q.correctAnswer || "",
      };
    }
  });
};

/**
 * Get total number of quizzes for dashboard
 */
export const getAllQuizzesNum = async (req, res) => {
  try {
    const userId = req.user.id;

    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ message: "User not found" });

    const numQuizzes = user.study_materials.reduce((total, pdf) => {
      return total + (pdf.quizzes?.length || 0);
    }, 0);

    res.status(200).json({
      message: "Number of quizzes fetched successfully",
      numQuizzes,
    });
  } catch (err) {
    console.error("❌ getAllQuizzesNum error:", err);
    res.status(500).json({
      message: "Failed to fetch number of quizzes",
      error: err.message,
    });
  }
};

/**
 * Get comprehensive dashboard data
 */
export const getDashboardData = async (req, res) => {
  try {
    const userId = req.user.id;

    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ message: "User not found" });

    // Calculate total quizzes attempted
    let totalQuizzesAttempted = 0;
    let totalScore = 0;
    let totalStudyMaterials = user.study_materials.length;
    let totalChatSessions = 0;
    const recentActivities = [];

    // Process each study material
    user.study_materials.forEach(material => {
      // Count chat sessions
      totalChatSessions += material.chat_sessions?.length || 0;

      // Process quizzes
      material.quizzes?.forEach(quiz => {
        if (quiz.isAttempted) {
          totalQuizzesAttempted++;
          totalScore += quiz.score || 0;
          
          // Add to recent activities
          recentActivities.push({
            id: quiz._id,
            type: "quiz",
            title: `Quiz: ${material.title}`,
            score: `${quiz.score}%`,
            time: quiz.attemptedAt,
            documentId: material._id
          });
        }
      });

      // Add document upload as activity
      recentActivities.push({
        id: material._id,
        type: "document",
        title: `Uploaded: ${material.title}`,
        time: material.uploadedAt,
      });

      // Add chat sessions as activities
      material.chat_sessions?.forEach(session => {
        recentActivities.push({
          id: session._id,
          type: "chat",
          title: "AI Tutor Session",
          time: session.messages?.[0]?.timestamp || new Date(),
        });
      });
    });

    // Calculate average score
    const averageScore = totalQuizzesAttempted > 0 ? Math.round(totalScore / totalQuizzesAttempted) : 0;

    // Sort recent activities by time (newest first) and limit to 6
    const sortedActivities = recentActivities
      .sort((a, b) => new Date(b.time) - new Date(a.time))
      .slice(0, 6);

    res.status(200).json({
      message: "Dashboard data fetched successfully",
      data: {
        user: {
          name: user.name,
          email: user.email_id
        },
        stats: {
          totalQuizzesAttempted,
          averageScore,
          totalStudyMaterials,
          totalChatSessions,
          strengths: user.progress?.strengths || [],
          weaknesses: user.progress?.weaknesses || []
        },
        study_materials: user.study_materials,
        recentActivities: sortedActivities
      }
    });
  } catch (err) {
    console.error("❌ getDashboardData error:", err);
    res.status(500).json({
      message: "Failed to fetch dashboard data",
      error: err.message,
    });
  }
};

/**
 * 1️⃣ Get the latest quiz for a specific PDF
 */
export const getLatestQuiz = async (req, res) => {
  try {
    const { documentId } = req.params;
    const userId = req.user.id;

    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ message: "User not found" });

    const pdf = user.study_materials.id(documentId);
    if (!pdf) return res.status(404).json({ message: "PDF not found" });

    const latestQuiz = pdf.quizzes?.[0] || null;
    if (!latestQuiz)
      return res.status(404).json({ message: "No quiz found for this PDF" });

    res.status(200).json({
      message: "Latest quiz fetched successfully",
      quiz: latestQuiz,
    });
  } catch (err) {
    console.error("❌ getLatestQuiz error:", err);
    res.status(500).json({
      message: "Failed to fetch latest quiz",
      error: err.message,
    });
  }
};

/**
 * 2️⃣ Generate a new quiz (MCQ, SAQ, or LAQ)
 */
export const generateQuiz = async (req, res) => {
  try {
    const { documentId } = req.params;
    const { quizType = "mcq", numQuestions = 5 } = req.body;
    const userId = req.user.id;

    // Generate quiz content using your service
    const quizData = await generateQuizService(userId, documentId, quizType, numQuestions);

    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ message: "User not found" });

    const pdf = user.study_materials.id(documentId);
    if (!pdf) return res.status(404).json({ message: "PDF not found" });

    // Create formatted quiz object
    const newQuiz = {
      quizType,
      totalQuestions: quizData.length,
      score: 0,
      isAttempted: false,
      answers: formatQuizData(quizType, quizData),
      attemptedAt: new Date(),
    };

    // ✅ Push new quiz into existing array instead of replacing
    pdf.quizzes.push(newQuiz);
    await user.save();

    console.log("✅ Quiz generated successfully", newQuiz);
    res.status(200).json({
      message: `${quizType.toUpperCase()} quiz generated successfully`,
      quiz: newQuiz,
    });
  } catch (err) {
    console.error("❌ generateQuiz error:", err);
    res.status(500).json({
      message: "Quiz generation failed",
      error: err.message,
    });
  }
};

/**
 * 3️⃣ Save or update a quiz attempt
 */
export const saveQuizAttempt = async (req, res) => {
  try {
    const { documentId, quizId } = req.params;
    const { answers, score } = req.body;
    const userId = req.user.id;

    if (!answers || typeof score !== "number") {
      return res.status(400).json({ message: "Invalid answers or score" });
    }

    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ message: "User not found" });

    const pdf = user.study_materials.id(documentId);
    if (!pdf) return res.status(404).json({ message: "Document not found" });

    // Find the quiz to update
    const quiz = pdf.quizzes.id(quizId);
    if (!quiz) return res.status(404).json({ message: "Quiz not found" });

    // Update quiz attempt
    quiz.answers = answers.map((a) => ({
      ...a,
      isAttempted: true,
    }));
    quiz.score = score;
    quiz.attemptedAt = new Date();
    quiz.isAttempted = true;

    // ✅ Update progress stats
    const totalPrevQuizzes = user.progress.totalQuizzes || 0;
    const prevAvg = user.progress.averageScore || 0;

    // New average = ((oldAverage * count) + newScore) / (count + 1)
    const newTotal = totalPrevQuizzes + 1;
    const newAvg = ((prevAvg * totalPrevQuizzes) + score) / newTotal;

    user.progress.totalQuizzes = newTotal;
    user.progress.averageScore = parseFloat(newAvg.toFixed(2));

    await user.save();

    return res.status(200).json({
      message: "✅ Quiz attempt saved successfully",
      quiz,
      progress: user.progress,
    });
  } catch (err) {
    console.error("❌ saveQuizAttempt error:", err);
    return res.status(500).json({
      message: "Saving quiz attempt failed",
      error: err.message,
    });
  }
};


/**
 * 4️⃣ Get all quizzes for a specific document
 */
export const getAllQuizzes = async (req, res) => {
  try {
    const { documentId } = req.params;
    const userId = req.user.id;

    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ msg: "User not found" });

    const pdf = user.study_materials.id(documentId);
    if (!pdf) return res.status(404).json({ msg: "PDF not found" });

    const quizzes = pdf.quizzes || [];

    res.status(200).json({
      msg: "Quizzes fetched successfully",
      quizzes,
    });
  } catch (error) {
    console.error("❌ Error fetching all quizzes:", error);
    res.status(500).json({
      msg: "Failed to fetch quizzes",
      error: error.message,
    });
  }
};