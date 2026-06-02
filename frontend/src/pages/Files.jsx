import {
  useEffect,
  useState,
} from "react"

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
} from "lucide-react"

function Files() {
  const [selectedFile, setSelectedFile] =
    useState(null)

  const [files, setFiles] = useState([])

  const [loading, setLoading] =
    useState(false)

  const [uploading, setUploading] =
    useState(false)

  // FETCH FILES
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

  // HANDLE FILE SELECT
  const handleFileChange = (e) => {
    setSelectedFile(e.target.files[0])
  }

  // HANDLE UPLOAD
  const handleUpload = async () => {
    if (!selectedFile) {
      alert("Please select a file first")
      return
    }
    try {
      setUploading(true)

      const formData = new FormData()

      formData.append(
        "file",
        selectedFile
      )

      await uploadFile(formData)

      setSelectedFile(null)

      fetchFiles()
    } catch (error) {
      console.log(error)
    } finally {
      setUploading(false)
    }
  }

  // HANDLE DELETE
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
      <div className="max-w-7xl mx-auto">
        {/* HEADER */}
        <div className="flex items-center gap-4 mb-10">
          <Brain
            className="text-cyan-400"
            size={42}
          />

          <div>
            <h1 className="text-5xl font-bold">
              AI Files
            </h1>

            <p className="text-slate-400 mt-2">
              Upload PDFs and documents
              for AI-powered memory and
              search.
            </p>
          </div>
        </div>

        {/* UPLOAD CARD */}
        <div className="bg-white/10 border border-white/10 rounded-[32px] p-8 backdrop-blur-xl mb-10">
          <div className="flex items-center gap-3 mb-6">
            <Upload
              className="text-cyan-400"
              size={28}
            />

            <h2 className="text-2xl font-bold">
              Upload File
            </h2>
          </div>

          <div className="border-2 border-dashed border-white/10 rounded-3xl p-10 text-center">
            <label className="block cursor-pointer mb-6">
              <input
                type="file"
                accept=".pdf,.txt,.doc,.docx"
                onChange={handleFileChange}
                className="hidden"
              />

              <div className="bg-white/10 hover:bg-white/20 border border-white/10 rounded-2xl px-6 py-5 text-white transition">
                {selectedFile
                  ? selectedFile.name
                  : "Click here to choose a file"}
              </div>
            </label>

            {selectedFile && (
              <div className="mb-6">
                <p className="text-cyan-300 font-medium">
                  {selectedFile.name}
                </p>

                <p className="text-slate-400 text-sm mt-2">
                  {(
                    selectedFile.size /
                    1024 /
                    1024
                  ).toFixed(2)}{" "}
                  MB
                </p>
              </div>
            )}

            <button
              onClick={handleUpload}
              disabled={
                !selectedFile || uploading
              }
              className="bg-cyan-500 hover:bg-cyan-400 disabled:opacity-50 transition px-7 py-4 rounded-2xl text-black font-bold"
            >
              {uploading
                ? "Uploading..."
                : "Upload File"}
            </button>
          </div>
        </div>

        {/* STATS */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
          <div className="bg-white/10 border border-white/10 rounded-3xl p-6">
            <h3 className="text-slate-400">
              Total Files
            </h3>

            <p className="text-5xl font-bold mt-4">
              {files.length}
            </p>
          </div>

          <div className="bg-white/10 border border-white/10 rounded-3xl p-6">
            <h3 className="text-slate-400">
              AI Ready
            </h3>

            <p className="text-4xl font-bold mt-5 text-cyan-300">
              Active
            </p>
          </div>

          <div className="bg-white/10 border border-white/10 rounded-3xl p-6">
            <h3 className="text-slate-400">
              Storage
            </h3>

            <p className="text-4xl font-bold mt-5">
              Local
            </p>
          </div>
        </div>

        {/* FILE GRID */}
        {loading ? (
          <div className="flex items-center justify-center py-20">
            <Loader2 className="animate-spin text-cyan-400" />
          </div>
        ) : (
          <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-7">
            {files.length === 0 && (
              <div className="col-span-full bg-white/10 border border-white/10 rounded-3xl p-12 text-center">
                <File
                  size={60}
                  className="mx-auto text-slate-500 mb-5"
                />

                <h2 className="text-3xl font-bold mb-4">
                  No Files Uploaded
                </h2>

                <p className="text-slate-400">
                  Upload PDFs or study
                  material to build your AI
                  second brain.
                </p>
              </div>
            )}

            {files.map((file) => (
              <div
                key={file._id}
                className="bg-white/10 border border-white/10 rounded-[32px] p-7 backdrop-blur-xl hover:bg-white/15 transition"
              >
                <div className="flex items-start justify-between gap-4">
                  <div className="flex items-start gap-3">
                    <FileText
                      size={28}
                      className="text-cyan-400 mt-1"
                    />

                    <div>
                      <h2 className="text-xl font-bold text-white break-all">
                        {file.originalName}
                      </h2>

                      <p className="text-slate-400 text-sm mt-2">
                        {(
                          file.size /
                          1024 /
                          1024
                        ).toFixed(2)}{" "}
                        MB
                      </p>

                      <p className="text-slate-500 text-xs mt-2">
                        {new Date(
                          file.createdAt
                        ).toLocaleString()}
                      </p>
                    </div>
                  </div>
                </div>

                {/* AI EXTRACTION */}
                <div className="mt-6 bg-black/20 rounded-2xl p-4 border border-white/5">
                  <p className="text-cyan-300 font-medium mb-3">
                    AI Extracted Text
                  </p>

                  <p className="text-slate-400 text-sm line-clamp-6 whitespace-pre-line">
                    {file.extractedText
                      ? file.extractedText
                          .slice(0, 500)
                          .trim()
                      : "No text extracted."}
                  </p>
                </div>

                {/* ACTIONS */}
                <div className="flex gap-3 mt-6">
                  <button
                    onClick={() =>
                      handleDelete(file._id)
                    }
                    className="flex items-center gap-2 bg-red-500 hover:bg-red-400 transition px-5 py-3 rounded-2xl text-white font-medium"
                  >
                    <Trash2 size={18} />
                    Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </DashboardLayout>
  )
}

export default Files