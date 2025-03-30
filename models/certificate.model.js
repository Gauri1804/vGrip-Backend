import mongoose from "mongoose";

const CertificateSchema = new mongoose.Schema({
    student: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    course: { type: mongoose.Schema.Types.ObjectId, ref: "Course", required: true },
    issuedAt: { type: Date, default: Date.now },
});

export const Certificate = mongoose.model("Certificate", CertificateSchema);
