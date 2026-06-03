const File = require("../models/File")
const cloudinary = require("../config/cloudinary")

// UPLOAD FILE
const uploadFile = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        message: "No file uploaded",
      })
    }

    console.log("UPLOADED FILE:", req.file)

    const cloudinaryUrl =
      req.file.secure_url ||
      req.file.path ||
      req.file.url

    const publicId =
      req.file.public_id ||
      req.file.filename

    if (
      !cloudinaryUrl ||
      !cloudinaryUrl.startsWith("http")
    ) {
      return res.status(500).json({
        message:
          "Cloudinary upload failed. Valid URL not received.",
        file: req.file,
      })
    }

    const newFile = await File.create({
      user: req.user._id || req.user.id,

      originalName:
        req.file.originalname,

      fileName:
        req.file.originalname,

      filePath:
        cloudinaryUrl,

      fileUrl:
        cloudinaryUrl,

      cloudinaryPublicId:
        publicId,

      mimeType:
        req.file.mimetype,

      size:
        req.file.size,

      extractedText:
        "File uploaded successfully. AI extraction for Cloudinary files will be added later.",
    })

    res.status(201).json({
      message:
        "File uploaded successfully",
      file: newFile,
    })
  } catch (error) {
    console.log(
      "UPLOAD ERROR:",
      error
    )

    res.status(500).json({
      message:
        "File upload failed",
      error:
        error.message,
    })
  }
}

// GET USER FILES
const getFiles = async (
  req,
  res
) => {
  try {
    const files =
      await File.find({
        user:
          req.user._id ||
          req.user.id,
      }).sort({
        createdAt: -1,
      })

    res.status(200).json({
      files,
    })
  } catch (error) {
    res.status(500).json({
      message:
        error.message,
    })
  }
}

// DELETE FILE
const deleteFile = async (
  req,
  res
) => {
  try {
    const file =
      await File.findById(
        req.params.id
      )

    if (!file) {
      return res.status(404).json({
        message:
          "File not found",
      })
    }

    if (
      file.user.toString() !==
      (
        req.user._id ||
        req.user.id
      ).toString()
    ) {
      return res.status(401).json({
        message:
          "Unauthorized",
      })
    }

    if (
      file.cloudinaryPublicId
    ) {
      try {
        await cloudinary.uploader.destroy(
          file.cloudinaryPublicId,
          {
            resource_type:
              "auto",
          }
        )
      } catch (
        cloudinaryError
      ) {
        console.log(
          "Cloudinary delete error:",
          cloudinaryError.message
        )
      }
    }

    await file.deleteOne()

    res.status(200).json({
      message:
        "File deleted successfully",
    })
  } catch (error) {
    res.status(500).json({
      message:
        error.message,
    })
  }
}

module.exports = {
  uploadFile,
  getFiles,
  deleteFile,
}
