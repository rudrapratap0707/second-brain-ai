const File = require("../models/File")
const fs = require("fs")
const path = require("path")

let pdfParse

try {
  pdfParse = require("pdf-parse")
} catch (error) {
  console.log("pdf-parse load error:", error.message)
}

// UPLOAD FILE
const uploadFile = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        message: "No file uploaded",
      })
    }

    let extractedText = ""

    if (req.file.mimetype === "application/pdf") {
      try {
        if (pdfParse) {
          const filePath = path.resolve(req.file.path)
          const dataBuffer = fs.readFileSync(filePath)
          const pdfData = await pdfParse(dataBuffer)

          extractedText = pdfData.text || ""
        }
      } catch (pdfError) {
        console.log("PDF Extract Error:", pdfError.message)

        extractedText =
          "PDF uploaded successfully, but text extraction failed."
      }
    }

    const newFile = await File.create({
      user: req.user._id || req.user.id,
      originalName: req.file.originalname,
      fileName: req.file.filename,
      filePath: req.file.path,
      mimeType: req.file.mimetype,
      size: req.file.size,
      extractedText,
    })

    res.status(201).json({
      message: "File uploaded successfully",
      file: newFile,
    })
  } catch (error) {
    console.log("UPLOAD ERROR:", error)

    res.status(500).json({
      message: "File upload failed",
      error: error.message,
    })
  }
}

// GET USER FILES
const getFiles = async (req, res) => {
  try {
    const files = await File.find({
      user: req.user._id || req.user.id,
    }).sort({
      createdAt: -1,
    })

    res.status(200).json({
      files,
    })
  } catch (error) {
    res.status(500).json({
      message: error.message,
    })
  }
}

// DELETE FILE
const deleteFile = async (req, res) => {
  try {
    const file = await File.findById(req.params.id)

    if (!file) {
      return res.status(404).json({
        message: "File not found",
      })
    }

    if (
      file.user.toString() !==
      (req.user._id || req.user.id).toString()
    ) {
      return res.status(401).json({
        message: "Unauthorized",
      })
    }

    if (fs.existsSync(file.filePath)) {
      fs.unlinkSync(file.filePath)
    }

    await file.deleteOne()

    res.status(200).json({
      message: "File deleted successfully",
    })
  } catch (error) {
    res.status(500).json({
      message: error.message,
    })
  }
}

module.exports = {
  uploadFile,
  getFiles,
  deleteFile,
}