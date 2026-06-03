const multer = require("multer")

const {
  CloudinaryStorage,
} = require("multer-storage-cloudinary")

const cloudinary = require("../config/cloudinary")

const storage = new CloudinaryStorage({
  cloudinary,

  params: async (req, file) => ({
    folder: "second-brain-files",
    resource_type: "auto",
    public_id:
      Date.now() +
      "-" +
      file.originalname
        .split(".")[0]
        .replace(/\s+/g, "-")
        .replace(/[^a-zA-Z0-9-_]/g, ""),
  }),
})

const fileFilter = (req, file, cb) => {
  const allowedTypes = [
    "application/pdf",
    "text/plain",
    "image/jpeg",
    "image/png",
    "image/webp",
    "application/msword",
    "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
  ]

  if (allowedTypes.includes(file.mimetype)) {
    cb(null, true)
  } else {
    cb(
      new Error(
        "Only PDF, TXT, image, DOC, and DOCX files are allowed"
      )
    )
  }
}

const upload = multer({
  storage,
  fileFilter,
  limits: {
    fileSize: 10 * 1024 * 1024,
  },
})

module.exports = upload