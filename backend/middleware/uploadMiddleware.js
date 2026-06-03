const multer = require("multer")
const { CloudinaryStorage } = require("multer-storage-cloudinary")
const cloudinary = require("../config/cloudinary")

const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
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

const upload = multer({
  storage,
  limits: {
    fileSize: 10 * 1024 * 1024,
  },
})

module.exports = upload