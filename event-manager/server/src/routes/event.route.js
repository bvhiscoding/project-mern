const express = require("express");
const { protect } = require("../middlewares/auth.middleware");
const {
  getPublicEvents,
  getEvents,
  getEventById,
  createEvent,
  updateEvent,
  deleteEvent,
  joinEvent,
  leaveEvent,
  getEventAttendees,
} = require("../controllers/event.controller");
const router = express.Router();

router.get("/public", getPublicEvents);

router.use(protect);
router.get("/", getEvents);
router.get("/:id", getEventById);
router.post("/", createEvent);
router.put("/:id", updateEvent);
router.delete("/:id", deleteEvent);
router.post("/:id/join", joinEvent);
router.post("/:id/leave", leaveEvent);
router.get("/:id/attendees", getEventAttendees);
module.exports = router;
