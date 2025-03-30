import mongoose from "mongoose";

const EnrollmentSchema = new mongoose.Schema({
    student: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    course: { type: mongoose.Schema.Types.ObjectId, ref: "Course", required: true },
    progress: { type: Number, default: 0 }, // Progress percentage
    completed: { type: Boolean, default: false },
    enrolledAt: { type: Date, default: Date.now },
});

export const Enrollment = mongoose.model("Enrollment", EnrollmentSchema);
