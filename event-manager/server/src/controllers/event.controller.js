const Event = require("../models/Event");

const buildOwnerFilter = (user) =>
  user.role === "admin" ? {} : { owner: user._id };

const getEvents = async (req, res) => {
  try {
    const filter = buildOwnerFilter(req.user);
    const events = await Event.find(filter).sort({ createdAt: -1 });
    return res.status(200).json({ events });
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
    if (req.user.role !== "admin" && String(event.owner) !== String(req.user._id)) {
      return res.status(403).json({ message: "Forbidden" });
    }

    return res.status(200).json({ event });
  } catch (error) {
    console.error(`GetEventById error: ${error}`);
    res.status(500).json({ message: error.message });
  }
};

const createEvent = async (req, res) => {
  try {
    const { title, description, eventDate, category, status } = req.body;
    if (!title || !eventDate) {
      return res
        .status(400)
        .json({ message: "Title and eventDate are required" });
    }
    const event = await Event.create({
      title,
      description: description || "",
      eventDate,
      category: category || "Personal",
      status: status || "draft",
      owner: req.user._id,
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
    if (req.user.role !== "admin" && String(event.owner) !== String(req.user._id)) {
      return res.status(403).json({ message: "Forbidden" });
    }
    const allowedFields = [
      "title",
      "description",
      "eventDate",
      "category",
      "status",
    ];
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

module.exports = {
  getEvents,
  getEventById,
  createEvent,
  updateEvent,
  deleteEvent,
};
