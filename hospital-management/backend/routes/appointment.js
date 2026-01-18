const express = require("express");
const router = express.Router();
const Appointment = require("../models/Appointment");
const protect  = require("../middleware/auth");

router.get("/", protect, async (req, res) => {
  try {
    const { status, date } = req.query;
    let query = {};

    if (status) {
      query.status = status;
    }
    if (date) {
      const startDate = new Date(date);
      const endDate = new Date(date);
      endDate.setDate(endDate.getDate() + 1);
      query.date = { $gte: startDate, $lt: endDate };
    }

    const appointment = await Appointment.find(query)
      .populate("patient", "name phone")
      .populate("doctor", "name specialty")
      .sort({ date: -1 });

    res.json(appointment);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.get("/:id", protect, async (req, res) => {
  try {
    const appointment = await Appointment.findById(req.params.id)
      .populate("patient")
      .populate("doctor");
    if (!appointment) {
      return res.status(404).json({ message: "Appointment not found" });
    }
    res.json(appointment);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.post("/", protect, async (req, res) => {
  try {
    const appointment = await Appointment.create(req.body);
    const populatedAppointment = await Appointment.findById(appointment._id)
      .populate("patient", "name phone")
      .populate("doctor", "name specialty");

    res.status(201).json(populatedAppointment);
} catch (error) {
    res.status(400).json({ message: error.message });
  }
});

router.put("/:id", protect, async (req, res) => {
  try {
    const appointment = await Appointment.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    )
      .populate("patient", "name phone")
      .populate("doctor", "name specialty");

    if (!appointment) {
      return res.status(404).json({ message: "Appointment not found" });
    }
    res.json(appointment);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.patch("/:id/status", protect, async (req, res) => {
  try {
    const { status } = req.body;
    const appointment = await Appointment.findByIdAndUpdate(
      req.params.id,
      {status},
      { new: true }
    )
      .populate("patient", "name phone")
      .populate("doctor", "name specialty");

    if (!appointment) {
      return res.status(404).json({ message: "Appointment not found" });
    }
    res.json(appointment);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.delete("/:id", protect, async (req, res) => {
  try {
    const appointment = await Appointment.findByIdAndDelete(req.params.id);
    if (!appointment) {
      return res.status(404).json({ message: "Appointment not found" });
    }

    res.json({ message: "Appointment removed" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
