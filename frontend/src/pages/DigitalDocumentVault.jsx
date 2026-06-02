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

const BACKEND_URL =
  import.meta.env.VITE_API_URL?.replace("/api", "") ||
  "http://localhost:5000"

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

const documentTypes = ["PDF", "Image", "Document", "Other"]

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
      const matchesSearch = text
        .toLowerCase()
        .includes(search.toLowerCase())

      const matchesFilter =
        filter === "All" || doc.category === filter

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

  const resetForm = () => {
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
  }

  const handleCreateDocument = async () => {
    try {
      if (!form.title.trim()) {
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

      resetForm()
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
      <div className="page-shell mx-auto max-w-7xl space-y-5 md:space-y-8">
        <section className="relative overflow-hidden rounded-3xl border border-white/10 bg-white/10 p-4 backdrop-blur-xl md:rounded-[32px] md:p-8">
          <div className="absolute -right-20 -top-20 h-56 w-56 rounded-full bg-violet-500/20 blur-3xl md:h-72 md:w-72" />
          <div className="absolute -bottom-20 -left-20 h-56 w-56 rounded-full bg-cyan-500/20 blur-3xl md:h-72 md:w-72" />

          <div className="relative z-10 flex flex-col gap-5 xl:flex-row xl:items-center xl:justify-between">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-start">
              <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-violet-500 text-white md:h-16 md:w-16">
                <FolderOpen size={30} />
              </div>

              <div>
                <div className="mb-3 inline-flex max-w-full items-center gap-2 rounded-full border border-violet-400/30 bg-violet-400/10 px-3 py-2 text-xs font-semibold text-violet-200 md:px-4 md:text-sm">
                  <ShieldCheck size={16} className="shrink-0" />
                  <span>Secure Student Vault</span>
                </div>

                <h1 className="text-2xl font-extrabold leading-tight text-white sm:text-3xl md:text-5xl">
                  Digital Document Vault
                </h1>

                <p className="mt-3 max-w-3xl text-sm leading-7 text-slate-300 md:text-base">
                  Upload and organize marksheets, admit cards, certificates,
                  syllabus, receipts, ID cards, and academic files.
                </p>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3 sm:grid-cols-4 xl:min-w-[420px]">
              <Metric label="Docs" value={analytics.total} />
              <Metric label="Important" value={analytics.important} />
              <Metric label="Verified" value={analytics.verified} />
              <Metric label="Categories" value={analytics.categories} />
            </div>
          </div>
        </section>

        <div className="grid grid-cols-1 gap-5 xl:grid-cols-3">
          <section className="rounded-3xl border border-white/10 bg-white/10 p-4 backdrop-blur-xl md:rounded-[32px] md:p-6">
            <h2 className="mb-5 text-xl font-bold text-white md:text-2xl">
              Upload Document
            </h2>

            <div className="space-y-4">
              <Input
                label="Document Title"
                value={form.title}
                onChange={(v) => setForm({ ...form, title: v })}
              />

              <Select
                label="Category"
                value={form.category}
                onChange={(v) => setForm({ ...form, category: v })}
                options={categories}
              />

              <Select
                label="Document Type"
                value={form.documentType}
                onChange={(v) => setForm({ ...form, documentType: v })}
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

              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-1">
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
              </div>

              <Textarea
                label="Tags"
                value={form.tagsText}
                onChange={(v) =>
                  setForm({
                    ...form,
                    tagsText: v,
                  })
                }
                placeholder="semester, BCA, exam"
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
                placeholder="Optional document notes"
              />

              <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-1">
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
              </div>

              <button
                type="button"
                onClick={handleCreateDocument}
                disabled={saving}
                className="flex w-full items-center justify-center gap-2 rounded-2xl bg-violet-500 px-5 py-3 text-sm font-bold text-white transition hover:bg-violet-400 disabled:opacity-60 md:py-4 md:text-base"
              >
                {saving ? (
                  <Loader2 className="animate-spin" size={18} />
                ) : (
                  <Plus size={18} />
                )}
                {saving ? "Uploading..." : "Upload Document"}
              </button>
            </div>
          </section>

          <section className="space-y-5 xl:col-span-2">
            <div className="rounded-3xl border border-white/10 bg-white/10 p-4 backdrop-blur-xl md:p-6">
              <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
                <div className="relative md:col-span-2">
                  <Search
                    className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500"
                    size={18}
                  />

                  <input
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    placeholder="Search documents..."
                    className="w-full rounded-2xl border border-white/10 bg-black/20 py-3 pl-11 pr-4 text-sm text-white outline-none placeholder:text-slate-600 md:py-4 md:text-base"
                  />
                </div>

                <select
                  value={filter}
                  onChange={(e) => setFilter(e.target.value)}
                  className="rounded-2xl border border-white/10 bg-black/20 px-4 py-3 text-sm text-white outline-none md:py-4 md:text-base"
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

            <div className="rounded-3xl border border-white/10 bg-white/10 p-4 backdrop-blur-xl md:rounded-[32px] md:p-6">
              <div className="mb-5 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <h2 className="text-xl font-bold text-white md:text-2xl">
                    Vault Records
                  </h2>

                  <p className="mt-1 text-sm text-slate-400">
                    {filteredDocuments.length} record(s) found
                  </p>
                </div>

                <span className="w-fit rounded-2xl bg-white/10 px-4 py-2 text-xs text-slate-300 md:text-sm">
                  {filter}
                </span>
              </div>

              {loading ? (
                <div className="flex justify-center py-16">
                  <Loader2 className="animate-spin text-violet-300" size={36} />
                </div>
              ) : filteredDocuments.length === 0 ? (
                <EmptyVault />
              ) : (
                <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
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

      <div className="mt-2 rounded-3xl border border-dashed border-violet-400/30 bg-violet-500/10 p-4 md:p-5">
        <div className="flex flex-col items-center justify-center text-center">
          <UploadCloud size={36} className="text-violet-300" />

          <p className="mt-3 text-sm font-semibold text-white md:text-base">
            Upload PDF, Image, DOC, or DOCX
          </p>

          <p className="mt-1 text-xs text-slate-400 md:text-sm">
            Maximum size: 10 MB
          </p>

          <input
            type="file"
            accept=".pdf,.jpg,.jpeg,.png,.webp,.doc,.docx"
            onChange={(e) => onFileSelect(e.target.files?.[0])}
            className="mt-5 w-full rounded-2xl border border-white/10 bg-black/20 px-4 py-3 text-sm text-white outline-none md:text-base"
          />
        </div>

        {selectedFile && (
          <div className="mt-4 rounded-2xl border border-green-400/20 bg-green-500/10 p-4">
            <div className="flex items-start gap-3 text-green-200">
              <FileCheck2 size={20} className="mt-1 shrink-0" />

              <div className="min-w-0">
                <p className="break-all text-sm font-semibold md:text-base">
                  {selectedFile.name}
                </p>

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
    <article className="relative flex min-h-full flex-col overflow-hidden rounded-3xl border border-white/10 bg-black/20 p-4 md:p-5">
      <div className="absolute -right-12 -top-12 h-32 w-32 rounded-full bg-violet-500/10 blur-3xl" />

      <div className="relative z-10 flex h-full flex-col">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
          <div className="flex min-w-0 gap-3">
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-violet-500/20 text-violet-200 md:h-14 md:w-14">
              <FileText size={24} />
            </div>

            <div className="min-w-0">
              <h3 className="line-clamp-2 text-lg font-bold text-white md:text-xl">
                {doc.title}
              </h3>

              <p className="mt-1 text-xs text-slate-400 md:text-sm">
                {doc.category} · {doc.documentType}
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={() => onDelete(doc._id)}
            className="flex w-full items-center justify-center rounded-2xl bg-red-500/20 p-3 text-red-300 transition hover:bg-red-500/30 sm:w-auto"
          >
            <Trash2 size={18} />
          </button>
        </div>

        <div className="mt-5 flex flex-wrap gap-2">
          {doc.isImportant && <Badge icon={Star} text="Important" />}
          {doc.isVerified && <Badge icon={BadgeCheck} text="Verified" />}
          <Badge icon={Archive} text={doc.fileName || "No file"} />
        </div>

        <div className="mt-5 space-y-2 text-sm text-slate-400">
          {doc.fileSize > 0 && <p>Size: {formatFileSize(doc.fileSize)}</p>}
          {doc.issuingAuthority && <p>Authority: {doc.issuingAuthority}</p>}
          {doc.documentDate && <p>Date: {formatDate(doc.documentDate)}</p>}
          {doc.expiryDate && <p>Expiry: {formatDate(doc.expiryDate)}</p>}

          {doc.notes && (
            <p className="line-clamp-4 leading-6 text-slate-300">
              {doc.notes}
            </p>
          )}
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

        <div className="mt-auto pt-5">
          <div className="flex flex-col gap-3 sm:flex-row sm:flex-wrap">
            <button
              type="button"
              onClick={() => onImportant(doc)}
              className="rounded-2xl bg-yellow-500/20 px-4 py-2 text-sm font-semibold text-yellow-200 transition hover:bg-yellow-500/30"
            >
              Toggle Important
            </button>

            <button
              type="button"
              onClick={() => onVerified(doc)}
              className="rounded-2xl bg-green-500/20 px-4 py-2 text-sm font-semibold text-green-200 transition hover:bg-green-500/30"
            >
              Toggle Verified
            </button>

            {doc.fileUrl && (
              <a
                href={fileLink}
                target="_blank"
                rel="noreferrer"
                className="flex items-center justify-center gap-2 rounded-2xl bg-cyan-500/20 px-4 py-2 text-sm font-semibold text-cyan-200 transition hover:bg-cyan-500/30"
              >
                <LinkIcon size={16} />
                Open File
              </a>
            )}
          </div>
        </div>
      </div>
    </article>
  )
}

function Badge({ icon: Icon, text }) {
  return (
    <span className="inline-flex max-w-full items-center gap-1 rounded-full bg-white/10 px-3 py-1 text-xs text-slate-300">
      <Icon size={13} className="shrink-0" />
      <span className="truncate">{text}</span>
    </span>
  )
}

function Metric({ label, value }) {
  return (
    <div className="rounded-2xl border border-white/10 bg-black/20 px-3 py-3 md:px-4">
      <p className="text-xs text-slate-400">{label}</p>
      <h3 className="mt-1 text-lg font-bold text-white md:text-xl">
        {value}
      </h3>
    </div>
  )
}

function EmptyVault() {
  return (
    <div className="rounded-3xl border border-dashed border-white/10 p-8 text-center md:p-12">
      <FolderOpen size={50} className="mx-auto text-slate-600" />

      <h3 className="mt-5 text-xl font-bold text-white md:text-2xl">
        Vault is Empty
      </h3>

      <p className="mt-2 text-sm text-slate-400 md:text-base">
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
        className="mt-2 w-full rounded-2xl border border-white/10 bg-white/10 px-4 py-3 text-sm text-white outline-none md:text-base"
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
        className="mt-2 w-full resize-none rounded-2xl border border-white/10 bg-white/10 px-4 py-3 text-sm text-white outline-none placeholder:text-slate-600 md:text-base"
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
        className="mt-2 w-full rounded-2xl border border-white/10 bg-white/10 px-4 py-3 text-sm text-white outline-none md:text-base"
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