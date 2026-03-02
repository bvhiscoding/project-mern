const Event = require("../models/Event");
const AppError = require("../utils/ApiError");
const { success } = require("../utils/ApiResponse");
const asyncHandler = require("../middlewares/asyncHandler");

const buildOwnerFilter = (user) =>
  user.role === "admin" ? {} : { owner: user._id };

const isValidStatusTransition = (currentStatus, nextStatus) => {
  if (!nextStatus || currentStatus === nextStatus) {
    return true;
  }

  const transitions = {
    draft: ["published"],
    published: ["completed", "cancelled"],
    completed: [],
    cancelled: [],
  };

  return transitions[currentStatus]?.includes(nextStatus) || false;
};

const autoCompleteEventIfNeeded = async (event) => {
  if (!event) {
    return event;
  }

  const isPast = new Date(event.eventDate).getTime() < Date.now();
  if (event.status === "published" && isPast) {
    event.status = "completed";
    await event.save();
  }

  return event;
};

const markPastPublishedAsCompleted = async () => {
  await Event.updateMany(
    { status: "published", eventDate: { $lt: new Date() } },
    { $set: { status: "completed" } },
  );
};

const buildLocationAndReminderData = ({
  source,
  existing = {},
  requireMode = false,
}) => {
  const hasField = (key) => Object.prototype.hasOwnProperty.call(source, key);

  const toBoolean = (value) => {
    if (typeof value === "boolean") return value;
    if (typeof value === "string") {
      const normalized = value.toLowerCase().trim();
      if (normalized === "true") return true;
      if (normalized === "false") return false;
    }
    return Boolean(value);
  };

  const mode = hasField("mode")
    ? String(source.mode || "").toLowerCase()
    : existing.mode;

  if (requireMode && !mode) {
    return { error: "mode is required" };
  }

  if (mode && !["online", "offline"].includes(mode)) {
    return { error: "mode must be either online or offline" };
  }

  const meetingLink = hasField("meetingLink")
    ? String(source.meetingLink || "").trim()
    : String(existing.meetingLink || "").trim();
  const venueAddress = hasField("venueAddress")
    ? String(source.venueAddress || "").trim()
    : String(existing.venueAddress || "").trim();

  if (mode === "online" && !meetingLink) {
    return { error: "meetingLink is required when mode is online" };
  }

  if (mode === "offline" && !venueAddress) {
    return { error: "venueAddress is required when mode is offline" };
  }

  const reminderEnabled = hasField("reminderEnabled")
    ? toBoolean(source.reminderEnabled)
    : toBoolean(existing.reminderEnabled);

  const reminderType = hasField("reminderType")
    ? String(source.reminderType || "").toLowerCase()
    : existing.reminderType || "1h_before";

  if (
    reminderEnabled &&
    !["1h_before", "1d_before", "custom"].includes(reminderType)
  ) {
    return {
      error: "reminderType must be one of 1h_before, 1d_before, custom",
    };
  }

  let reminderAt = hasField("reminderAt") ? source.reminderAt : existing.reminderAt;

  if (reminderEnabled) {
    const eventDateMs = new Date(
      hasField("eventDate") ? source.eventDate : existing.eventDate,
    ).getTime();

    if (Number.isNaN(eventDateMs)) {
      return { error: "eventDate is invalid" };
    }

    if (reminderType === "1h_before") {
      reminderAt = new Date(eventDateMs - 60 * 60 * 1000);
    } else if (reminderType === "1d_before") {
      reminderAt = new Date(eventDateMs - 24 * 60 * 60 * 1000);
    } else {
      if (!reminderAt) {
        return { error: "reminderAt is required when reminderType is custom" };
      }

      reminderAt = new Date(reminderAt);
      if (Number.isNaN(reminderAt.getTime())) {
        return { error: "reminderAt is invalid" };
      }
    }

    if (new Date(reminderAt).getTime() >= eventDateMs) {
      return { error: "reminderAt must be before eventDate" };
    }
  } else {
    reminderAt = null;
  }

  return {
    value: {
      mode,
      meetingLink: mode === "online" ? meetingLink : "",
      venueAddress: mode === "offline" ? venueAddress : "",
      reminderEnabled,
      reminderType: reminderEnabled ? reminderType : "1h_before",
      reminderAt,
    },
  };
};

