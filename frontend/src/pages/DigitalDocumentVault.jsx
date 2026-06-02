import { useEffect, useMemo, useState } from "react"

import DashboardLayout from "../layouts/DashboardLayout"

import {
  FolderOpen,
  Plus,
  Trash2,
  Loader2,
  ShieldCheck,
  Star,
  FileText,
  CalendarDays,
  Link as LinkIcon,
  Search,
  BadgeCheck,
  Archive,
  UploadCloud,
  FileCheck2,
} from "lucide-react"

import {
  createStudentDocument,
  getStudentDocuments,
  updateStudentDocument,
  deleteStudentDocument,
} from "../services/api"

const BACKEND_URL = "http://localhost:5000"

const categories = [
  "Admit Card",
  "Marksheet",
  "Certificate",
  "ID Card",
  "Syllabus",
  "Fee Receipt",
  "Scholarship",
  "NCC",
  "Project",
  "Notes",
  "Other",
]

const documentTypes = [
  "PDF",
  "Image",
  "Document",
  "Other",
]

function DigitalDocumentVault() {
  const [documents, setDocuments] = useState([])
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [search, setSearch] = useState("")
  const [filter, setFilter] = useState("All")
  const [selectedFile, setSelectedFile] = useState(null)

  const [form, setForm] = useState({
    title: "",
    category: "Other",
    documentType: "PDF",
    fileName: "",
    fileSize: 0,
    issuingAuthority: "",
    documentDate: "",
    expiryDate: "",
    tagsText: "",
    isImportant: false,
    isVerified: false,
    notes: "",
  })

  const fetchDocuments = async () => {
    try {
      setLoading(true)
      const data = await getStudentDocuments()
      setDocuments(data.documents || [])
    } catch (error) {
      console.log(error)
      alert(error.response?.data?.message || "Failed to fetch documents")
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchDocuments()
  }, [])

  const filteredDocuments = useMemo(() => {
    return documents.filter((doc) => {
      const text = `${doc.title || ""} ${doc.category || ""} ${(doc.tags || []).join(" ")}`
      const matchesSearch = text.toLowerCase().includes(search.toLowerCase())
      const matchesFilter = filter === "All" || doc.category === filter
      return matchesSearch && matchesFilter
    })
  }, [documents, search, filter])

  const analytics = useMemo(() => {
    return {
      total: documents.length,
      important: documents.filter((doc) => doc.isImportant).length,
      verified: documents.filter((doc) => doc.isVerified).length,
      categories: new Set(documents.map((doc) => doc.category)).size,
    }
  }, [documents])

  const toArray = (text) => {
    return text
      .split(",")
      .map((item) => item.trim())
      .filter(Boolean)
  }

  const detectDocumentType = (file) => {
    if (!file) return "Other"

    if (file.type === "application/pdf") return "PDF"
    if (file.type.startsWith("image/")) return "Image"

    if (
      file.type === "application/msword" ||
      file.type ===
        "application/vnd.openxmlformats-officedocument.wordprocessingml.document"
    ) {
      return "Document"
    }

    return "Other"
  }

  const handleFileSelect = (file) => {
    if (!file) return

    setSelectedFile(file)

    setForm((prev) => ({
      ...prev,
      fileName: file.name,
      fileSize: file.size,
      documentType: detectDocumentType(file),
    }))
  }

  const handleCreateDocument = async () => {
    try {
      if (!form.title) {
        return alert("Document title required")
      }

      if (!selectedFile) {
        return alert("Please select a file from your device")
      }

      setSaving(true)

      const formData = new FormData()

      formData.append("title", form.title)
      formData.append("category", form.category)
      formData.append("documentType", form.documentType)
      formData.append("fileName", form.fileName)
      formData.append("fileSize", String(form.fileSize || 0))
      formData.append("issuingAuthority", form.issuingAuthority)
      formData.append("documentDate", form.documentDate || "")
      formData.append("expiryDate", form.expiryDate || "")
      formData.append("tags", JSON.stringify(toArray(form.tagsText)))
      formData.append("isImportant", String(form.isImportant))
      formData.append("isVerified", String(form.isVerified))
      formData.append("notes", form.notes)
      formData.append("file", selectedFile)

      await createStudentDocument(formData)

      setForm({
        title: "",
        category: "Other",
        documentType: "PDF",
        fileName: "",
        fileSize: 0,
        issuingAuthority: "",
        documentDate: "",
        expiryDate: "",
        tagsText: "",
        isImportant: false,
        isVerified: false,
        notes: "",
      })

      setSelectedFile(null)
      fetchDocuments()
    } catch (error) {
      console.log(error)
      alert(error.response?.data?.message || "Failed to upload document")
    } finally {
      setSaving(false)
    }
  }

  const handleDelete = async (id) => {
    try {
      await deleteStudentDocument(id)
      fetchDocuments()
    } catch (error) {
      console.log(error)
    }
  }

  const toggleImportant = async (doc) => {
    try {
      await updateStudentDocument(doc._id, {
        isImportant: !doc.isImportant,
      })

      fetchDocuments()
    } catch (error) {
      console.log(error)
    }
  }

  const toggleVerified = async (doc) => {
    try {
      await updateStudentDocument(doc._id, {
        isVerified: !doc.isVerified,
      })

      fetchDocuments()
    } catch (error) {
      console.log(error)
    }
  }

  return (
    <DashboardLayout>
      <div className="space-y-8">
        <section className="relative overflow-hidden rounded-[36px] border border-white/10 bg-white/10 p-8 backdrop-blur-xl">
          <div className="absolute -right-24 -top-24 h-80 w-80 rounded-full bg-violet-500/20 blur-3xl" />
          <div className="absolute -bottom-24 -left-24 h-80 w-80 rounded-full bg-cyan-500/20 blur-3xl" />

          <div className="relative z-10 flex flex-col gap-6 xl:flex-row xl:items-center xl:justify-between">
            <div className="flex items-center gap-5">
              <div className="flex h-20 w-20 items-center justify-center rounded-3xl bg-violet-500 text-white">
                <FolderOpen size={42} />
              </div>

              <div>
                <div className="mb-3 inline-flex items-center gap-2 rounded-full border border-violet-400/30 bg-violet-400/10 px-4 py-2 text-sm font-semibold text-violet-200">
                  <ShieldCheck size={16} />
                  Secure Student Vault
                </div>

                <h1 className="text-4xl font-bold text-white md:text-5xl">
                  Digital Document Vault
                </h1>

                <p className="mt-4 max-w-3xl text-slate-300">
                  Upload and organize academic documents, certificates, admit
                  cards, marksheets, syllabus, receipts, and student files.
                </p>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
              <Metric label="Docs" value={analytics.total} />
              <Metric label="Important" value={analytics.important} />
              <Metric label="Verified" value={analytics.verified} />
              <Metric label="Categories" value={analytics.categories} />
            </div>
          </div>
        </section>

        <div className="grid grid-cols-1 gap-8 xl:grid-cols-3">
          <section className="rounded-[32px] border border-white/10 bg-white/10 p-7 backdrop-blur-xl">
            <h2 className="mb-6 text-2xl font-bold text-white">
              Upload Document
            </h2>

            <div className="space-y-5">
              <Input
                label="Document Title"
                value={form.title}
                onChange={(v) =>
                  setForm({
                    ...form,
                    title: v,
                  })
                }
              />

              <Select
                label="Category"
                value={form.category}
                onChange={(v) =>
                  setForm({
                    ...form,
                    category: v,
                  })
                }
                options={categories}
              />

              <Select
                label="Document Type"
                value={form.documentType}
                onChange={(v) =>
                  setForm({
                    ...form,
                    documentType: v,
                  })
                }
                options={documentTypes}
              />

              <FilePicker
                selectedFile={selectedFile}
                onFileSelect={handleFileSelect}
              />

              <Input
                label="Issuing Authority"
                value={form.issuingAuthority}
                onChange={(v) =>
                  setForm({
                    ...form,
                    issuingAuthority: v,
                  })
                }
              />

              <Input
                type="date"
                label="Document Date"
                value={form.documentDate}
                onChange={(v) =>
                  setForm({
                    ...form,
                    documentDate: v,
                  })
                }
              />

              <Input
                type="date"
                label="Expiry Date"
                value={form.expiryDate}
                onChange={(v) =>
                  setForm({
                    ...form,
                    expiryDate: v,
                  })
                }
              />

              <Textarea
                label="Tags"
                value={form.tagsText}
                onChange={(v) =>
                  setForm({
                    ...form,
                    tagsText: v,
                  })
                }
                placeholder="Comma separated: semester, BCA, exam"
              />

              <Textarea
                label="Notes"
                value={form.notes}
                onChange={(v) =>
                  setForm({
                    ...form,
                    notes: v,
                  })
                }
              />

              <Toggle
                label="Mark Important"
                checked={form.isImportant}
                onChange={(v) =>
                  setForm({
                    ...form,
                    isImportant: v,
                  })
                }
              />

              <Toggle
                label="Mark Verified"
                checked={form.isVerified}
                onChange={(v) =>
                  setForm({
                    ...form,
                    isVerified: v,
                  })
                }
              />

              <button
                type="button"
                onClick={handleCreateDocument}
                disabled={saving}
                className="flex w-full items-center justify-center gap-2 rounded-2xl bg-violet-500 px-5 py-4 font-bold text-white disabled:opacity-60"
              >
                {saving ? (
                  <Loader2 className="animate-spin" size={20} />
                ) : (
                  <Plus size={20} />
                )}
                Upload Document
              </button>
            </div>
          </section>

          <section className="space-y-6 xl:col-span-2">
            <div className="rounded-[32px] border border-white/10 bg-white/10 p-6 backdrop-blur-xl">
              <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
                <div className="relative md:col-span-2">
                  <Search
                    className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500"
                    size={20}
                  />

                  <input
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    placeholder="Search documents, categories, tags..."
                    className="w-full rounded-2xl border border-white/10 bg-black/20 py-4 pl-12 pr-4 text-white outline-none placeholder:text-slate-600"
                  />
                </div>

                <select
                  value={filter}
                  onChange={(e) => setFilter(e.target.value)}
                  className="rounded-2xl border border-white/10 bg-black/20 px-4 py-4 text-white outline-none"
                >
                  <option className="bg-slate-900">All</option>

                  {categories.map((category) => (
                    <option
                      key={category}
                      value={category}
                      className="bg-slate-900"
                    >
                      {category}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="rounded-[32px] border border-white/10 bg-white/10 p-7 backdrop-blur-xl">
              <div className="mb-6 flex items-center justify-between">
                <h2 className="text-2xl font-bold text-white">
                  Vault Records
                </h2>

                <span className="rounded-2xl bg-white/10 px-4 py-2 text-sm text-slate-300">
                  {filteredDocuments.length} Records
                </span>
              </div>

              {loading ? (
                <div className="flex justify-center py-16">
                  <Loader2 className="animate-spin text-violet-300" size={42} />
                </div>
              ) : filteredDocuments.length === 0 ? (
                <EmptyVault />
              ) : (
                <div className="grid grid-cols-1 gap-5 lg:grid-cols-2">
                  {filteredDocuments.map((doc) => (
                    <DocumentCard
                      key={doc._id}
                      doc={doc}
                      onDelete={handleDelete}
                      onImportant={toggleImportant}
                      onVerified={toggleVerified}
                    />
                  ))}
                </div>
              )}
            </div>
          </section>
        </div>
      </div>
    </DashboardLayout>
  )
}

function FilePicker({ selectedFile, onFileSelect }) {
  return (
    <label className="block">
      <span className="text-sm text-slate-400">Select File From Device</span>

      <div className="mt-2 rounded-3xl border border-dashed border-violet-400/30 bg-violet-500/10 p-5">
        <div className="flex flex-col items-center justify-center text-center">
          <UploadCloud size={42} className="text-violet-300" />

          <p className="mt-3 font-semibold text-white">
            Upload PDF, Image, DOC, or DOCX
          </p>

          <p className="mt-1 text-sm text-slate-400">Maximum size: 10 MB</p>

          <input
            type="file"
            accept=".pdf,.jpg,.jpeg,.png,.webp,.doc,.docx"
            onChange={(e) => onFileSelect(e.target.files?.[0])}
            className="mt-5 w-full rounded-2xl border border-white/10 bg-black/20 px-4 py-3 text-white outline-none"
          />
        </div>

        {selectedFile && (
          <div className="mt-4 rounded-2xl border border-green-400/20 bg-green-500/10 p-4">
            <div className="flex items-center gap-3 text-green-200">
              <FileCheck2 size={20} />

              <div>
                <p className="font-semibold">{selectedFile.name}</p>
                <p className="text-sm text-green-300">
                  {formatFileSize(selectedFile.size)}
                </p>
              </div>
            </div>
          </div>
        )}
      </div>
    </label>
  )
}

function DocumentCard({ doc, onDelete, onImportant, onVerified }) {
  const fileLink = doc.fileUrl?.startsWith("http")
    ? doc.fileUrl
    : `${BACKEND_URL}${doc.fileUrl || ""}`

  return (
    <div className="relative overflow-hidden rounded-3xl border border-white/10 bg-black/20 p-6">
      <div className="absolute -right-12 -top-12 h-32 w-32 rounded-full bg-violet-500/10 blur-3xl" />

      <div className="relative z-10">
        <div className="flex items-start justify-between gap-4">
          <div className="flex gap-4">
            <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-violet-500/20 text-violet-200">
              <FileText size={28} />
            </div>

            <div>
              <h3 className="text-xl font-bold text-white">{doc.title}</h3>

              <p className="mt-1 text-sm text-slate-400">
                {doc.category} · {doc.documentType}
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={() => onDelete(doc._id)}
            className="rounded-2xl bg-red-500/20 p-3 text-red-300 hover:bg-red-500/30"
          >
            <Trash2 size={18} />
          </button>
        </div>

        <div className="mt-5 flex flex-wrap gap-2">
          {doc.isImportant && <Badge icon={Star} text="Important" />}

          {doc.isVerified && <Badge icon={BadgeCheck} text="Verified" />}

          <Badge icon={Archive} text={doc.fileName || "No file"} />
        </div>

        <div className="mt-5 space-y-3 text-sm text-slate-400">
          {doc.fileSize > 0 && <p>Size: {formatFileSize(doc.fileSize)}</p>}

          {doc.issuingAuthority && <p>Authority: {doc.issuingAuthority}</p>}

          {doc.documentDate && <p>Date: {formatDate(doc.documentDate)}</p>}

          {doc.expiryDate && <p>Expiry: {formatDate(doc.expiryDate)}</p>}

          {doc.notes && <p className="leading-6 text-slate-300">{doc.notes}</p>}
        </div>

        {doc.tags?.length > 0 && (
          <div className="mt-5 flex flex-wrap gap-2">
            {doc.tags.map((tag) => (
              <span
                key={tag}
                className="rounded-full bg-white/10 px-3 py-1 text-xs text-slate-300"
              >
                {tag}
              </span>
            ))}
          </div>
        )}

        <div className="mt-6 flex flex-wrap gap-3">
          <button
            type="button"
            onClick={() => onImportant(doc)}
            className="rounded-2xl bg-yellow-500/20 px-4 py-2 text-sm font-semibold text-yellow-200"
          >
            Toggle Important
          </button>

          <button
            type="button"
            onClick={() => onVerified(doc)}
            className="rounded-2xl bg-green-500/20 px-4 py-2 text-sm font-semibold text-green-200"
          >
            Toggle Verified
          </button>

          {doc.fileUrl && (
            <a
              href={fileLink}
              target="_blank"
              rel="noreferrer"
              className="flex items-center gap-2 rounded-2xl bg-cyan-500/20 px-4 py-2 text-sm font-semibold text-cyan-200"
            >
              <LinkIcon size={16} />
              Open File
            </a>
          )}
        </div>
      </div>
    </div>
  )
}

function Badge({ icon: Icon, text }) {
  return (
    <span className="inline-flex items-center gap-1 rounded-full bg-white/10 px-3 py-1 text-xs text-slate-300">
      <Icon size={13} />
      {text}
    </span>
  )
}

function Metric({ label, value }) {
  return (
    <div className="rounded-2xl border border-white/10 bg-black/20 px-4 py-3">
      <p className="text-xs text-slate-400">{label}</p>

      <h3 className="mt-1 text-xl font-bold text-white">{value}</h3>
    </div>
  )
}

function EmptyVault() {
  return (
    <div className="rounded-3xl border border-dashed border-white/10 p-12 text-center">
      <FolderOpen size={54} className="mx-auto text-slate-600" />

      <h3 className="mt-5 text-2xl font-bold text-white">Vault is Empty</h3>

      <p className="mt-2 text-slate-400">
        Upload your first academic document.
      </p>
    </div>
  )
}

function Toggle({ label, checked, onChange }) {
  return (
    <label className="flex items-center justify-between rounded-2xl border border-white/10 bg-white/5 px-4 py-3">
      <span className="text-sm text-slate-300">{label}</span>

      <input
        type="checkbox"
        checked={checked}
        onChange={(e) => onChange(e.target.checked)}
      />
    </label>
  )
}

function Input({ label, value, onChange, type = "text" }) {
  return (
    <label className="block">
      <span className="text-sm text-slate-400">{label}</span>

      <input
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="mt-2 w-full rounded-2xl border border-white/10 bg-white/10 px-4 py-3 text-white outline-none"
      />
    </label>
  )
}

function Textarea({ label, value, onChange, placeholder }) {
  return (
    <label className="block">
      <span className="text-sm text-slate-400">{label}</span>

      <textarea
        rows="3"
        value={value}
        placeholder={placeholder}
        onChange={(e) => onChange(e.target.value)}
        className="mt-2 w-full resize-none rounded-2xl border border-white/10 bg-white/10 px-4 py-3 text-white outline-none placeholder:text-slate-600"
      />
    </label>
  )
}

function Select({ label, value, onChange, options }) {
  return (
    <label className="block">
      <span className="text-sm text-slate-400">{label}</span>

      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="mt-2 w-full rounded-2xl border border-white/10 bg-white/10 px-4 py-3 text-white outline-none"
      >
        {options.map((option) => (
          <option key={option} value={option} className="bg-slate-900">
            {option}
          </option>
        ))}
      </select>
    </label>
  )
}

function formatDate(value) {
  if (!value) return "No date"

  const date = new Date(value)

  if (Number.isNaN(date.getTime())) {
    return "Invalid date"
  }

  return date.toLocaleDateString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  })
}

function formatFileSize(size) {
  const bytes = Number(size || 0)

  if (bytes <= 0) return "0 B"
  if (bytes < 1024) return `${bytes} B`
  if (bytes < 1024 * 1024) return `${Math.round(bytes / 1024)} KB`

  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`
}

export default DigitalDocumentVault