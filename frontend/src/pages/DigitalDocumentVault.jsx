import { useEffect, useMemo, useState, useRef } from "react"
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
  
  const fileInputRef = useRef(null)

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
      file.type === "application/vnd.openxmlformats-officedocument.wordprocessingml.document"
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
    if (fileInputRef.current) {
      fileInputRef.current.value = ""
    }
  }

  const handleCreateDocument = async () => {
    try {
      if (!form.title.trim()) return alert("Document title required")
      if (!selectedFile) return alert("Please select a file from your device")

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
      if (confirm("Are you sure you want to delete this document?")) {
        await deleteStudentDocument(id)
        fetchDocuments()
      }
    } catch (error) {
      console.log(error)
    }
  }

  const toggleImportant = async (doc) => {
    try {
      await updateStudentDocument(doc._id, { isImportant: !doc.isImportant })
      fetchDocuments()
    } catch (error) {
      console.log(error)
    }
  }

  const toggleVerified = async (doc) => {
    try {
      await updateStudentDocument(doc._id, { isVerified: !doc.isVerified })
      fetchDocuments()
    } catch (error) {
      console.log(error)
    }
  }

  return (
    <DashboardLayout>
      <div className="mx-auto max-w-7xl space-y-4 p-3 sm:p-6 md:space-y-6">
        
        {/* Top Header Card Banner */}
        <section className="relative overflow-hidden rounded-2xl border border-white/5 bg-white/[0.06] p-4 backdrop-blur-md sm:rounded-3xl sm:p-6 lg:p-8">
          <div className="absolute -right-20 -top-20 h-48 w-48 rounded-full bg-violet-500/10 blur-3xl md:h-64 md:w-64" />
          <div className="absolute -bottom-20 -left-20 h-48 w-48 rounded-full bg-cyan-500/10 blur-3xl md:h-64 md:w-64" />

          <div className="relative z-10 flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
            <div className="flex flex-col gap-3 sm:flex-row sm:items-start">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-violet-500 text-white sm:h-14 sm:w-14">
                <FolderOpen className="h-5 w-5 sm:h-7 sm:w-7" />
              </div>

              <div className="min-w-0">
                <div className="mb-1.5 inline-flex max-w-full items-center gap-1.5 rounded-full border border-violet-400/20 bg-violet-400/5 px-2.5 py-1 text-[11px] font-medium text-violet-300">
                  <ShieldCheck size={12} className="shrink-0" />
                  <span className="truncate">Secure Vault</span>
                </div>

                <h1 className="text-lg font-bold tracking-tight text-white sm:text-2xl md:text-3xl">
                  Digital Document Vault
                </h1>

                <p className="mt-1 text-xs text-slate-400 sm:text-sm max-w-xl">
                  Upload and manage your academic marksheets, admit cards, certificates, and important documents securely.
                </p>
              </div>
            </div>

            {/* Metrics Responsive Deck */}
            <div className="grid grid-cols-2 gap-2 sm:grid-cols-4 lg:min-w-[380px]">
              <Metric label="Total Docs" value={analytics.total} />
              <Metric label="Starred" value={analytics.important} />
              <Metric label="Verified" value={analytics.verified} />
              <Metric label="Categories" value={analytics.categories} />
            </div>
          </div>
        </section>

        {/* Main Work Container */}
        <div className="grid grid-cols-1 gap-4 lg:grid-cols-3 md:gap-6">
          
          {/* Form Section Panel */}
          <section className="h-fit rounded-2xl border border-white/5 bg-white/[0.06] p-4 backdrop-blur-md sm:rounded-3xl sm:p-5">
            <h2 className="mb-3 text-base font-semibold text-white sm:text-lg">
              Upload Document
            </h2>

            <div className="space-y-3.5">
              <Input
                label="Document Title"
                value={form.title}
                onChange={(v) => setForm({ ...form, title: v })}
              />

              <div className="grid grid-cols-2 gap-3">
                <Select
                  label="Category"
                  value={form.category}
                  onChange={(v) => setForm({ ...form, category: v })}
                  options={categories}
                />

                <Select
                  label="Type"
                  value={form.documentType}
                  onChange={(v) => setForm({ ...form, documentType: v })}
                  options={documentTypes}
                />
              </div>

              <FilePicker
                selectedFile={selectedFile}
                onFileSelect={handleFileSelect}
                fileInputRef={fileInputRef}
              />

              <Input
                label="Issuing Authority"
                value={form.issuingAuthority}
                onChange={(v) => setForm({ ...form, issuingAuthority: v })}
              />

              <div className="grid grid-cols-2 gap-3">
                <Input
                  type="date"
                  label="Issue Date"
                  value={form.documentDate}
                  onChange={(v) => setForm({ ...form, documentDate: v })}
                />

                <Input
                  type="date"
                  label="Expiry Date"
                  value={form.expiryDate}
                  onChange={(v) => setForm({ ...form, expiryDate: v })}
                />
              </div>

              <Textarea
                label="Tags (Comma Separated)"
                value={form.tagsText}
                onChange={(v) => setForm({ ...form, tagsText: v })}
                placeholder="semester, exam, bca"
              />

              <Textarea
                label="Notes"
                value={form.notes}
                onChange={(v) => setForm({ ...form, notes: v })}
                placeholder="Optional description"
              />

              <div className="grid grid-cols-2 gap-3">
                <Toggle
                  label="Important"
                  checked={form.isImportant}
                  onChange={(v) => setForm({ ...form, isImportant: v })}
                />

                <Toggle
                  label="Verified"
                  checked={form.isVerified}
                  onChange={(v) => setForm({ ...form, isVerified: v })}
                />
              </div>

              <button
                type="button"
                onClick={handleCreateDocument}
                disabled={saving}
                className="flex w-full items-center justify-center gap-2 rounded-xl bg-violet-600 px-4 py-2.5 text-xs font-semibold text-white transition hover:bg-violet-500 active:scale-[0.98] disabled:opacity-50 sm:py-3 sm:text-sm"
              >
                {saving ? (
                  <Loader2 className="animate-spin" size={16} />
                ) : (
                  <Plus size={16} />
                )}
                {saving ? "Uploading..." : "Upload Document"}
              </button>
            </div>
          </section>

          {/* Table / Cards List Display Grid */}
          <section className="space-y-4 lg:col-span-2">
            
            {/* Quick Search Tool Dock */}
            <div className="rounded-2xl border border-white/5 bg-white/[0.06] p-3 backdrop-blur-md sm:p-4">
              <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
                <div className="relative flex-1">
                  <Search
                    className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500"
                    size={16}
                  />
                  <input
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    placeholder="Search records..."
                    className="w-full rounded-xl border border-white/5 bg-black/30 py-2 pl-9 pr-3 text-xs text-white outline-none placeholder:text-slate-500 focus:border-white/10 sm:py-2.5 sm:text-sm"
                  />
                </div>

                <select
                  value={filter}
                  onChange={(e) => setFilter(e.target.value)}
                  className="rounded-xl border border-white/5 bg-black/30 px-3 py-2 text-xs text-white outline-none sm:py-2.5 sm:text-sm"
                >
                  <option key="All" value="All" className="bg-slate-900">All Categories</option>
                  {categories.map((cat) => (
                    <option key={cat} value={cat} className="bg-slate-900">
                      {cat}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* List Header Container Card */}
            <div className="rounded-2xl border border-white/5 bg-white/[0.06] p-4 backdrop-blur-md sm:rounded-3xl sm:p-5">
              <div className="mb-4 flex items-center justify-between">
                <div>
                  <h2 className="text-base font-semibold text-white sm:text-lg">
                    Vault Records
                  </h2>
                  <p className="text-[11px] text-slate-400">
                    {filteredDocuments.length} document(s) matching
                  </p>
                </div>
                <span className="rounded-lg bg-white/5 px-2.5 py-1 text-xs text-slate-300 border border-white/5">
                  {filter}
                </span>
              </div>

              {loading ? (
                <div className="flex justify-center py-12">
                  <Loader2 className="animate-spin text-violet-400" size={28} />
                </div>
              ) : filteredDocuments.length === 0 ? (
                <EmptyVault />
              ) : (
                <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
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

function FilePicker({ selectedFile, onFileSelect, fileInputRef }) {
  return (
    <div className="block">
      <span className="text-[11px] font-medium text-slate-400 sm:text-xs">File Attachment</span>

      <div className="mt-1.5 rounded-xl border border-dashed border-white/10 bg-black/20 p-3 text-center transition hover:border-violet-500/30">
        <div className="flex flex-col items-center justify-center">
          <UploadCloud size={24} className="text-slate-400" />
          <p className="mt-1 text-xs font-medium text-slate-300">
            PDF, Image, or Word Document
          </p>
          <p className="text-[10px] text-slate-500">Max size limit: 10 MB</p>

          <input
            type="file"
            ref={fileInputRef}
            accept=".pdf,.jpg,.jpeg,.png,.webp,.doc,.docx"
            onChange={(e) => onFileSelect(e.target.files?.[0])}
            className="mt-2.5 w-full rounded-lg border border-white/5 bg-black/20 px-2 py-1 text-[11px] text-slate-300 outline-none file:hidden cursor-pointer"
          />
        </div>

        {selectedFile && (
          <div className="mt-3 rounded-lg bg-green-500/5 p-2 text-left border border-green-500/10">
            <div className="flex items-start gap-2 text-green-300">
              <FileCheck2 size={14} className="mt-0.5 shrink-0" />
              <div className="min-w-0 flex-1">
                <p className="truncate text-[11px] font-medium">
                  {selectedFile.name}
                </p>
                <p className="text-[10px] text-green-400/70">
                  {formatFileSize(selectedFile.size)}
                </p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

function DocumentCard({ doc, onDelete, onImportant, onVerified }) {
  const fileLink = doc.fileUrl?.startsWith("http")
    ? doc.fileUrl
    : `${BACKEND_URL}${doc.fileUrl || ""}`

  return (
    <article className="relative flex flex-col justify-between overflow-hidden rounded-xl border border-white/5 bg-black/30 p-3.5 sm:rounded-2xl">
      <div>
        {/* Card Header Control Row */}
        <div className="flex items-start justify-between gap-2">
          <div className="flex min-w-0 gap-2.5">
            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-white/5 text-slate-300">
              <FileText size={16} />
            </div>
            <div className="min-w-0">
              <h3 className="truncate text-xs font-semibold text-white sm:text-sm" title={doc.title}>
                {doc.title}
              </h3>
              <p className="text-[11px] text-slate-400 mt-0.5">
                {doc.category} · {doc.documentType}
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={() => onDelete(doc._id)}
            className="rounded-lg p-1.5 text-slate-500 transition hover:bg-red-500/10 hover:text-red-400"
            title="Delete File"
          >
            <Trash2 size={14} />
          </button>
        </div>

        {/* Dynamic Badges Line Flow */}
        <div className="mt-2.5 flex flex-wrap gap-1">
          {doc.isImportant && <Badge icon={Star} text="Starred" colors="bg-yellow-500/10 text-yellow-300 border-yellow-500/10" />}
          {doc.isVerified && <Badge icon={BadgeCheck} text="Verified" colors="bg-green-500/10 text-green-300 border-green-500/10" />}
          <Badge icon={Archive} text={doc.fileName || "No document"} colors="bg-white/5 text-slate-400 border-white/5" />
        </div>

        {/* Text Properties Metadata list */}
        <div className="mt-3 space-y-1 text-[11px] text-slate-400 sm:text-xs">
          {doc.fileSize > 0 && <p><span className="text-slate-500">Size:</span> {formatFileSize(doc.fileSize)}</p>}
          {doc.issuingAuthority && <p><span className="text-slate-500">Authority:</span> {doc.issuingAuthority}</p>}
          {doc.documentDate && <p><span className="text-slate-500">Issued:</span> {formatDate(doc.documentDate)}</p>}
          {doc.expiryDate && <p><span className="text-slate-500">Expires:</span> {formatDate(doc.expiryDate)}</p>}

          {doc.notes && (
            <p className="mt-2 line-clamp-2 text-[11px] leading-relaxed text-slate-400 bg-white/[0.02] p-1.5 rounded-md border border-white/5">
              {doc.notes}
            </p>
          )}
        </div>

        {/* Dynamic Custom Tags Dock Layout */}
        {doc.tags?.length > 0 && (
          <div className="mt-2.5 flex flex-wrap gap-1">
            {doc.tags.map((tag) => (
              <span
                key={tag}
                className="rounded-md bg-white/5 px-1.5 py-0.5 text-[10px] text-slate-400 border border-white/5"
              >
                #{tag}
              </span>
            ))}
          </div>
        )}
      </div>

      {/* Action Controls Footer Group */}
      <div className="mt-4 border-t border-white/5 pt-2.5">
        <div className="grid grid-cols-3 gap-1.5">
          <button
            type="button"
            onClick={() => onImportant(doc)}
            className="rounded-lg bg-white/5 py-1.5 text-[10px] font-medium text-slate-300 transition hover:bg-white/10 text-center"
          >
            {doc.isImportant ? "Unstar" : "Star"}
          </button>

          <button
            type="button"
            onClick={() => onVerified(doc)}
            className="rounded-lg bg-white/5 py-1.5 text-[10px] font-medium text-slate-300 transition hover:bg-white/10 text-center"
          >
            Verify
          </button>

          {doc.fileUrl ? (
            <a
              href={fileLink}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center justify-center gap-1 rounded-lg bg-violet-600/20 py-1.5 text-[10px] font-semibold text-violet-300 transition hover:bg-violet-600/30 text-center"
            >
              <LinkIcon size={10} />
              <span>Open</span>
            </a>
          ) : (
            <span className="rounded-lg bg-white/[0.02] py-1.5 text-[10px] text-slate-600 text-center cursor-not-allowed">
              No File
            </span>
          )}
        </div>
      </div>
    </article>
  )
}

function Badge({ icon: Icon, text, colors }) {
  return (
    <span className={`inline-flex max-w-[130px] items-center gap-1 rounded-md px-2 py-0.5 text-[10px] border ${colors}`}>
      <Icon size={10} className="shrink-0" />
      <span className="truncate">{text}</span>
    </span>
  )
}

function Metric({ label, value }) {
  return (
    <div className="rounded-xl border border-white/5 bg-black/20 p-2 text-center sm:p-3">
      <p className="truncate text-[10px] text-slate-400 sm:text-xs">{label}</p>
      <h3 className="mt-0.5 text-sm font-bold text-white sm:text-lg">
        {value}
      </h3>
    </div>
  )
}

function EmptyVault() {
  return (
    <div className="rounded-xl border border-dashed border-white/10 py-10 text-center">
      <FolderOpen size={32} className="mx-auto text-slate-600" />
      <h3 className="mt-2 text-xs font-semibold text-white sm:text-sm">
        Vault is Empty
      </h3>
      <p className="mt-0.5 text-[11px] text-slate-500">
        No documents found in this directory.
      </p>
    </div>
  )
}

function Toggle({ label, checked, onChange }) {
  return (
    <label className="flex cursor-pointer items-center justify-between rounded-xl border border-white/5 bg-white/[0.03] px-3 py-2 transition hover:bg-white/5">
      <span className="text-[11px] text-slate-300 sm:text-xs">{label}</span>
      <input
        type="checkbox"
        checked={checked}
        className="accent-violet-500 h-3.5 w-3.5 cursor-pointer"
        onChange={(e) => onChange(e.target.checked)}
      />
    </label>
  )
}

function Input({ label, value, onChange, type = "text" }) {
  return (
    <label className="block">
      <span className="text-[11px] font-medium text-slate-400 sm:text-xs">{label}</span>
      <input
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="mt-1 w-full rounded-xl border border-white/5 bg-white/[0.04] px-3 py-2 text-xs text-white outline-none focus:border-white/10"
      />
    </label>
  )
}

function Textarea({ label, value, onChange, placeholder }) {
  return (
    <label className="block">
      <span className="text-[11px] font-medium text-slate-400 sm:text-xs">{label}</span>
      <textarea
        rows="2"
        value={value}
        placeholder={placeholder}
        onChange={(e) => onChange(e.target.value)}
        className="mt-1 w-full resize-none rounded-xl border border-white/5 bg-white/[0.04] px-3 py-2 text-xs text-white outline-none placeholder:text-slate-600 focus:border-white/10"
      />
    </label>
  )
}

function Select({ label, value, onChange, options }) {
  return (
    <label className="block">
      <span className="text-[11px] font-medium text-slate-400 sm:text-xs">{label}</span>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="mt-1 w-full rounded-xl border border-white/5 bg-white/[0.04] px-3 py-2 text-xs text-white outline-none focus:border-white/10"
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
  if (Number.isNaN(date.getTime())) return "Invalid date"
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