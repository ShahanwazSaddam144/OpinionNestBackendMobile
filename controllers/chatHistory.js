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

router.get("/chat-history", authMiddleware, async (req, res) => {
    try {
        const history = await chatHistory.find({
            email: req.user.email
        }).sort({ createdAt: -1 });

        return res.status(200).json({
            success: true,
            history
        });

    } catch (error) {
        return res.status(500).json({
            success: false,
            message: error.message
        });
    }
});

router.delete("/chat-history/:id", authMiddleware, async (req, res) => {
    try {
        const deletedChat = await chatHistory.findOneAndDelete({
            _id: req.params.id,
            email: req.user.email
        });

        if (!deletedChat) {
            return res.status(404).json({
                success: false,
                message: "Chat history not found"
            });
        }

        return res.status(200).json({
            success: true,
            message: "Chat history deleted successfully"
        });

    } catch (error) {
        return res.status(500).json({
            success: false,
            message: error.message
        });
    }
});

router.delete("/chat-history", authMiddleware, async (req, res) => {
    try {
        await chatHistory.deleteMany({
            email: req.user.email
        });

        return res.status(200).json({
            success: true,
            message: "All chat history deleted successfully"
        });

    } catch (error) {
        return res.status(500).json({
            success: false,
            message: error.message
        });
    }
});

module.exports = router;