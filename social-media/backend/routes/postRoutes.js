const express = require("express");
const router = express.Router();
const {
  getPosts,
  getPostsByUser,
  getPostById,
  createPost,
  deletePost,
  toggleLike,
  addComment,
  deleteComment,
} = require("../controllers/postController");

const { protect } = require("../middlewares/authMiddleware");
const upload = require("../middlewares/uploadMiddleware");

// Tất cả routes cần authentication
router.use(protect);

// Post CRUD routes
router.get("/", getPosts);
router.get("/user/:userId", getPostsByUser);  // Sửa: userId thay vì userid
router.get("/:id", getPostById);
router.post("/", upload.single('file'), createPost);  // Sửa: thêm upload middleware
router.delete("/:id", deletePost);

// Like route
router.put("/like/:id", toggleLike);

// Comment routes
router.post("/comment/:id", addComment);
router.delete("/comment/:postId/:commentId", deleteComment);

module.exports = router;
