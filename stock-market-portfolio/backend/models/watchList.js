const mongoose = require("mongoose");
const watchListSchema = new mongoose.Schema({
  stockId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Stock",
    required: true,
  },
  addAt: {
    type: Date,
    default: Date.now,
  },
});
module.exports = mongoose.model("Watchlist", watchListSchema);
