const Note = require("../models/Note")
const File = require("../models/File")
const Chat = require("../models/Chat")
const Mood = require("../models/Mood")
const Reminder = require("../models/Reminder")

const getDashboardStats = async (req, res) => {
  try {
    const userId = req.user._id || req.user.id

    // NOTES
    const totalNotes = await Note.countDocuments({
      user: userId,
    })

    // FILES
    const totalFiles = await File.countDocuments({
      user: userId,
    })

    // CHATS
    const totalChats = await Chat.countDocuments({
      user: userId,
    })

    // REMINDERS
    const reminders = await Reminder.find({
      user: userId,
    })

    const pendingReminders = reminders.filter(
      (item) => !item.completed
    ).length

    const completedReminders = reminders.filter(
      (item) => item.completed
    ).length

    const completionRate =
      reminders.length > 0
        ? Math.round(
            (completedReminders / reminders.length) * 100
          )
        : 0

    // MOODS
    const moods = await Mood.find({
      user: userId,
    }).sort({ createdAt: -1 })

    const latestMood = moods[0] || null

    const averageMoodScore =
      moods.length > 0
        ? (
            moods.reduce(
              (sum, mood) =>
                sum + Number(mood.score || 0),
              0
            ) / moods.length
          ).toFixed(1)
        : "0"

    // RECENT ACTIVITY
    const recentNotes = await Note.find({
      user: userId,
    })
      .sort({ createdAt: -1 })
      .limit(3)

    const recentFiles = await File.find({
      user: userId,
    })
      .sort({ createdAt: -1 })
      .limit(3)

    res.status(200).json({
      stats: {
        totalNotes,
        totalFiles,
        totalChats,
        pendingReminders,
        completedReminders,
        completionRate,
        latestMood,
        averageMoodScore,
      },

      recentActivity: {
        recentNotes,
        recentFiles,
      },
    })
  } catch (error) {
    res.status(500).json({
      message: error.message,
    })
  }
}

module.exports = {
  getDashboardStats,
}