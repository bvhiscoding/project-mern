const express = require("express");
const cors = require("cors");

const authRoutes = require("./routes/auth.route");
const eventRoutes = require("./routes/event.route");
const uploadRoutes = require("./routes/upload.route");
const bookingRoutes = require("./routes/booking.route");
const dashboardRoutes = require("./routes/dashboard.route");
const notificationRoutes = require("./routes/notification.route");
const { notFound, errorHandler } = require("./middlewares/error.middleware");
const { success } = require("./utils/ApiResponse");
const app = express();

app.use(cors());
app.use(express.json());

app.get("/api/health", (req, res) => {
  return success(res, { message: "API is running" });
});

app.use("/api/auth", authRoutes);
app.use("/api/events", eventRoutes);
app.use("/api/uploads", uploadRoutes);
app.use("/api/bookings", bookingRoutes);
app.use("/api/dashboard", dashboardRoutes);
app.use("/api/notifications", notificationRoutes);
app.use("/uploads", express.static("uploads"));
app.use(notFound);
app.use(errorHandler);

module.exports = app;
