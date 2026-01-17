const mongoose = require("mongoose");
const stockSchema = new mongoose.Schema({
  company: {
    type: String,
    required: true,
  },
  description: {
    type: String,
  },
  initialPrice: {
    type: Number,
    required: true,
  },
  price_2002: {
    type: Number,
  },
  price_2007: {
    type: Number,
  },
  symbol: {
    type: String,
    required: true,
    unique: true,
  },
});

module.exports = mongoose.model("Stock", stockSchema, "stocks");