const getEvents = asyncHandler(async (req, res) => {
  const { search, category, status, sort } = req.query;
  const page = Math.max(parseInt(req.query.page, 10) || 1, 1);
  const limit = Math.min(Math.max(parseInt(req.query.limit, 10) || 10, 1), 100);
  const skip = (page - 1) * limit;

  await markPastPublishedAsCompleted();

  const filter = buildOwnerFilter(req.user);

  if (search && search.trim()) {
    filter.title = { $regex: search.trim(), $options: "i" };
  }

  if (category && category.trim()) {
    filter.category = category.trim();
  }

  if (status && status.trim()) {
    const normalizedStatus = status.trim().toLowerCase();
    const now = new Date();

    if (normalizedStatus === "upcoming") {
      filter.eventDate = { $gte: now };
      filter.status = { $in: ["draft", "published"] };
    } else if (normalizedStatus === "completed") {
      filter.status = "completed";
    } else if (normalizedStatus === "cancelled") {
      filter.status = "cancelled";
    } else if (["draft", "published", "cancelled", "completed"].includes(normalizedStatus)) {
      filter.status = normalizedStatus;
    }
  }

  let sortOption = { createdAt: -1 };
  if (sort === "date_asc") sortOption = { eventDate: 1 };
  if (sort === "date_desc") sortOption = { eventDate: -1 };
  if (sort === "created_desc") sortOption = { createdAt: -1 };

  const [events, totalEvents] = await Promise.all([
    Event.find(filter).sort(sortOption).skip(skip).limit(limit),
    Event.countDocuments(filter),
  ]);

  for (const event of events) {
    await autoCompleteEventIfNeeded(event);
  }

  const totalPages = Math.max(Math.ceil(totalEvents / limit), 1);

  return success(res, {
    data: {
      events,
      currentPage: page,
      totalPages,
      totalEvents,
    },
  });
});

const getEventById = asyncHandler(async (req, res) => {
  const event = await Event.findById(req.params.id);
  if (!event) {
    throw new AppError("Event not found", 404, "EVENT_NOT_FOUND");
  }

  if (req.user.role !== "admin" && String(event.owner) !== String(req.user._id)) {
    throw new AppError("Forbidden", 403, "FORBIDDEN");
  }

  await autoCompleteEventIfNeeded(event);

  return success(res, { data: { event } });
});

const createEvent = asyncHandler(async (req, res) => {
  const {
    title,
    description,
    eventDate,
    category,
    status,
    capacity,
    mode,
    meetingLink,
    venueAddress,
    reminderEnabled,
    reminderType,
    reminderAt,
  } = req.body;

  const normalizedStatus = status ? String(status).toLowerCase() : "draft";
  if (!["draft", "published"].includes(normalizedStatus)) {
    throw new AppError(
      "Invalid initial status. Allowed: draft, published",
      400,
      "INVALID_INITIAL_STATUS",
    );
  }

  const locationAndReminder = buildLocationAndReminderData({
    source: {
      mode,
      meetingLink,
      venueAddress,
      reminderEnabled,
      reminderType,
      reminderAt,
      eventDate,
    },
    existing: { eventDate },
    requireMode: true,
  });

  if (locationAndReminder.error) {
    throw new AppError(locationAndReminder.error, 400, "INVALID_EVENT_DATA");
  }

  const event = await Event.create({
    title,
    description: description || "",
    eventDate,
    category: category || "Personal",
    status: normalizedStatus,
    owner: req.user._id,
    capacity: Number.isFinite(Number(capacity)) ? Number(capacity) : 0,
    attendees: [],
    attendeesCount: 0,
    ...locationAndReminder.value,
  });

  return success(res, {
    status: 201,
    message: "Event created successfully",
    data: { event },
  });
});

const updateEvent = asyncHandler(async (req, res) => {
  const event = await Event.findById(req.params.id);
  if (!event) {
    throw new AppError("Event not found", 404, "EVENT_NOT_FOUND");
  }

  if (req.user.role !== "admin" && String(event.owner) !== String(req.user._id)) {
    throw new AppError("Forbidden", 403, "FORBIDDEN");
  }

  if (req.body.status !== undefined) {
    const nextStatus = String(req.body.status).toLowerCase();
    if (!isValidStatusTransition(event.status, nextStatus)) {
      throw new AppError(
        `Invalid status transition: ${event.status} -> ${nextStatus}`,
        400,
        "INVALID_STATUS_TRANSITION",
      );
    }
    event.status = nextStatus;
  }

  const locationAndReminder = buildLocationAndReminderData({
    source: req.body,
    existing: event,
    requireMode: false,
  });

  if (locationAndReminder.error) {
    throw new AppError(locationAndReminder.error, 400, "INVALID_EVENT_DATA");
  }

  const allowedFields = [
    "title",
    "description",
    "eventDate",
    "category",
    "capacity",
    "coverImageUrl",
    "ticketType",
    "ticketPrice",
  ];

  allowedFields.forEach((field) => {
    if (req.body[field] !== undefined) {
      event[field] = req.body[field];
    }
  });

  Object.assign(event, locationAndReminder.value);

  await event.save();

  return success(res, {
    message: "Event updated successfully",
    data: { event },
  });
});

