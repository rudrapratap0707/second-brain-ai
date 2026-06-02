const Note = require("../models/Note")
const Chat = require("../models/Chat")

const globalSearch = async (req, res) => {
  try {
    const userId = req.user._id || req.user.id
    const query = req.query.q

    if (!query) {
      return res.status(400).json({
        message: "Search query is required",
      })
    }

    const notes = await Note.find({
      user: userId,
      $or: [
        { title: { $regex: query, $options: "i" } },
        { content: { $regex: query, $options: "i" } },
      ],
    }).limit(10)

    const chats = await Chat.find({
      user: userId,
      $or: [
        { title: { $regex: query, $options: "i" } },
        { "messages.text": { $regex: query, $options: "i" } },
      ],
    })
      .select("title messages createdAt updatedAt")
      .limit(10)

    res.status(200).json({
      notes,
      chats,
    })
  } catch (error) {
    res.status(500).json({
      message: error.message,
    })
  }
}

module.exports = {
  globalSearch,
}