const mongoose = require("mongoose");

const BookingSchema = new mongoose.Schema(
  {
    eventId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Event",
      required: true,
    },
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    quantity: {
      type: Number,
      default: 1,
      min: 1,
    },
    status: {
      type: String,
      enum: ["pending", "confirmed", "cancelled"],
      default: "pending",
    },
    bookingCode: {
      type: String,
      required: true,
      unique: true,
    },
  },
  { timestamps: true },
);

BookingSchema.index({ eventId: -1, userId: -1 }, { unique: true });

module.exports = mongoose.model("Booking", BookingSchema);
