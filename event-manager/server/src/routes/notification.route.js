const express = require("express");
const { protect } = require("../middlewares/auth.middleware");
const {
  getNotifications,
  markNotificationAsRead,
  markAllNotificationsAsRead,
} = require("../controllers/notification.controller");
const {
  validateParams,
  validateQuery,
} = require("../middlewares/validate.middleware");
const {
  idParamSchema,
} = require("../validators/common.validation");
const {
  notificationListQuerySchema,
} = require("../validators/notification.validation");

const router = express.Router();

router.use(protect);
router.get("/", validateQuery(notificationListQuerySchema), getNotifications);
router.patch("/:id/read", validateParams(idParamSchema), markNotificationAsRead);
router.patch("/read-all", markAllNotificationsAsRead);

module.exports = router;
