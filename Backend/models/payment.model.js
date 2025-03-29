import mongoose from "mongoose";

const PaymentSchema = new mongoose.Schema({
    student: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    course: { type: mongoose.Schema.Types.ObjectId, ref: "Course", required: true },
    amount: { type: Number, required: true },
    status: { type: String, enum: ["pending", "completed", "failed"], default: "pending" },
    transactionId: { type: String, required: true },
    createdAt: { type: Date, default: Date.now },
});

export const Payment = mongoose.model("Payment", PaymentSchema);
