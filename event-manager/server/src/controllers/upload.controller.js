const Event = require("../models/Event");
const AppError = require("../utils/ApiError");
const { success } = require("../utils/ApiResponse");
const asyncHandler = require("../middlewares/asyncHandler");

const uploadEventCover = asyncHandler(async (req, res) => {
  if (!req.file) {
    throw new AppError(
      "No file uploaded or file type invalid",
      400,
      "INVALID_UPLOAD_FILE",
    );
  }

  const { eventId } = req.body;
  const event = await Event.findById(eventId);

  if (!event) {
    throw new AppError("Event not found", 404, "EVENT_NOT_FOUND");
  }

  if (
    String(event.owner) !== String(req.user._id) &&
    req.user.role !== "admin"
  ) {
    throw new AppError("Forbidden: not your event", 403, "FORBIDDEN");
  }

  const coverImageUrl = `/uploads/covers/${req.file.filename}`;

  event.coverImageUrl = coverImageUrl;
  await event.save();

  return success(res, {
    message: "Cover image uploaded successfully",
    data: { coverImageUrl },
  });
});

module.exports = { uploadEventCover };
