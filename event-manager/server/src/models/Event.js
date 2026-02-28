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
  },
  { timestamps: true },
);

module.exports = mongoose.model("Event", eventSchema);
