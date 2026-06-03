const multer = require("multer")

const {
  CloudinaryStorage,
} = require("multer-storage-cloudinary")

const cloudinary = require("../config/cloudinary")

const storage =
  new CloudinaryStorage({
    cloudinary,

    params: async (req, file) => ({
      folder: "second-brain-files",

      resource_type: "auto",

      public_id:
        Date.now() +
        "-" +
        file.originalname
          .split(".")[0],
    }),
  })

const upload = multer({
  storage,
})

module.exports = upload
const fs = require("fs")

const uploadDir = path.join(__dirname, "../uploads/documents")

if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true })
}



  filename(req, file, cb) {
    const uniqueName =
      Date.now() +
      "-" +
      Math.round(Math.random() * 1e9) +
      path.extname(file.originalname)

    cb(null, uniqueName)
  },
})

const fileFilter = (req, file, cb) => {
  const allowedTypes = [
    "application/pdf",
    "image/jpeg",
    "image/png",
    "image/webp",
    "application/msword",
    "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
  ]

  if (allowedTypes.includes(file.mimetype)) {
    cb(null, true)
  } else {
    cb(new Error("Only PDF, image, DOC, and DOCX files are allowed"))
  }
}

const uploadDocument = multer({
  storage,
  fileFilter,
  limits: {
    fileSize: 10 * 1024 * 1024,
  },
})

module.exports = uploadDocument