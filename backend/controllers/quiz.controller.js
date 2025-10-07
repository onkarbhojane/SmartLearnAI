import User from "../models/user.model.js";

export const saveQuizAttempt = async (req, res) => {
  try {
    const userId = req.user.id;
    const { pdfId, score, totalQuestions, answers } = req.body;

    const user = await User.findById(userId);

    user.quiz_attempts.push({
      pdf: pdfId,
      score,
      totalQuestions,
      answers
    });

    // update progress
    const total = user.progress.totalQuizzes + 1;
    const avg = (user.progress.averageScore * user.progress.totalQuizzes + score) / total;
    user.progress.totalQuizzes = total;
    user.progress.averageScore = avg;

    await user.save();

    res.json({ msg: "Quiz attempt saved", progress: user.progress });
  } catch (err) {
    res.status(500).json({ msg: err.message });
  }
};
