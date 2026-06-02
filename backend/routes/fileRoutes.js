const express = require("express")
const multer = require("multer")

const {
  uploadFile,
  getFiles,
  deleteFile,
} = require("../controllers/fileController")

const protect = require("../middleware/authMiddleware")

const router = express.Router()

// STORAGE CONFIG
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "uploads/")
  },

  filename: function (req, file, cb) {
    const uniqueName =
      Date.now() + "-" + file.originalname

    cb(null, uniqueName)
  },
})

const upload = multer({
  storage,
})

router.post(
  "/upload",
  protect,
  upload.single("file"),
  uploadFile
)

router.get("/", protect, getFiles)

router.delete("/:id", protect, deleteFile)

module.exports = router