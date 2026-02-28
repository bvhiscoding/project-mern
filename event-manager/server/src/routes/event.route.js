const express = require("express");
const { protect } = require("../middlewares/auth.middleware");
const {
  getEvents,
  getEventById,
  createEvent,
  updateEvent,
  deleteEvent,
} = require("../controllers/event.controller");
const router = express.Router();
router.use(protect);
router.get("/", getEvents);
router.get("/:id", getEventById);
router.post("/", createEvent);
router.put("/:id", updateEvent);
router.delete("/:id", deleteEvent);
module.exports = router;
