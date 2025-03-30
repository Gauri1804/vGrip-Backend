import mongoose from "mongoose";

const QuizSchema = new mongoose.Schema({
    course: { type: mongoose.Schema.Types.ObjectId, ref: "Course", required: true },
    title: { type: String, required: true },
    questions: [
        {
            question: { type: String, required: true },
            options: [{ type: String, required: true }],
            correctAnswer: { type: String, required: true },
        },
    ],
    createdAt: { type: Date, default: Date.now },
});

export const Quiz = mongoose.model("Quiz", QuizSchema);

