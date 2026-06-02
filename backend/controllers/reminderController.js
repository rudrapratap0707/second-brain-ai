const Reminder = require("../models/Reminder")

// CREATE REMINDER
const createReminder = async (req, res) => {
  try {
    const {
      title,
      description,
      dueDate,
      priority,
    } = req.body

    if (!title || !dueDate) {
      return res.status(400).json({
        message: "Title and due date are required",
      })
    }

    const reminder = await Reminder.create({
      user: req.user._id || req.user.id,
      title,
      description,
      dueDate,
      priority,
    })

    res.status(201).json({
      message: "Reminder created successfully",
      reminder,
    })
  } catch (error) {
    res.status(500).json({
      message: error.message,
    })
  }
}

// GET REMINDERS
const getReminders = async (req, res) => {
  try {
    const reminders = await Reminder.find({
      user: req.user._id || req.user.id,
    }).sort({ dueDate: 1 })

    res.status(200).json({
      reminders,
    })
  } catch (error) {
    res.status(500).json({
      message: error.message,
    })
  }
}

// TOGGLE COMPLETE
const toggleReminder = async (req, res) => {
  try {
    const reminder = await Reminder.findOne({
      _id: req.params.id,
      user: req.user._id || req.user.id,
    })

    if (!reminder) {
      return res.status(404).json({
        message: "Reminder not found",
      })
    }

    reminder.completed = !reminder.completed

    await reminder.save()

    res.status(200).json({
      message: "Reminder updated successfully",
      reminder,
    })
  } catch (error) {
    res.status(500).json({
      message: error.message,
    })
  }
}

// DELETE REMINDER
const deleteReminder = async (req, res) => {
  try {
    const reminder = await Reminder.findOne({
      _id: req.params.id,
      user: req.user._id || req.user.id,
    })

    if (!reminder) {
      return res.status(404).json({
        message: "Reminder not found",
      })
    }

    await reminder.deleteOne()

    res.status(200).json({
      message: "Reminder deleted successfully",
    })
  } catch (error) {
    res.status(500).json({
      message: error.message,
    })
  }
}

module.exports = {
  createReminder,
  getReminders,
  toggleReminder,
  deleteReminder,
}