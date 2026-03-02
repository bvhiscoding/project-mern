const express = require("express");
const { protect } = require("../middlewares/auth.middleware");
const {
  getMyBookings,
  cancelBooking,
} = require("../controllers/booking.controller");
const {
  validateParams,
  validateQuery,
} = require("../middlewares/validate.middleware");
const {
  idParamSchema,
  paginationQuerySchema,
} = require("../validators/common.validation");

const router = express.Router();

router.use(protect);

router.get("/my", validateQuery(paginationQuerySchema), getMyBookings);
router.patch("/:id/cancel", validateParams(idParamSchema), cancelBooking);

module.exports = router;
