const Booking = require("../models/Booking");
const Event = require("../models/Event");
const Notification = require("../models/Notification");
const AppError = require("../utils/ApiError");
const { success } = require("../utils/ApiResponse");
const asyncHandler = require("../middlewares/asyncHandler");

const generateBookingCode = () =>
  "BK-" +
  Date.now().toString(36).toUpperCase() +
  Math.random().toString(36).substring(2, 6).toUpperCase();

const bookEvent = asyncHandler(async (req, res) => {
  const { id: eventId } = req.params;
  const requestedQuantity = Math.max(1, Number(req.body.quantity) || 1);

  const event = await Event.findById(eventId);
  if (!event) {
    throw new AppError("Event not found", 404, "EVENT_NOT_FOUND");
  }

  if (event.status !== "published") {
    throw new AppError(
      "Event is not available for booking",
      400,
      "EVENT_NOT_BOOKABLE",
    );
  }

  const existingBooking = await Booking.findOne({
    eventId,
    userId: req.user._id,
    status: { $ne: "cancelled" },
  });

  if (existingBooking) {
    throw new AppError(
      "You already have a booking for this event",
      400,
      "BOOKING_EXISTS",
    );
  }

  if (event.ticketType === "free" && event.capacity > 0) {
    const totals = await Booking.aggregate([
      { $match: { eventId: event._id, status: { $ne: "cancelled" } } },
      { $group: { _id: null, total: { $sum: "$quantity" } } },
    ]);

    const totalBooked = totals.length ? totals[0].total : 0;
    if (totalBooked + requestedQuantity > event.capacity) {
      throw new AppError(
        "Not enough available tickets",
        400,
        "INSUFFICIENT_TICKETS",
      );
    }
  }

  const booking = await Booking.create({
    eventId,
    userId: req.user._id,
    quantity: requestedQuantity,
    status: "confirmed",
    bookingCode: generateBookingCode(),
  });

  if (String(event.owner) !== String(req.user._id)) {
    Notification.create({
      userId: event.owner,
      type: "booking",
      title: "New booking",
      message: `${requestedQuantity} ticket(s) booked for ${event.title}`,
      link: `/events/${event._id}`,
    }).catch((notificationError) => {
      console.error(`CreateBookingNotification error: ${notificationError}`);
    });
  }

  return success(res, {
    status: 201,
    message: "Booking confirmed",
    data: { booking },
  });
});

const getMyBookings = asyncHandler(async (req, res) => {
  const bookings = await Booking.find({ userId: req.user._id })
    .populate(
      "eventId",
      "title eventDate category status venueAddress meetingLink",
    )
    .sort({ createdAt: -1 });

  return success(res, { data: { bookings } });
});

const cancelBooking = asyncHandler(async (req, res) => {
  const { id: bookingId } = req.params;
  const booking = await Booking.findById(bookingId);

  if (!booking) {
    throw new AppError("Booking not found", 404, "BOOKING_NOT_FOUND");
  }

  if (
    String(booking.userId) !== String(req.user._id) &&
    req.user.role !== "admin"
  ) {
    throw new AppError("Forbidden", 403, "FORBIDDEN");
  }

  if (booking.status === "cancelled") {
    throw new AppError(
      "Booking already cancelled",
      400,
      "BOOKING_ALREADY_CANCELLED",
    );
  }

  booking.status = "cancelled";
  await booking.save();

  return success(res, { message: "Booking cancelled successfully" });
});

module.exports = { bookEvent, getMyBookings, cancelBooking };
