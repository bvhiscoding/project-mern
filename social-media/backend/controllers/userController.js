const User = require("../models/User");
const {
  createNotification,
  deleteNotification,
} = require("../utils/notificationHelper");
// @desc    Get user by ID
// @route   GET /api/users/:id
// @access  Private
const getUserByID = async (req, res) => {
  try {
    const user = await User.findById(req.params.id)
      .select("-password")
      .populate("followers", "username avatar")
      .populate("following", "username avatar");

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    res.json(user);
  } catch (error) {
    console.error("getUserByID error", error);
    res.status(500).json({ message: error.message });
  }
};

// @desc    Update user profile
// @route   PUT /api/users/profile
// @access  Private
const updateProfile = async (req, res) => {
  try {
    const { username, bio } = req.body;
    const user = await User.findById(req.user._id);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Kiểm tra username đã tồn tại chưa (trừ user hiện tại)
    if (username && username !== user.username) {
      const existingUser = await User.findOne({ username });
      if (existingUser) {
        return res.status(400).json({ message: "Username already taken" });
      }
      user.username = username;
    }

    if (bio !== undefined) {
      user.bio = bio;
    }

    await user.save();

    res.json({
      _id: user._id,
      username: user.username,
      email: user.email,
      avatar: user.avatar,
      bio: user.bio,
      followers: user.followers,
      following: user.following,
    });
  } catch (error) {
    console.error("UpdateProfile error:", error);
    res.status(500).json({ message: error.message });
  }
};

// @desc    Update user avatar
// @route   PUT /api/users/avatar
// @access  Private
const updateAvatar = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: "Please upload a file" });
    }

    const user = await User.findById(req.user._id);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    user.avatar = req.file.filename;
    await user.save();

    res.json({
      _id: user._id,
      username: user.username,
      email: user.email,
      avatar: user.avatar,
      bio: user.bio,
      followers: user.followers,
      following: user.following,
    });
  } catch (error) {
    console.error("UpdateAvatar error:", error);
    res.status(500).json({ message: error.message });
  }
};

// @desc    Follow a user
// @route   PUT /api/users/follow/:id
// @access  Private
const followUser = async (req, res) => {
  try {
    // Không thể follow chính mình
    if (req.user._id.toString() === req.params.id) {
      return res.status(400).json({ message: "You cannot follow yourself" });
    }

    const userToFollow = await User.findById(req.params.id);
    const currentUser = await User.findById(req.user._id);

    if (!userToFollow) {
      return res.status(404).json({ message: "User not found" });
    }

    // Kiểm tra đã follow chưa
    if (currentUser.following.includes(req.params.id)) {
      return res.status(400).json({ message: "You already follow this user" });
    }

    // Thêm vào following và followers
    currentUser.following.push(req.params.id);
    userToFollow.followers.push(req.user._id);

    await currentUser.save();
    await userToFollow.save();
    await createNotification({
      recipientId: userToFollow._id,
      senderId: req.user._id,
      type: "follow",
      message: `${currentUser.username} started following you`,
    });
    res.json({ message: "User followed successfully" });
  } catch (error) {
    console.error("FollowUser error:", error);
    res.status(500).json({ message: error.message });
  }
};

// @desc    Unfollow a user
// @route   PUT /api/users/unfollow/:id
// @access  Private
const unfollowUser = async (req, res) => {
  try {
    // Không thể unfollow chính mình
    if (req.user._id.toString() === req.params.id) {
      return res.status(400).json({ message: "You cannot unfollow yourself" });
    }

    const userToUnfollow = await User.findById(req.params.id);
    const currentUser = await User.findById(req.user._id);

    if (!userToUnfollow) {
      return res.status(404).json({ message: "User not found" });
    }

    // Kiểm tra có đang follow không (thêm dấu ! để check KHÔNG follow)
    if (!currentUser.following.includes(req.params.id)) {
      return res.status(400).json({ message: "You do not follow this user" });
    }

    // Xóa khỏi following và followers
    currentUser.following = currentUser.following.filter(
      (id) => id.toString() !== req.params.id
    );
    userToUnfollow.followers = userToUnfollow.followers.filter(
      (id) => id.toString() !== req.user._id.toString()
    );

    await currentUser.save();
    await userToUnfollow.save();
    await deleteNotification({
      recipientId: userToUnfollow._id,
      senderId: req.user._id,
      type: "follow",
    });
    res.json({ message: "User unfollowed successfully" });
  } catch (error) {
    console.error("UnfollowUser error:", error);
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get user followers
// @route   GET /api/users/:id/followers
// @access  Private
const getFollowers = async (req, res) => {
  try {
    const user = await User.findById(req.params.id).populate(
      "followers",
      "username avatar bio"
    );

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.json(user.followers);
  } catch (error) {
    console.error("GetFollowers error:", error);
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get user following
// @route   GET /api/users/:id/following
// @access  Private
const getFollowing = async (req, res) => {
  try {
    const user = await User.findById(req.params.id).populate(
      "following",
      "username avatar bio"
    );

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.json(user.following);
  } catch (error) {
    console.error("GetFollowing error:", error);
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  getUserByID,
  updateProfile,
  updateAvatar,
  followUser,
  unfollowUser,
  getFollowers,
  getFollowing,
};
