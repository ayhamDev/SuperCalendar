const mongoose = require("mongoose");
const CalendarSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
    },
    events: [
      {
        id: mongoose.Types.ObjectId,
        date: {
          time: {
            start: { type: String, required: true },
            end: { type: String, required: true },
          },
          from: {
            year: { type: Number, required: true },
            month: { type: Number, required: true },
            day: { type: Number, required: true },
          },
          to: {
            year: { type: Number, required: true },
            month: { type: Number, required: true },
            day: { type: Number, required: true },
          },
          days: [Number],
        },
        color: { type: String, required: true },
        title: { type: String, required: true },
        desc: { type: String, required: true },
      },
    ],
  },
  { timestamps: true }
);
module.exports = mongoose.model("calendar", CalendarSchema);
