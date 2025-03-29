import mongoose from "mongoose";

const LessonSchema = new mongoose.Schema({
    course: { type: mongoose.Schema.Types.ObjectId, ref: "Course", required: true },
    title: { type: String, required: true },
    content: { type: String, required: true }, // Can store text or HTML content
    videoUrl: { type: String }, // Store video links (e.g., from AWS S3 or YouTube)
    createdAt: { type: Date, default: Date.now },
});

export const Lesson = mongoose.model("Lesson", LessonSchema);
