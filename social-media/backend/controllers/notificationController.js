const Notification = require("../models/Notification");

const getNotifications = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 20;
    const skip = (page - 1) * limit;
    const notifications = await Notification.find({ recipient: req.user._id })
      .populate("sender", "username avatar")
      .populate("post", "title")
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    const total = await Notification.countDocuments({
      recipient: req.user._id,
    });

    const unreadCount = await Notification.countDocuments({
      recipient: req.user._id,
      read: false,
    });

    res.json({
      notifications,
      currentPage: page,
      totalPages: Math.ceil(total / limit),
      totalNotifications: total,
      unreadCount: unreadCount,
    });
  } catch (error) {
    console.error("GetNotifications error:", error);
    res.status(500).json({ message: error.message });
  }
};

const getUnreadCount = async (req, res) => {
  try {
    const count = await Notification.countDocuments({
      recipient: req.user._id,
      read: false,
    });
    res.json({ unreadCount: count });
  } catch (error) {
    console.error("GetUnreadCount error:", error);
    res.status(500).json({ message: error.message });
  }
};
const markAsRead = async (req, res) => {
  try {
    const notification = await Notification.findById(req.params.id);
    if (!notification) {
      return res.status(404).json({ message: "Notification not found" });
    }
    if (notification.recipient.toString() !== req.user._id.toString()) {
      return res.status(401).json({ message: "Not authorized" });
    }
    notification.read = true;
    await notification.save();

    res.json(notification);
  } catch (error) {
    console.error("MarkAsRead error:", error);
    res.status(500).json({ message: error.message });
  }
};

const markAllAsRead = async (req, res) => {
  try {
    await Notification.updateMany({ recipient: req.user._id }, { read: true });
    res.json({ message: "All notifications marked as read" });
  } catch (error) {
    console.error("MarkAllAsRead error:", error);
    res.status(500).json({ message: error.message });
  }
};

const deleteNotification = async (req, res) => {
  try {
    const notification = await Notification.findById(req.params.id);
    if (!notification) {
      return res.status(404).json({ message: "Notification not found" });
    }
    if (notification.recipient.toString() !== req.user._id.toString()) {
      return res.status(401).json({ message: "Not authorized" });
    }
    await notification.deleteOne();
    res.json({ message: "Notification deleted" });
  } catch (error) {
    console.error("DeleteNotification error:", error);
    res.status(500).json({ message: error.message });
  }
};

const deleteAllNotifications = async (req, res) => {
  try {
    await Notification.deleteMany({ recipient: req.user._id });
    res.json({ message: "All notifications deleted" });
  } catch (error) {
    console.error("DeleteAllNotifications error:", error);
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  getNotifications,
  getUnreadCount,
  markAsRead,
  markAllAsRead,
  deleteNotification,
  deleteAllNotifications,
};
