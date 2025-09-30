const mongoose = require("mongoose");

const budgetSchema = new mongoose.Schema(
    {
        user_id: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User", // assumes User model already exists
            required: true,
        },
        category: {
            type: String,
            required: true,
            trim: true,
        },
        limit: {
            type: Number,
            required: true,
            min: 0,
        },
        month: {
            type: String, // e.g. "2025-09"
            required: true,
        },
    },
    { timestamps: true }
);

module.exports = mongoose.model("Budget", budgetSchema);