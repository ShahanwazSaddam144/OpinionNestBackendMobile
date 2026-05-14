const mongoose = require("mongoose");

const chatHistorySchema = new mongoose.Schema(
    {
        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Auth",
            required: true
        },
        email: {
            type: String,
            required: true
        },
        name: {
            type: String,
            required: true
        },
        industry: {
            type: String,
            required: true
        },
        description: {
            type: String,
            required: true
        },
        result: {
            type: mongoose.Schema.Types.Mixed,
            required: true
        },
        summary: {
            type: String,
            default: ""
        },
        scale: {
            type: mongoose.Schema.Types.Mixed,
            default: null
        },
        insights: {
            type: mongoose.Schema.Types.Mixed,
            default: null
        }
    },
    {
        timestamps: true
    }
);

module.exports = mongoose.model("chatHistory", chatHistorySchema);