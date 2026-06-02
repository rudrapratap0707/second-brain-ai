const Mood = require("../models/Mood")

// CREATE MOOD
const createMood = async (req, res) => {
  try {
    const { mood, score, note } = req.body

    if (!mood || !score) {
      return res.status(400).json({
        message: "Mood and score are required",
      })
    }

    const newMood = await Mood.create({
      user: req.user._id || req.user.id,
      mood,
      score,
      note,
    })

    res.status(201).json({
      message: "Mood saved successfully",
      mood: newMood,
    })
  } catch (error) {
    res.status(500).json({
      message: error.message,
    })
  }
}

// GET MOODS
const getMoods = async (req, res) => {
  try {
    const moods = await Mood.find({
      user: req.user._id || req.user.id,
    }).sort({ createdAt: -1 })

    res.status(200).json({
      moods,
    })
  } catch (error) {
    res.status(500).json({
      message: error.message,
    })
  }
}

// DELETE MOOD
const deleteMood = async (req, res) => {
  try {
    const mood = await Mood.findOne({
      _id: req.params.id,
      user: req.user._id || req.user.id,
    })

    if (!mood) {
      return res.status(404).json({
        message: "Mood not found",
      })
    }

    await mood.deleteOne()

    res.status(200).json({
      message: "Mood deleted successfully",
    })
  } catch (error) {
    res.status(500).json({
      message: error.message,
    })
  }
}

module.exports = {
  createMood,
  getMoods,
  deleteMood,
}