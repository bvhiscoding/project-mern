const Joi = require("joi");
const { objectIdPattern } = require("./common.validation");

const uploadEventCoverSchema = Joi.object({
  eventId: Joi.string().pattern(objectIdPattern).required(),
});

module.exports = {
  uploadEventCoverSchema,
};
