const mongoose = require("mongoose");

const CalendarSchema = new mongoose.Schema(
  {
    password: {
      type: String,
      required: true,
    },
  },
  { timestamps: true }
);
module.exports = mongoose.model("auth", CalendarSchema);
