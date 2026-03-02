const mongoose = require("mongoose");

const eventSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      trim: true,
      required: [true, "Title is required"],
    },
    description: {
      type: String,
      default: "",
    },
    eventDate: {
      type: Date,
      required: [true, "Event date is required"],
    },
    owner: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    category: {
      type: String,
      enum: ["Workshop", "Meeting", "Party", "Study", "Personal"],
      default: "Personal",
    },
    status: {
      type: String,
      enum: ["draft", "published", "cancelled", "completed"],
      default: "draft",
    },
    mode: {
      type: String,
      enum: ["online", "offline"],
      default: "offline",
    },
    meetingLink: {
      type: String,
      default: "",
      trim: true,
    },
    venueAddress: {
      type: String,
      default: "",
      trim: true,
    },
    reminderEnabled: {
      type: Boolean,
      default: false,
    },
    reminderAt: {
      type: Date,
      default: null,
    },
    reminderType: {
      type: String,
      enum: ["1h_before", "1d_before", "custom"],
      default: "1h_before",
    },
    capacity: {
      type: Number,
      default: 0,
      min: 0,
    },
    attendees: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },
    ],
    attendeesCount: {
      type: Number,
      default: 0,
      min: 0,
    },
    coverImageUrl: {
      type: String,
      default: "",
    },
    coverImagePublicId: {
      type: String,
      default: "",
    },
    ticketType: {
      type: String,
      enum: ["free", "paid"],
      default: "free",
    },
    ticketPrice: {
      type: Number,
      default: 0,
      min: 0,
    },
  },
  { timestamps: true },
);

module.exports = mongoose.model("Event", eventSchema);
