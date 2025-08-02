const express = require("express");
const { body, validationResult } = require("express-validator");
const Session = require("../models/Session");
const auth = require("../middleware/auth");

const router = express.Router();

// Get all published sessions (public)
router.get("/", async (req, res) => {
  try {
    const { page = 1, limit = 10, category, tags, search } = req.query;
    const query = { status: "published" };

    // Add filters
    if (category) query.category = category;
    if (tags) query.tags = { $in: tags.split(",") };
    if (search) {
      query.$or = [
        { title: { $regex: search, $options: "i" } },
        { description: { $regex: search, $options: "i" } },
      ];
    }

    const sessions = await Session.find(query)
      .populate("author", "username")
      .sort({ createdAt: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit);

    const total = await Session.countDocuments(query);

    res.json({
      sessions,
      totalPages: Math.ceil(total / limit),
      currentPage: page,
      total,
    });
  } catch (error) {
    console.error("Get sessions error:", error);
    res.status(500).json({ message: "Server error" });
  }
});

// Get user's sessions (protected)
router.get("/my-sessions", auth, async (req, res) => {
  try {
    const { status, page = 1, limit = 10 } = req.query;
    const query = { author: req.user._id };

    if (status) query.status = status;

    const sessions = await Session.find(query)
      .sort({ updatedAt: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit);

    const total = await Session.countDocuments(query);

    res.json({
      sessions,
      totalPages: Math.ceil(total / limit),
      currentPage: page,
      total,
    });
  } catch (error) {
    console.error("Get my sessions error:", error);
    res.status(500).json({ message: "Server error" });
  }
});

// Get single session
router.get("/:id", async (req, res) => {
  try {
    const session = await Session.findById(req.params.id).populate(
      "author",
      "username"
    );

    if (!session) {
      return res.status(404).json({ message: "Session not found" });
    }

    res.json(session);
  } catch (error) {
    console.error("Get session error:", error);
    res.status(500).json({ message: "Server error" });
  }
});

// Create session (protected)
router.post(
  "/",
  auth,
  [
    body("title")
      .trim()
      .isLength({ min: 1, max: 100 })
      .withMessage("Title must be between 1 and 100 characters"),
    body("description")
      .optional()
      .trim()
      .isLength({ max: 500 })
      .withMessage("Description must be less than 500 characters"),
    body("tags").optional().isArray().withMessage("Tags must be an array"),
    body("jsonUrl").optional().isURL().withMessage("Please enter a valid URL"),
    body("category")
      .optional()
      .isIn(["yoga", "meditation", "breathing", "mindfulness", "other"])
      .withMessage("Invalid category"),
    body("difficulty")
      .optional()
      .isIn(["beginner", "intermediate", "advanced"])
      .withMessage("Invalid difficulty level"),
    body("duration")
      .optional()
      .isNumeric()
      .withMessage("Duration must be a number"),
    body("status")
      .optional()
      .isIn(["draft", "published"])
      .withMessage("Status must be either 'draft' or 'published'"),
  ],
  async (req, res) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({
          message: "Validation failed",
          errors: errors.array(),
        });
      }

      const sessionData = {
        ...req.body,
        author: req.user._id,
      };

      const session = new Session(sessionData);
      await session.save();

      const populatedSession = await Session.findById(session._id).populate(
        "author",
        "username"
      );

      res.status(201).json({
        message: "Session created successfully",
        session: populatedSession,
      });
    } catch (error) {
      console.error("Create session error:", error);
      res.status(500).json({ message: "Server error" });
    }
  }
);

// Update session (protected)
router.put(
  "/:id",
  auth,
  [
    body("title")
      .optional()
      .trim()
      .isLength({ min: 1, max: 100 })
      .withMessage("Title must be between 1 and 100 characters"),
    body("description")
      .optional()
      .trim()
      .isLength({ max: 500 })
      .withMessage("Description must be less than 500 characters"),
    body("tags").optional().isArray().withMessage("Tags must be an array"),
    body("jsonUrl").optional().isURL().withMessage("Please enter a valid URL"),
    body("category")
      .optional()
      .isIn(["yoga", "meditation", "breathing", "mindfulness", "other"])
      .withMessage("Invalid category"),
    body("difficulty")
      .optional()
      .isIn(["beginner", "intermediate", "advanced"])
      .withMessage("Invalid difficulty level"),
    body("duration")
      .optional()
      .isNumeric()
      .withMessage("Duration must be a number"),
  ],
  async (req, res) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({
          message: "Validation failed",
          errors: errors.array(),
        });
      }

      const session = await Session.findOne({
        _id: req.params.id,
        author: req.user._id,
      });

      if (!session) {
        return res
          .status(404)
          .json({ message: "Session not found or not authorized" });
      }

      Object.assign(session, req.body);
      await session.save();

      const populatedSession = await Session.findById(session._id).populate(
        "author",
        "username"
      );

      res.json({
        message: "Session updated successfully",
        session: populatedSession,
      });
    } catch (error) {
      console.error("Update session error:", error);
      res.status(500).json({ message: "Server error" });
    }
  }
);

// Auto-save session (protected)
router.patch("/:id/autosave", auth, async (req, res) => {
  try {
    const session = await Session.findOne({
      _id: req.params.id,
      author: req.user._id,
    });

    if (!session) {
      return res
        .status(404)
        .json({ message: "Session not found or not authorized" });
    }

    // Only update specific fields for auto-save
    const { title, description, content, tags, jsonUrl } = req.body;

    if (title !== undefined) session.title = title;
    if (description !== undefined) session.description = description;
    if (content !== undefined) session.content = content;
    if (tags !== undefined) session.tags = tags;
    if (jsonUrl !== undefined) session.jsonUrl = jsonUrl;

    session.lastSaved = Date.now();
    await session.save();

    res.json({
      message: "Session auto-saved",
      lastSaved: session.lastSaved,
    });
  } catch (error) {
    console.error("Auto-save error:", error);
    res.status(500).json({ message: "Auto-save failed" });
  }
});

// Publish session (protected)
router.patch("/:id/publish", auth, async (req, res) => {
  try {
    const session = await Session.findOne({
      _id: req.params.id,
      author: req.user._id,
    });

    if (!session) {
      return res
        .status(404)
        .json({ message: "Session not found or not authorized" });
    }

    session.status = "published";
    await session.save();

    const populatedSession = await Session.findById(session._id).populate(
      "author",
      "username"
    );

    res.json({
      message: "Session published successfully",
      session: populatedSession,
    });
  } catch (error) {
    console.error("Publish session error:", error);
    res.status(500).json({ message: "Server error" });
  }
});

// Delete session (protected)
router.delete("/:id", auth, async (req, res) => {
  try {
    const session = await Session.findOneAndDelete({
      _id: req.params.id,
      author: req.user._id,
    });

    if (!session) {
      return res
        .status(404)
        .json({ message: "Session not found or not authorized" });
    }

    res.json({ message: "Session deleted successfully" });
  } catch (error) {
    console.error("Delete session error:", error);
    res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;
