const mongoose = require("mongoose");
const Event = require("../models/Event");
const { success } = require("../utils/ApiResponse");
const asyncHandler = require("../middlewares/asyncHandler");

const getDashboardSummary = asyncHandler(async (req, res) => {
  const userId = req.user._id;
  const now = new Date();

  const [totalEvents, upcoming, completed, attendeesAgg, mostPopularEvent] =
    await Promise.all([
      Event.countDocuments({ owner: userId }),
      Event.countDocuments({
        owner: userId,
        status: "published",
        eventDate: { $gte: now },
      }),
      Event.countDocuments({ owner: userId, status: "completed" }),
      Event.aggregate([
        { $match: { owner: new mongoose.Types.ObjectId(userId) } },
        { $group: { _id: null, total: { $sum: "$attendeesCount" } } },
      ]),
      Event.findOne({ owner: userId })
        .sort({ attendeesCount: -1 })
        .select("title attendeesCount")
        .lean(),
    ]);

  const totalAttendees = attendeesAgg.length ? attendeesAgg[0].total : 0;

  return success(res, {
    data: {
      totalEvents,
      upcoming,
      completed,
      totalAttendees,
      mostPopularEvent: mostPopularEvent
        ? {
            _id: mostPopularEvent._id,
            title: mostPopularEvent.title,
            attendeesCount: mostPopularEvent.attendeesCount,
          }
        : null,
    },
  });
});

module.exports = { getDashboardSummary };