const deleteEvent = asyncHandler(async (req, res) => {
  const event = await Event.findById(req.params.id);
  if (!event) {
    throw new AppError("Event not found", 404, "EVENT_NOT_FOUND");
  }

  if (req.user.role !== "admin" && String(event.owner) !== String(req.user._id)) {
    throw new AppError("Forbidden", 403, "FORBIDDEN");
  }

  await event.deleteOne();

  return success(res, { message: "Delete event successfully" });
});

const joinEvent = asyncHandler(async (req, res) => {
  const event = await Event.findById(req.params.id);
  if (!event) {
    throw new AppError("Event not found", 404, "EVENT_NOT_FOUND");
  }

  const userId = String(req.user._id);
  const alreadyJoined = event.attendees.some((id) => String(id) === userId);
  if (alreadyJoined) {
    throw new AppError("You already joined this event", 400, "ALREADY_JOINED");
  }

  if (event.capacity > 0 && event.attendeesCount >= event.capacity) {
    throw new AppError("Event is full", 400, "EVENT_FULL");
  }

  event.attendees.push(req.user._id);
  event.attendeesCount = event.attendees.length;
  await event.save();

  return success(res, {
    message: "Joined event successfully",
    data: { attendeesCount: event.attendeesCount },
  });
});

const leaveEvent = asyncHandler(async (req, res) => {
  const event = await Event.findById(req.params.id);
  if (!event) {
    throw new AppError("Event not found", 404, "EVENT_NOT_FOUND");
  }

  const userId = String(req.user._id);
  const isJoined = event.attendees.some((id) => String(id) === userId);
  if (!isJoined) {
    throw new AppError("You have not joined this event", 400, "NOT_JOINED");
  }

  event.attendees = event.attendees.filter((id) => String(id) !== userId);
  event.attendeesCount = event.attendees.length;
  await event.save();

  return success(res, {
    message: "Left event successfully",
    data: { attendeesCount: event.attendeesCount },
  });
});

const getEventAttendees = asyncHandler(async (req, res) => {
  const event = await Event.findById(req.params.id).populate(
    "attendees",
    "name email avatar",
  );

  if (!event) {
    throw new AppError("Event not found", 404, "EVENT_NOT_FOUND");
  }

  return success(res, {
    data: {
      attendees: event.attendees,
      attendeesCount: event.attendeesCount,
      capacity: event.capacity,
    },
  });
});

const getPublicEvents = asyncHandler(async (req, res) => {
  const { search, category, sort } = req.query;
  const page = Math.max(parseInt(req.query.page, 10) || 1, 1);
  const limit = Math.min(Math.max(parseInt(req.query.limit, 10) || 10, 1), 100);
  const skip = (page - 1) * limit;

  await markPastPublishedAsCompleted();

  const filter = { status: "published" };

  if (search && search.trim()) {
    filter.title = { $regex: search.trim(), $options: "i" };
  }

  if (category && category.trim()) {
    filter.category = category.trim();
  }

  let sortOption = { eventDate: 1 };
  if (sort === "date_desc") sortOption = { eventDate: -1 };
  if (sort === "created_desc") sortOption = { createdAt: -1 };

  const [events, totalEvents] = await Promise.all([
    Event.find(filter).sort(sortOption).skip(skip).limit(limit),
    Event.countDocuments(filter),
  ]);

  const totalPages = Math.max(Math.ceil(totalEvents / limit), 1);

  return success(res, {
    data: {
      events,
      currentPage: page,
      totalPages,
      totalEvents,
    },
  });
});

module.exports = {
  getEvents,
  getEventById,
  createEvent,
  updateEvent,
  deleteEvent,
  joinEvent,
  leaveEvent,
  getEventAttendees,
  getPublicEvents,
};
