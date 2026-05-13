const express = require("express");
const router = express.Router();
const chatHistory = require("../Models/chatHistory");
const authMiddleware = require("../middleware/authMiddleware");

router.post("/chat-history", authMiddleware, async (req, res) => {
    try {
        const { name, industry, description, result } = req.body;

        if (!name || !industry || !description || !result) {
            return res.status(400).json({
                success: false,
                message: "Missing required fields"
            });
        }

        const newChat = new chatHistory({
            user: req.user._id,
            email: req.user.email,
            name,
            industry,
            description,
            result,
            summary: result?.past_yearly_analysis?.summary || "",
            scale: result?.scale || null,
            insights: result?.insights || null
        });

        await newChat.save();

        return res.status(201).json({
            success: true,
            message: "Data saved successfully",
            data: newChat
        });

    } catch (error) {
        return res.status(500).json({
            success: false,
            message: error.message
        });
    }
});

module.exports = router;