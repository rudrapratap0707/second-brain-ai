import { useEffect, useState } from "react"

import DashboardLayout from "../layouts/DashboardLayout"

import {
  uploadFile,
  getFiles,
  deleteFile,
} from "../services/authService"

import {
  Upload,
  FileText,
  Trash2,
  Brain,
  Loader2,
  File,
  CheckCircle2,
  HardDrive,
} from "lucide-react"

function Files() {
  const [selectedFile, setSelectedFile] = useState(null)
  const [files, setFiles] = useState([])
  const [loading, setLoading] = useState(false)
  const [uploading, setUploading] = useState(false)

  const fetchFiles = async () => {
    try {
      setLoading(true)

      const data = await getFiles()

      setFiles(data.files || [])
    } catch (error) {
      console.log(error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchFiles()
  }, [])

  const handleFileChange = (e) => {
    setSelectedFile(e.target.files?.[0] || null)
  }

  const handleUpload = async () => {
    if (!selectedFile) {
      alert("Please select a file first")
      return
    }

    try {
      setUploading(true)

      const formData = new FormData()
      formData.append("file", selectedFile)

      await uploadFile(formData)

      setSelectedFile(null)
      fetchFiles()
    } catch (error) {
      console.log(error)
    } finally {
      setUploading(false)
    }
  }

  const handleDelete = async (id) => {
    try {
      await deleteFile(id)
      fetchFiles()
    } catch (error) {
      console.log(error)
    }
  }

  return (
    <DashboardLayout>
      <div className="page-shell mx-auto max-w-7xl space-y-5 md:space-y-8">
        <section className="relative overflow-hidden rounded-3xl border border-white/10 bg-white/10 p-4 backdrop-blur-xl md:rounded-[32px] md:p-8">
          <div className="absolute -right-20 -top-20 h-56 w-56 rounded-full bg-cyan-500/20 blur-3xl" />
          <div className="absolute -bottom-20 -left-20 h-56 w-56 rounded-full bg-purple-500/20 blur-3xl" />

          <div className="relative z-10 flex flex-col gap-4 sm:flex-row sm:items-start">
            <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-cyan-500/20 text-cyan-300 md:h-16 md:w-16">
              <Brain size={34} />
            </div>

            <div>
              <h1 className="text-2xl font-extrabold leading-tight text-white sm:text-3xl md:text-5xl">
                AI Files
              </h1>

              <p className="mt-3 max-w-2xl text-sm leading-7 text-slate-400 md:text-base">
                Upload PDFs and documents for AI-powered memory, search, and
                document-based learning.
              </p>
            </div>
          </div>
        </section>

        <section className="grid grid-cols-1 gap-4 md:grid-cols-3">
          <MiniStat title="Total Files" value={files.length} icon={FileText} />
          <MiniStat title="AI Ready" value="Active" icon={CheckCircle2} highlight />
          <MiniStat title="Storage" value="Local" icon={HardDrive} />
        </section>

        <section className="grid grid-cols-1 gap-5 xl:grid-cols-[0.85fr_1.15fr]">
          <div className="rounded-3xl border border-white/10 bg-white/10 p-4 backdrop-blur-xl md:rounded-[32px] md:p-6">
            <div className="mb-5 flex items-center gap-3">
              <Upload className="text-cyan-400" size={24} />

              <h2 className="text-xl font-bold text-white md:text-2xl">
                Upload File
              </h2>
            </div>

            <div className="rounded-3xl border border-dashed border-white/10 bg-black/10 p-4 text-center md:p-6">
              <label className="block cursor-pointer">
                <input
                  type="file"
                  accept=".pdf,.txt,.doc,.docx"
                  onChange={handleFileChange}
                  className="hidden"
                />

                <div className="rounded-2xl border border-white/10 bg-white/10 px-4 py-4 text-sm text-white transition hover:bg-white/20 md:px-6 md:py-5 md:text-base">
                  {selectedFile
                    ? selectedFile.name
                    : "Click here to choose a file"}
                </div>
              </label>

              {selectedFile && (
                <div className="mt-5 rounded-2xl border border-cyan-400/20 bg-cyan-500/10 p-4 text-left">
                  <p className="break-all text-sm font-semibold text-cyan-300 md:text-base">
                    {selectedFile.name}
                  </p>

                  <p className="mt-2 text-sm text-slate-400">
                    {formatFileSize(selectedFile.size)}
                  </p>
                </div>
              )}

              <button
                onClick={handleUpload}
                disabled={!selectedFile || uploading}
                className="mt-5 flex w-full items-center justify-center gap-2 rounded-2xl bg-cyan-500 px-5 py-3 text-sm font-bold text-black transition hover:bg-cyan-400 disabled:opacity-50 md:text-base"
              >
                {uploading && <Loader2 size={18} className="animate-spin" />}
                {uploading ? "Uploading..." : "Upload File"}
              </button>

              <p className="mt-4 text-xs leading-6 text-slate-500 md:text-sm">
                Supported formats: PDF, TXT, DOC, DOCX.
              </p>
            </div>
          </div>

          <div className="rounded-3xl border border-white/10 bg-white/10 p-4 backdrop-blur-xl md:rounded-[32px] md:p-6">
            <div className="mb-5 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <h2 className="text-xl font-bold text-white md:text-2xl">
                  File Library
                </h2>

                <p className="mt-1 text-sm text-slate-400">
                  {files.length} file(s) uploaded
                </p>
              </div>
            </div>

            {loading ? (
              <div className="flex items-center justify-center py-16">
                <Loader2 className="animate-spin text-cyan-400" size={34} />
              </div>
            ) : files.length === 0 ? (
              <EmptyFiles />
            ) : (
              <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
                {files.map((file) => (
                  <FileCard
                    key={file._id}
                    file={file}
                    onDelete={handleDelete}
                  />
                ))}
              </div>
            )}
          </div>
        </section>
      </div>
    </DashboardLayout>
  )
}

function MiniStat({ title, value, icon: Icon, highlight }) {
  return (
    <div className="rounded-3xl border border-white/10 bg-white/10 p-4 backdrop-blur-xl md:p-6">
      <div className="mb-4 flex h-11 w-11 items-center justify-center rounded-2xl bg-white/10 text-cyan-300">
        <Icon size={22} />
      </div>

      <h3 className="text-sm text-slate-400">{title}</h3>

      <p
        className={`mt-3 text-2xl font-bold md:text-4xl ${
          highlight ? "text-cyan-300" : "text-white"
        }`}
      >
        {value}
      </p>
    </div>
  )
}

function FileCard({ file, onDelete }) {
  const fileUrl =
    file.fileUrl ||
    file.url ||
    file.secureUrl ||
    file.filePath

  const isValidUrl =
    fileUrl &&
    fileUrl.startsWith("http")

  return (
    <article className="flex min-h-full flex-col rounded-3xl border border-white/10 bg-black/20 p-4 transition hover:bg-white/10 md:p-5">
      <div className="flex items-start gap-3">
        <div className="mt-1 shrink-0 text-cyan-400">
          <FileText size={24} />
        </div>

        <div className="min-w-0 flex-1">
          <h2 className="line-clamp-2 break-all text-lg font-bold text-white md:text-xl">
            {file.originalName}
          </h2>

          <p className="mt-2 text-sm text-slate-400">
            {formatFileSize(file.size)}
          </p>

          <p className="mt-2 text-xs text-slate-500">
            {formatDate(file.createdAt)}
          </p>
        </div>
      </div>

      {isValidUrl ? (
        <a
          href={fileUrl}
          target="_blank"
          rel="noreferrer"
          className="mt-4 flex items-center justify-center rounded-2xl border border-cyan-400/20 bg-cyan-500/10 px-4 py-3 text-sm font-semibold text-cyan-300 transition hover:bg-cyan-500/20"
        >
          Open File
        </a>
      ) : (
        <div className="mt-4 rounded-2xl border border-yellow-400/20 bg-yellow-500/10 px-4 py-3 text-sm text-yellow-300">
          Old local file URL found. Delete this file and upload again.
        </div>
      )}

      {isValidUrl &&
        file.mimeType?.startsWith("image/") && (
          <img
            src={fileUrl}
            alt={file.originalName}
            className="mt-4 h-48 w-full rounded-2xl object-cover"
          />
        )}

      <div className="mt-5 rounded-2xl border border-white/5 bg-black/20 p-4">
        <p className="mb-3 text-sm font-semibold text-cyan-300">
          AI Extracted Text
        </p>

        <p className="line-clamp-6 whitespace-pre-line text-sm leading-6 text-slate-400">
          {file.extractedText
            ? file.extractedText.slice(0, 500).trim()
            : "No text extracted."}
        </p>
      </div>

      <div className="mt-5">
        <button
          onClick={() => onDelete(file._id)}
          className="flex w-full items-center justify-center gap-2 rounded-2xl bg-red-500 px-4 py-3 text-sm font-semibold text-white transition hover:bg-red-400"
        >
          <Trash2 size={17} />
          Delete
        </button>
      </div>
    </article>
  )
}
function EmptyFiles() {
  return (
    <div className="rounded-3xl border border-dashed border-white/20 p-8 text-center md:p-12">
      <File size={52} className="mx-auto mb-5 text-slate-500" />

      <h2 className="mb-3 text-2xl font-bold text-white md:text-3xl">
        No Files Uploaded
      </h2>

      <p className="mx-auto max-w-md text-sm leading-6 text-slate-400 md:text-base">
        Upload PDFs or study material to build your AI second brain.
      </p>
    </div>
  )
}

function formatFileSize(size) {
  const bytes = Number(size || 0)

  if (bytes <= 0) return "0 B"
  if (bytes < 1024) return `${bytes} B`
  if (bytes < 1024 * 1024) return `${Math.round(bytes / 1024)} KB`

  return `${(bytes / (1024 * 1024)).toFixed(2)} MB`
}

function formatDate(value) {
  if (!value) return "No date"

  const date = new Date(value)

  if (Number.isNaN(date.getTime())) {
    return "Invalid date"
  }

  return date.toLocaleString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  })
}

export default Files