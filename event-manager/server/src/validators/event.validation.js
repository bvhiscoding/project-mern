const Joi = require("joi");
const { paginationQuerySchema } = require("./common.validation");

const eventListQuerySchema = paginationQuerySchema.keys({
  search: Joi.string().trim().allow(""),
  category: Joi.string().valid("Workshop", "Meeting", "Party", "Study", "Personal"),
  status: Joi.string().valid(
    "upcoming",
    "completed",
    "cancelled",
    "draft",
    "published",
  ),
  sort: Joi.string().valid("date_asc", "date_desc", "created_desc"),
});

const eventBase = {
  title: Joi.string().trim().min(1).max(200),
  description: Joi.string().allow(""),
  eventDate: Joi.date().iso(),
  category: Joi.string().valid("Workshop", "Meeting", "Party", "Study", "Personal"),
  status: Joi.string().valid("draft", "published", "cancelled", "completed"),
  mode: Joi.string().valid("online", "offline"),
  meetingLink: Joi.string().uri({ scheme: [/https?/] }).allow(""),
  venueAddress: Joi.string().trim().allow(""),
  reminderEnabled: Joi.boolean(),
  reminderType: Joi.string().valid("1h_before", "1d_before", "custom"),
  reminderAt: Joi.date().iso().allow(null),
  capacity: Joi.number().integer().min(0),
  coverImageUrl: Joi.string().allow(""),
  ticketType: Joi.string().valid("free", "paid"),
  ticketPrice: Joi.number().min(0),
};

const createEventSchema = Joi.object({
  ...eventBase,
  title: eventBase.title.required(),
  eventDate: eventBase.eventDate.required(),
  mode: eventBase.mode.required(),
});

const updateEventSchema = Joi.object(eventBase).min(1);

module.exports = {
  eventListQuerySchema,
  createEventSchema,
  updateEventSchema,
};
