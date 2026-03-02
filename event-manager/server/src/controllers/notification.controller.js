const Notification = require("../models/Notification");
const AppError = require("../utils/ApiError");
const { success } = require("../utils/ApiResponse");
const asyncHandler = require("../middlewares/asyncHandler");

const getNotifications = asyncHandler(async (req, res) => {
  const userId = req.user._id;
  const page = Math.max(parseInt(req.query.page, 10) || 1, 1);
  const limit = Math.min(Math.max(parseInt(req.query.limit, 10) || 20, 1), 100);
  const skip = (page - 1) * limit;

  const [notifications, total, unreadCount] = await Promise.all([
    Notification.find({ userId })
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .lean(),
    Notification.countDocuments({ userId }),
    Notification.countDocuments({ userId, isRead: false }),
  ]);

  const totalPages = Math.max(Math.ceil(total / limit), 1);

  return success(res, {
    data: {
      notifications,
      unreadCount,
      currentPage: page,
      totalPages,
      total,
    },
  });
});

const markNotificationAsRead = asyncHandler(async (req, res) => {
  const userId = req.user._id;
  const { id } = req.params;

  const notification = await Notification.findOne({ _id: id, userId });
  if (!notification) {
    throw new AppError("Notification not found", 404, "NOTIFICATION_NOT_FOUND");
  }

  if (notification.isRead) {
    throw new AppError(
      "Notification already read",
      400,
      "NOTIFICATION_ALREADY_READ",
    );
  }

  notification.isRead = true;
  await notification.save();

  return success(res, { message: "Notification marked as read" });
});

const markAllNotificationsAsRead = asyncHandler(async (req, res) => {
  const userId = req.user._id;

  const result = await Notification.updateMany(
    { userId, isRead: false },
    { $set: { isRead: true } },
  );

  return success(res, {
    message: `Marked ${result.modifiedCount} notifications as read`,
    data: { modifiedCount: result.modifiedCount },
  });
});

module.exports = {
  getNotifications,
  markNotificationAsRead,
  markAllNotificationsAsRead,
};
