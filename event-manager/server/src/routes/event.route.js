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
const { bookEvent } = require("../controllers/booking.controller");
const {
  validateBody,
  validateParams,
  validateQuery,
} = require("../middlewares/validate.middleware");
const {
  idParamSchema,
} = require("../validators/common.validation");
const {
  eventListQuerySchema,
  createEventSchema,
  updateEventSchema,
} = require("../validators/event.validation");
const {
  createBookingSchema,
} = require("../validators/booking.validation");
const router = express.Router();

router.get("/public", validateQuery(eventListQuerySchema), getPublicEvents);

router.use(protect);
router.get("/", validateQuery(eventListQuerySchema), getEvents);
router.get("/:id", validateParams(idParamSchema), getEventById);
router.post("/", validateBody(createEventSchema), createEvent);
router.put("/:id", validateParams(idParamSchema), validateBody(updateEventSchema), updateEvent);
router.delete("/:id", validateParams(idParamSchema), deleteEvent);
router.post("/:id/join", validateParams(idParamSchema), joinEvent);
router.post("/:id/leave", validateParams(idParamSchema), leaveEvent);
router.get("/:id/attendees", validateParams(idParamSchema), getEventAttendees);
router.post("/:id/book", validateParams(idParamSchema), validateBody(createBookingSchema), bookEvent);
module.exports = router;
