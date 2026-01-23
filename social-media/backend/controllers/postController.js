const Post = require("../models/Post");
const User = require('../models/User')
const {createNotification , deleteNotification} = require('../utils/notificationHelper')
const getPosts = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    const posts = await Post.find()
      .populate("user", "username avatar")
      .populate("comments.user", "username avatar")
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    const total = await Post.countDocuments();
    res.json({
      posts,
      currentPage: page,
      totalPages: Math.ceil(total / limit),
      totalPosts: total,
    });
  } catch (error) {
    console.error("GetPosts error:", error);
    res.status(500).json({ message: error.message });  // Sửa: thêm .json()
  }
};

// @desc    Get posts by user
// @route   GET /api/posts/user/:userId
// @access  Private
const getPostsByUser = async (req, res) => {
  try {
    const posts = await Post.find({ user: req.params.userId })
      .populate("user", "username avatar")
      .populate("comments.user", "username avatar")
      .sort({ createdAt: -1 });

    res.json(posts);
  } catch (error) {
    console.error("GetPostsByUser error:", error);
    res.status(500).json({ message: error.message });  // Sửa: staus -> status
  }
};

// @desc    Get single post
// @route   GET /api/posts/:id
// @access  Private
const getPostById = async (req, res) => {
  try {
    const post = await Post.findById(req.params.id)  // Sửa: findOne -> findById
      .populate("user", "username avatar")
      .populate("comments.user", "username avatar");

    if (!post) {
      return res.status(404).json({ message: "Post not found" });
    }
    res.json(post);
  } catch (error) {
    console.error("GetPostById error:", error);
    res.status(500).json({ message: error.message });
  }
};

// @desc    Create post
// @route   POST /api/posts
// @access  Private
const createPost = async (req, res) => {
  try {
    const { title, content } = req.body;
    if (!title || !content) {
      return res
        .status(400)
        .json({ message: "Title and content are required" });
    }
    const post = await Post.create({
      user: req.user._id,
      title,
      content,
      file: req.file ? req.file.filename : "",
    });

    const populatedPost = await Post.findById(post._id).populate(
      "user",
      "username avatar"
    );

    res.status(201).json(populatedPost);  // Sửa: thêm status(201)
  } catch (error) {
    console.error("CreatePost error:", error);
    res.status(500).json({ message: error.message });
  }
};

// @desc    Delete post
// @route   DELETE /api/posts/:id
// @access  Private
const deletePost = async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    if (!post) {
      return res.status(404).json({ message: "Post not found" });
    }
    // Sửa: post.user đã là ObjectId, không cần ._id
    if (post.user.toString() !== req.user._id.toString()) {
      return res
        .status(401)
        .json({ message: "Not authorized to delete this post" });
    }

    await post.deleteOne();
    res.json({ message: "Post removed successfully" });
  } catch (error) {
    console.error("DeletePost error:", error);
    res.status(500).json({ message: error.message });
  }
};

// @desc    Like/Unlike post (toggle)
// @route   PUT /api/posts/like/:id
// @access  Private
const toggleLike = async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    if (!post) {
      return res.status(404).json({ message: "Post not found" });
    }
    const userId = req.user._id.toString();
    // Sửa: dùng .some() thay vì .filter() để check boolean
    const isLiked = post.likes.some((id) => id.toString() === userId);
    
    if (isLiked) {
      // Unlike - xóa user khỏi array likes
      post.likes = post.likes.filter((id) => id.toString() !== userId);

      await deleteNotification({
        recipientId: post.user,
        senderId: req.user._id,
        type:'like',
        postId: post._id
      })
    } else {
      // Like - thêm user vào array likes
      post.likes.push(req.user._id);
      if(post.user.toString() !== userId){
        await createNotification({
          recipientId: post.user,
          senderId: req.user._id,
          type:'like',
          postId: post._id,
          message: `${req.user.username} liked your post`
        })
      }
    }
    
    await post.save();
    const populatedPost = await Post.findById(post._id)
      .populate("user", "username avatar")
      .populate("comments.user", "username avatar");
    res.json(populatedPost);
  } catch (error) {
    console.error("ToggleLike error:", error);
    res.status(500).json({ message: error.message });
  }
};

// @desc    Add comment
// @route   POST /api/posts/comment/:id
// @access  Private
const addComment = async (req, res) => {
  try {
    const { text } = req.body;
    
    if (!text) {
      return res.status(400).json({ message: "Comment text is required" });  // Sửa: 401 -> 400
    }
    
    const post = await Post.findById(req.params.id);
    if (!post) {
      return res.status(404).json({ message: "Post not found" });
    }
    
    const comment = {
      user: req.user._id,
      text,
    };
    post.comments.push(comment);

    await post.save();
    if (post.user.toString() !== req.user._id.toString()) {
      await createNotification({
        recipientId: post.user,
        senderId: req.user._id,
        type: 'comment',
        postId: post._id,
        message: `${req.user.username} commented on your post`,
      });
    }
    const populatedPost = await Post.findById(post._id)
      .populate("user", "username avatar")
      .populate("comments.user", "username avatar");
    res.json(populatedPost);
  } catch (error) {
    console.error("AddComment error:", error);
    res.status(500).json({ message: error.message });
  }
};

// @desc    Delete comment
// @route   DELETE /api/posts/comment/:postId/:commentId
// @access  Private
const deleteComment = async (req, res) => {
  try {
    const post = await Post.findById(req.params.postId);  // Sửa: req.params.id -> req.params.postId
    if (!post) {
      return res.status(404).json({ message: "Post not found" });
    }
    
    const comment = post.comments.id(req.params.commentId);
    if (!comment) {
      return res.status(404).json({ message: "Comment not found" });
    }

    // Sửa: comment.user và post.user đã là ObjectId, không cần ._id
    const isCommentOwner = comment.user.toString() === req.user._id.toString();
    const isPostOwner = post.user.toString() === req.user._id.toString();
    
    if (!isCommentOwner && !isPostOwner) {
      return res
        .status(401)
        .json({ message: "Not authorized to delete this comment" });
    }
    
    post.comments = post.comments.filter(
      (com) => com._id.toString() !== req.params.commentId
    );

    await post.save();
    const populatedPost = await Post.findById(post._id)
      .populate("user", "username avatar")
      .populate("comments.user", "username avatar");
    res.json(populatedPost);
  } catch (error) {
    console.error("DeleteComment error:", error);
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  getPosts,
  getPostsByUser,
  getPostById,
  createPost,
  deletePost,
  toggleLike,
  addComment,
  deleteComment,
};
