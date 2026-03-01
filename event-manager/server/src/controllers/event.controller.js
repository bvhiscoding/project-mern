const Event = require("../models/Event");

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
  if (!event) return event;
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
const getEvents = async (req, res) => {
  try {
    const { search, category, status, sort } = req.query;
    const page = Math.max(parseInt(req.query.page, 10) || 1, 1);
    const limit = Math.min(
      Math.max(parseInt(req.query.limit, 10) || 10, 1),
      100,
    );
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
      } else if (
        ["draft", "published", "cancelled", "completed"].includes(
          normalizedStatus,
        )
      ) {
        filter.status = normalizedStatus;
      }
    }
    let sortOption = { createdAt: -1 };
    if (sort === "date_asc") {
      sortOption = { eventDate: 1 };
    }
    if (sort === "date_desc") {
      sortOption = { eventDate: -1 };
    }
    if (sort === "created_desc") {
      sortOption = { createdAt: -1 };
    }

    const [events, totalEvents] = await Promise.all([
      Event.find(filter).sort(sortOption).skip(skip).limit(limit),
      Event.countDocuments(filter),
    ]);

    for (const event of events) {
      await autoCompleteEventIfNeeded(event);
    }

    const totalPages = Math.max(Math.ceil(totalEvents / limit), 1);

    return res.status(200).json({
      events,
      currentPage: page,
      totalPages,
      totalEvents,
    });
  } catch (error) {
    console.error(`GetEvents error: ${error}`);
    res.status(500).json({ message: error.message });
  }
};

const getEventById = async (req, res) => {
  try {
    const event = await Event.findById(req.params.id);
    if (!event) {
      return res.status(404).json({ message: "Event not found" });
    }
    if (
      req.user.role !== "admin" &&
      String(event.owner) !== String(req.user._id)
    ) {
      return res.status(403).json({ message: "Forbidden" });
    }

    await autoCompleteEventIfNeeded(event);

    return res.status(200).json({ event });
  } catch (error) {
    console.error(`GetEventById error: ${error}`);
    res.status(500).json({ message: error.message });
  }
};

const createEvent = async (req, res) => {
  try {
    const { title, description, eventDate, category, status, capacity } =
      req.body;
    if (!title || !eventDate) {
      return res
        .status(400)
        .json({ message: "Title and eventDate are required" });
    }
    const normalizedStatus = status ? String(status).toLowerCase() : "draft";
    if (!["draft", "published"].includes(normalizedStatus)) {
      return res.status(400).json({
        message: "Invalid initial status. Allowed: draft, published",
      });
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
    });

    return res.status(201).json({ event });
  } catch (error) {
    console.error(`CreateEvent error :${error}`);
    res.status(500).json({ message: error.message });
  }
};

const updateEvent = async (req, res) => {
  try {
    const event = await Event.findById(req.params.id);
    if (!event) {
      return res.status(404).json({ message: "Event not found" });
    }
    if (
      req.user.role !== "admin" &&
      String(event.owner) !== String(req.user._id)
    ) {
      return res.status(403).json({ message: "Forbidden" });
    }
    if (req.body.status !== undefined) {
      const nextStatus = String(req.body.status).toLowerCase();
      if (!isValidStatusTransition(event.status, nextStatus)) {
        return res.status(400).json({
          message: `Invalid status transition: ${event.status} -> ${nextStatus}`,
        });
      }
      event.status = nextStatus;
    }

    const allowedFields = ["title", "description", "eventDate", "category", "capacity"];
    allowedFields.forEach((field) => {
      if (req.body[field] !== undefined) {
        event[field] = req.body[field];
      }
    });
    await event.save();
    return res.status(200).json({ event });
  } catch (error) {
    console.error(`UpdateEvent error :${error}`);
    res.status(500).json({ message: error.message });
  }
};

const deleteEvent = async (req, res) => {
  try {
    const event = await Event.findById(req.params.id);
    if (!event) {
      return res.status(404).json({ message: "Event not found" });
    }
    if (
      req.user.role !== "admin" &&
      String(event.owner) !== String(req.user._id)
    ) {
      return res.status(403).json({ message: "Forbidden" });
    }
    await event.deleteOne();
    return res.status(200).json({ message: "Delete event successfully" });
  } catch (error) {
    console.error(`DeleteEvent error: ${error}`);
    res.status(500).json({ message: error.message });
  }
};

const joinEvent = async (req, res) => {
  try {
    const event = await Event.findById(req.params.id);
    if (!event) {
      return res.status(404).json({ message: "Event not found" });
    }
    const userId = String(req.user._id);
    const alreadyJoined = event.attendees.some((id) => String(id) === userId);
    if (alreadyJoined) {
      return res.status(400).json({ message: "You already joined this event" });
    }
    if (event.capacity > 0 && event.attendeesCount >= event.capacity) {
      return res.status(400).json({ message: "Event is full" });
    }

    event.attendees.push(req.user._id);
    event.attendeesCount = event.attendees.length;
    await event.save();

    return res.status(200).json({
      message: "Joined event successfully",
      attendeesCount: event.attendeesCount,
    });
  } catch (error) {
    console.error(`JoinEvent error: ${error}`);
    return res.status(500).json({ message: error.message });
  }
};

const leaveEvent = async (req, res) => {
  try {
    const event = await Event.findById(req.params.id);
    if (!event) {
      return res.status(404).json({ message: "Event not found" });
    }
    const userId = String(req.user._id);
    const isJoined = event.attendees.some((id) => String(id) === userId);
    if (!isJoined) {
      return res
        .status(400)
        .json({ message: "You have not joined this event" });
    }

    event.attendees = event.attendees.filter((id) => String(id) !== userId);
    event.attendeesCount = event.attendees.length;
    await event.save();

    return res.status(200).json({
      message: "Left event successfully",
      attendeesCount: event.attendeesCount,
    });
  } catch (error) {
    console.error(`LeaveEvent error: ${error}`);
    return res.status(500).json({ message: error.message });
  }
};
const getEventAttendees = async (req, res) => {
  try {
    const event = await Event.findById(req.params.id).populate(
      "attendees",
      "name email avatar",
    );
    if (!event) {
      return res.status(404).json({ message: "Event not found" });
    }
    return res.status(200).json({
      attendees: event.attendees,
      attendeesCount: event.attendeesCount,
      capacity: event.capacity,
    });
  } catch (error) {
    console.error(`GetEventAttendees error: ${error}`);
    return res.status(500).json({ message: error.message });
  }
};

const getPublicEvents = async (req, res) => {
  try {
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
    if (sort === "date_desc") {
      sortOption = { eventDate: -1 };
    }
    if (sort === "created_desc") {
      sortOption = { createdAt: -1 };
    }

    const [events, totalEvents] = await Promise.all([
      Event.find(filter).sort(sortOption).skip(skip).limit(limit),
      Event.countDocuments(filter),
    ]);

    const totalPages = Math.max(Math.ceil(totalEvents / limit), 1);

    return res.status(200).json({
      events,
      currentPage: page,
      totalPages,
      totalEvents,
    });
  } catch (error) {
    console.error(`GetPublicEvents error: ${error}`);
    return res.status(500).json({ message: error.message });
  }
};

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
