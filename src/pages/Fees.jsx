import { useEffect, useState, useRef } from "react"
import Sidebar from "../components/Sidebar"
import { useAuth } from "../context/AuthContext"
import { getFeesAPI, addFeesAPI, payFeesAPI, updateFeeRecordAPI, deleteFeeRecordAPI, feesSummaryAPI, getFeePaymentsAPI, getStudentAPI, searchStudentsAPI, getCoursesAPI, getStudentsByCourseAPI, addBulkFeesAPI, getFeeTemplatesAPI, createFeeTemplateAPI, deleteFeeTemplateAPI } from "../api"
import { PaginationBar } from "../components/UI"

const FEE_PAGE_SIZE = 15
import jsPDF from "jspdf"

const ABS_LOGO = "data:image/png;base64,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"
function generateReceipt(payment, fee, studentName, studentCode, course, parentPhone) {
  const doc   = new jsPDF()
  const pageW = doc.internal.pageSize.getWidth()
  const left  = 18
  const right = pageW - left

  // ── Header bar ───────────────────────────────────────────────
  doc.setFillColor(30, 64, 175)
  doc.rect(0, 0, pageW, 42, "F")

  // White card on left holds the real ABS Foundation logo
  doc.setFillColor(255, 255, 255)
  doc.roundedRect(8, 7, 92, 28, 2, 2, "F")
  doc.addImage(ABS_LOGO, "PNG", 11, 10, 86, 86 / (240 / 46))

  // Receipt title (right side, white text on blue)
  doc.setTextColor(255, 255, 255)
  doc.setFontSize(13)
  doc.setFont("helvetica", "bold")
  doc.text("PAYMENT RECEIPT", right, 20, { align: "right" })

  // ── Meta bar (dark blue strip) ────────────────────────────────
  doc.setFillColor(22, 48, 148)
  doc.rect(0, 42, pageW, 14, "F")
  doc.setFontSize(7)
  doc.setFont("helvetica", "normal")
  doc.setTextColor(180, 200, 255)

  const dateStr = payment.paid_date
    ? new Date(payment.paid_date).toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" })
    : "—"
  const rcpNo = `Receipt No: RCP-${String(payment.id).padStart(5, "0")}`
  const payDate = `Payment Date: ${dateStr}`

  doc.text(rcpNo,   left, 50)
  doc.text(payDate, pageW / 2, 50, { align: "center" })

  // ── Divider ───────────────────────────────────────────────────
  let y = 66
  doc.setDrawColor(210, 210, 210)
  doc.line(left, y - 4, right, y - 4)

  // ── Student Details ───────────────────────────────────────────
  doc.setFillColor(245, 247, 250)
  doc.roundedRect(left, y - 4, right - left, course && parentPhone ? 38 : course || parentPhone ? 32 : 26, 2, 2, "F")

  doc.setFontSize(8)
  doc.setFont("helvetica", "bold")
  doc.setTextColor(100, 100, 120)
  doc.text("STUDENT DETAILS", left + 4, y + 2)
  y += 8

  doc.setFontSize(10)
  doc.setTextColor(30, 30, 30)

  // Two-column layout: left = label, right = value
  function row(label, value, yPos) {
    doc.setFont("helvetica", "bold");   doc.text(label, left + 4, yPos)
    doc.setFont("helvetica", "normal"); doc.text(String(value || "—"), left + 38, yPos)
  }

  row("Name :", studentName || "—", y); y += 7
  if (studentCode)  { row("Student ID :", studentCode, y); y += 7 }
  if (course)       { row("Course :", course, y);          y += 7 }
  if (parentPhone)  { row("Parent No. :", parentPhone, y); y += 7 }

  y += 6

  // ── Amount Box ────────────────────────────────────────────────
  const boxH = (payment.note || payment.payment_mode) ? 36 : 28
  doc.setFillColor(239, 246, 255)
  doc.setDrawColor(30, 64, 175)
  doc.setLineWidth(0.6)
  doc.roundedRect(left, y, right - left, boxH, 3, 3, "FD")
  doc.setLineWidth(0.2)

  // Label
  doc.setFontSize(9)
  doc.setFont("helvetica", "bold")
  doc.setTextColor(30, 64, 175)
  doc.text("AMOUNT PAID", left + 6, y + 9)

  // Amount — on same line, right-aligned but capped so it never overflows
  const amountStr = `Rs. ${parseFloat(payment.amount).toLocaleString("en-IN", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`
  doc.setFontSize(15)
  doc.setFont("helvetica", "bold")
  doc.setTextColor(15, 100, 50)
  doc.text(amountStr, right - 6, y + 10, { align: "right" })

  // Mode & Note — smaller, inside box below amount
  {
    const lines = []
    if (payment.payment_mode) lines.push(`Mode: ${payment.payment_mode}`)
    if (payment.note) lines.push(`Note: ${payment.note}`)
    if (lines.length > 0) {
      doc.setFontSize(8)
      doc.setFont("helvetica", "italic")
      doc.setTextColor(100, 100, 100)
      const combined = doc.splitTextToSize(lines.join("  |  "), right - left - 12)
      doc.text(combined, left + 6, y + 20)
    }
  }

  y += boxH + 10

  // ── Summary row ───────────────────────────────────────────────
  doc.setFontSize(9)
  doc.setFont("helvetica", "normal")
  doc.setTextColor(100, 100, 100)
  const totalFee  = `Total Fee: Rs. ${parseFloat(fee.amount).toLocaleString("en-IN", { minimumFractionDigits: 2 })}`
  const totalPaid = `Total Paid: Rs. ${parseFloat(fee.paid).toLocaleString("en-IN", { minimumFractionDigits: 2 })}`
  const pending   = fee.amount - fee.paid
  const pendingStr = `Balance: Rs. ${parseFloat(pending).toLocaleString("en-IN", { minimumFractionDigits: 2 })}`
  doc.text(totalFee,  left, y)
  doc.text(totalPaid, pageW / 2, y, { align: "center" })
  doc.text(pendingStr, right, y, { align: "right" })
  y += 10

  // ── Footer ────────────────────────────────────────────────────
  doc.setDrawColor(210, 210, 210)
  doc.line(left, y, right, y)
  y += 7
  doc.setFont("helvetica", "italic")
  doc.setFontSize(8)
  doc.setTextColor(160, 160, 160)
  doc.text("Thank you for your payment. Please retain this receipt for your records.", pageW / 2, y, { align: "center" })
  y += 6
  doc.text("For queries: 9981375446  |  8770209272", pageW / 2, y, { align: "center" })

  doc.save(`Receipt_RCP${String(payment.id).padStart(5, "0")}.pdf`)
}

function formatCurrency(amount) {
  return `₹${parseFloat(amount).toLocaleString("en-IN", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`
}

function formatDate(d) {
  if (!d) return "—"
  return new Date(d).toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" })
}

function isOverdue(dueDateStr) {
  if (!dueDateStr) return false
  return new Date(dueDateStr) < new Date()
}

// ── Payment history row (shared by admin & student) ──────────
function PaymentHistory({ feeId, fee, studentName, studentCode, course, parentPhone }) {
  const [payments, setPayments] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    getFeePaymentsAPI(feeId)
      .then((r) => setPayments(r.data.payments))
      .catch(() => setPayments([]))
      .finally(() => setLoading(false))
  }, [feeId])

  if (loading) return <p className="text-xs text-gray-400 py-2 px-4">Loading history...</p>
  if (!payments || payments.length === 0)
    return <p className="text-xs text-gray-400 py-2 px-4">No payments recorded yet.</p>

  return (
    <table className="w-full text-xs mt-1">
      <thead>
        <tr className="text-gray-500 border-b">
          <th className="text-left px-4 py-1 font-medium">#</th>
          <th className="text-left px-4 py-1 font-medium">Amount Paid</th>
          <th className="text-left px-4 py-1 font-medium">Date</th>
          <th className="text-left px-4 py-1 font-medium">Mode</th>
          <th className="text-left px-4 py-1 font-medium">Note</th>
          <th className="px-4 py-1"></th>
        </tr>
      </thead>
      <tbody>
        {payments.map((p, i) => {
          const mode = p.payment_mode || p.note || "—"
          const modeBadge = {
            "Cash": "bg-green-100 text-green-700",
            "UPI": "bg-blue-100 text-blue-700",
            "Bank Transfer": "bg-purple-100 text-purple-700",
            "Cheque": "bg-orange-100 text-orange-700",
          }[p.payment_mode] || "bg-gray-100 text-gray-500"
          return (
            <tr key={p.id} className="border-b last:border-0">
              <td className="px-4 py-1 text-gray-400">{i + 1}</td>
              <td className="px-4 py-1 font-semibold text-green-700">{formatCurrency(p.amount)}</td>
              <td className="px-4 py-1 text-gray-600">{formatDate(p.paid_date)}</td>
              <td className="px-4 py-1">
                <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${modeBadge}`}>{mode}</span>
              </td>
              <td className="px-4 py-1 text-gray-500">{p.note || "—"}</td>
              <td className="px-4 py-1">
                <button onClick={() => generateReceipt(p, fee, studentName, studentCode, course, parentPhone)}
                  className="bg-blue-100 hover:bg-blue-200 text-blue-700 px-2 py-0.5 rounded text-xs font-medium transition">
                  🧾 Receipt
                </button>
              </td>
            </tr>
          )
        })}
      </tbody>
    </table>
  )
}

// ── Student View ─────────────────────────────────────────────
function StudentFees({ studentId, studentName, studentCode, course, parentPhone }) {
  const [fees, setFees] = useState([])
  const [summary, setSummary] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")
  const [expandedId, setExpandedId] = useState(null)
  const [activeTab, setActiveTab] = useState("all")

  useEffect(() => {
    if (!studentId) { setError("Student ID not found. Please login again."); setLoading(false); return }
    fetchFees()
  }, [studentId])

  async function fetchFees() {
    try {
      const [feesRes, summaryRes] = await Promise.all([getFeesAPI(studentId), feesSummaryAPI(studentId)])
      setFees(feesRes.data.fees)
      setSummary(summaryRes.data)
    } catch { setError("Failed to load fees") }
    finally { setLoading(false) }
  }

  const pendingFees = fees.filter((f) => f.paid < f.amount)
  const paidFees = fees.filter((f) => f.paid >= f.amount)
  const displayFees = activeTab === "all" ? fees : activeTab === "pending" ? pendingFees : paidFees

  if (loading) return <div className="flex items-center gap-3 text-slate-500"><div className="w-5 h-5 border-2 border-primary-500 border-t-transparent rounded-full animate-spin" />Loading fees...</div>
  if (error) return <div className="bg-red-50 border border-red-200 rounded-xl p-4 text-red-600">{error}</div>

  return (
    <div className="space-y-5">
      <h2 className="text-xl font-bold text-slate-800">My Fees</h2>

      {/* Summary Cards */}
      {summary && (
        <div className="grid grid-cols-3 gap-3 sm:gap-4">
          <SummaryCard label="Total Fees" value={formatCurrency(summary.total_fees)} color="blue" />
          <SummaryCard label="Paid" value={formatCurrency(summary.paid)} color="green" />
          <SummaryCard label="Pending" value={formatCurrency(summary.pending)} color="red" />
        </div>
      )}

      {/* Progress bar */}
      {summary && summary.total_fees > 0 && (
        <div className="card p-5">
          <div className="flex justify-between text-sm text-slate-500 mb-2">
            <span>Payment Progress</span>
            <span>{((summary.paid / summary.total_fees) * 100).toFixed(1)}% paid</span>
          </div>
          <div className="w-full bg-slate-100 rounded-full h-3">
            <div className="h-3 rounded-full bg-green-500 transition-all duration-500"
              style={{ width: `${Math.min((summary.paid / summary.total_fees) * 100, 100)}%` }} />
          </div>
        </div>
      )}

      {/* Overdue alert */}
      {fees.some((f) => f.paid < f.amount && isOverdue(f.due_date)) && (
        <div className="bg-red-50 border border-red-200 rounded-xl p-4 flex items-center gap-3">
          <span className="text-2xl">⚠️</span>
          <div>
            <p className="font-semibold text-red-700">You have overdue payments!</p>
            <p className="text-sm text-red-500">Please contact admin to clear your dues immediately.</p>
          </div>
        </div>
      )}

      {fees.length === 0 && (
        <div className="card p-12 text-center">
          <p className="text-4xl mb-3">💰</p>
          <p className="text-slate-400">No fee records assigned yet.</p>
        </div>
      )}

      {fees.length > 0 && (
        <div className="card overflow-hidden">
          {/* Tabs */}
          <div className="flex border-b border-slate-100">
            {[
              { key: "all", label: `All (${fees.length})` },
              { key: "pending", label: `Pending (${pendingFees.length})` },
              { key: "paid", label: `Paid (${paidFees.length})` },
            ].map((tab) => (
              <button key={tab.key} onClick={() => setActiveTab(tab.key)}
                className={`px-6 py-3 text-sm font-medium transition border-b-2
                  ${activeTab === tab.key ? "border-primary-600 text-primary-600" : "border-transparent text-slate-500 hover:text-slate-700"}`}>
                {tab.label}
              </button>
            ))}
          </div>

          {displayFees.length === 0 ? (
            <p className="p-6 text-gray-400">No records in this category.</p>
          ) : (
            <div className="overflow-x-auto"><table className="w-full text-sm min-w-[560px]">
              <thead>
                <tr className="bg-gray-800 text-white text-xs uppercase">
                  <th className="text-left px-5 py-3">Description</th>
                  <th className="text-left px-5 py-3">Due Date</th>
                  <th className="text-left px-5 py-3">Total</th>
                  <th className="text-left px-5 py-3">Paid</th>
                  <th className="text-left px-5 py-3">Pending</th>
                  <th className="text-left px-5 py-3">Status</th>
                  <th className="text-left px-5 py-3">History</th>
                </tr>
              </thead>
              <tbody>
                {displayFees.map((f) => {
                  const pending = f.amount - f.paid
                  const isFullyPaid = pending <= 0.001
                  const overdue = !isFullyPaid && isOverdue(f.due_date)
                  const expanded = expandedId === f.id
                  return (
                    <>
                      <tr key={f.id} className={`border-t transition ${overdue ? "bg-red-50" : isFullyPaid ? "" : "bg-yellow-50"} hover:bg-opacity-80`}>
                        <td className="px-5 py-3 font-medium">{f.description || "—"}</td>
                        <td className="px-5 py-3">
                          {f.due_date ? (
                            <span className={`text-xs font-medium ${overdue ? "text-red-600" : "text-gray-600"}`}>
                              {overdue && "⚠️ "}{formatDate(f.due_date)}
                            </span>
                          ) : "—"}
                        </td>
                        <td className="px-5 py-3">{formatCurrency(f.amount)}</td>
                        <td className="px-5 py-3 text-green-600 font-medium">{formatCurrency(f.paid)}</td>
                        <td className="px-5 py-3 text-red-600 font-medium">{formatCurrency(pending)}</td>
                        <td className="px-5 py-3">
                          <span className={`px-2 py-1 rounded-full text-xs font-medium ${isFullyPaid ? "bg-green-100 text-green-700" : overdue ? "bg-red-100 text-red-700" : "bg-yellow-100 text-yellow-700"}`}>
                            {isFullyPaid ? "Paid" : overdue ? "Overdue" : "Pending"}
                          </span>
                        </td>
                        <td className="px-5 py-3">
                          <button onClick={() => setExpandedId(expanded ? null : f.id)}
                            className="text-blue-600 text-xs underline hover:text-blue-800">
                            {expanded ? "Hide" : "View History"}
                          </button>
                        </td>
                      </tr>
                      {expanded && (
                        <tr key={`hist-${f.id}`} className="bg-blue-50 border-t">
                          <td colSpan={7} className="px-2 py-2">
                            <p className="text-xs font-semibold text-gray-500 px-4 pb-1">Payment History</p>
                            <PaymentHistory feeId={f.id} fee={f} studentName={studentName} studentCode={studentCode} course={course} parentPhone={parentPhone} />
                          </td>
                        </tr>
                      )}
                    </>
                  )
                })}
              </tbody>
            </table></div>
          )}
        </div>
      )}
    </div>
  )
}

// ── Student Search Box (shared by Add Fees + View Fees) ──────
function StudentSearchBox({ label, onSelect, selectedStudent, onClear }) {
  const [query, setQuery] = useState("")
  const [results, setResults] = useState([])
  const [searching, setSearching] = useState(false)
  const [showDrop, setShowDrop] = useState(false)
  const dropRef = useRef(null)
  const debounceRef = useRef(null)

  // Close dropdown on outside click
  useEffect(() => {
    function handler(e) {
      if (dropRef.current && !dropRef.current.contains(e.target)) setShowDrop(false)
    }
    document.addEventListener("mousedown", handler)
    return () => document.removeEventListener("mousedown", handler)
  }, [])

  function handleChange(e) {
    const val = e.target.value
    setQuery(val)
    clearTimeout(debounceRef.current)
    if (!val.trim()) { setResults([]); setShowDrop(false); return }
    debounceRef.current = setTimeout(async () => {
      setSearching(true)
      try {
        const res = await searchStudentsAPI(val.trim())
        setResults(res.data.students || [])
        setShowDrop(true)
      } catch { setResults([]) }
      finally { setSearching(false) }
    }, 300)
  }

  function handleSelect(student) {
    setQuery("")
    setResults([])
    setShowDrop(false)
    onSelect(student)
  }

  function handleClear() {
    setQuery("")
    setResults([])
    setShowDrop(false)
    onClear()
  }

  return (
    <div className="relative" ref={dropRef}>
      {label && <label className="form-label">{label}</label>}

      {selectedStudent ? (
        /* Selected student chip */
        <div className="flex items-center gap-3 bg-blue-50 border border-blue-200 rounded-lg px-3 py-2">
          <div className="flex-1 min-w-0">
            <p className="text-sm font-semibold text-blue-800 truncate">{selectedStudent.name}</p>
            <p className="text-xs text-blue-500">
              {selectedStudent.student_code && <span className="font-mono mr-2">{selectedStudent.student_code}</span>}
              {selectedStudent.phone && <span>📞 {selectedStudent.phone}</span>}
              {selectedStudent.course && <span className="ml-2">· {selectedStudent.course}</span>}
            </p>
          </div>
          <button onClick={handleClear} title="Change student"
            className="text-blue-400 hover:text-red-500 transition text-lg font-bold leading-none flex-shrink-0">×</button>
        </div>
      ) : (
        /* Search input */
        <div className="relative">
          <input
            type="text"
            value={query}
            onChange={handleChange}
            onFocus={() => results.length > 0 && setShowDrop(true)}
            placeholder="🔍 Search by name, phone or student ID..."
            className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 pr-8"
          />
          {searching && (
            <div className="absolute right-2 top-2.5 w-4 h-4 border-2 border-blue-400 border-t-transparent rounded-full animate-spin" />
          )}
        </div>
      )}

      {/* Dropdown results */}
      {showDrop && results.length > 0 && !selectedStudent && (
        <div className="absolute left-0 right-0 top-full mt-1 bg-white border border-gray-200 rounded-xl shadow-lg z-40 overflow-hidden max-h-64 overflow-y-auto">
          {results.map((s) => (
            <button key={s.id} onClick={() => handleSelect(s)}
              className="w-full text-left px-4 py-2.5 hover:bg-blue-50 transition border-b border-gray-50 last:border-0">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center text-xs font-bold flex-shrink-0">
                  {s.name.charAt(0).toUpperCase()}
                </div>
                <div className="min-w-0">
                  <p className="text-sm font-medium text-gray-800 truncate">{s.name}</p>
                  <p className="text-xs text-gray-400">
                    {s.student_code && <span className="font-mono mr-2">{s.student_code}</span>}
                    {s.phone && <span>📞 {s.phone}</span>}
                    {s.course && <span className="ml-2">· {s.course}</span>}
                  </p>
                </div>
              </div>
            </button>
          ))}
        </div>
      )}

      {showDrop && results.length === 0 && query.trim() && !searching && (
        <div className="absolute left-0 right-0 top-full mt-1 bg-white border border-gray-200 rounded-xl shadow-lg z-40 px-4 py-3 text-sm text-gray-400">
          No students found for "{query}"
        </div>
      )}
    </div>
  )
}

// ── Admin View ───────────────────────────────────────────────
function AdminFees() {
  const [fees, setFees] = useState([])
  const [filtered, setFiltered] = useState([])
  const [summary, setSummary] = useState(null)
  const [loading, setLoading] = useState(false)
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState("")
  const [success, setSuccess] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")

  // Add Fees: selected student + form fields
  const [addStudent, setAddStudent] = useState(null)   // selected student object
  const [addForm, setAddForm] = useState({ amount: "", description: "", due_date: "" })

  // View Fees: selected student
  const [viewStudent, setViewStudent] = useState(null)  // { id, name, student_code, ... }

  // View Fees: browse by course
  const [viewMode, setViewMode]           = useState("search")  // "search" | "course"
  const [courses, setCourses]             = useState([])
  const [selectedCourse, setSelectedCourse] = useState("")
  const [courseStudents, setCourseStudents] = useState([])
  const [courseLoading, setCourseLoading] = useState(false)

  const [payForms, setPayForms] = useState({})
  const [payingId, setPayingId] = useState(null)
  const [expandedId, setExpandedId] = useState(null)
  const [historyKey, setHistoryKey] = useState(0)
  const [feePage, setFeePage] = useState(1)

  // Edit / delete fee record
  const [editingFee, setEditingFee]   = useState(null)   // fee object being edited
  const [editForm, setEditForm]       = useState({ amount: "", description: "", due_date: "" })
  const [saving, setSaving]           = useState(false)
  const [deleteConfirmId, setDeleteConfirmId] = useState(null)
  const [deleting, setDeleting]       = useState(false)

  // Bulk Fee Addition
  const [bulkForm, setBulkForm] = useState({ course_name: "", amount: "", description: "", due_date: "" })
  const [bulkSubmitting, setBulkSubmitting] = useState(false)
  const [bulkSuccess, setBulkSuccess] = useState("")
  const [bulkError, setBulkError] = useState("")

  // Templates
  const [templates, setTemplates] = useState([])
  const [templatesLoading, setTemplatesLoading] = useState(false)
  const [templatesOpen, setTemplatesOpen] = useState(false)
  const [newTemplate, setNewTemplate] = useState({ name: "", course: "", amount: "", description: "" })
  const [templateSubmitting, setTemplateSubmitting] = useState(false)
  const [templateError, setTemplateError] = useState("")
  const [templateSuccess, setTemplateSuccess] = useState("")
  const [applyModal, setApplyModal] = useState(null) // template to apply
  const [applyCourse, setApplyCourse] = useState("")
  const [applySubmitting, setApplySubmitting] = useState(false)

  // Collect Fee tab
  const [collectStudent, setCollectStudent]   = useState(null)
  const [collectFees, setCollectFees]         = useState([])
  const [collectSummary, setCollectSummary]   = useState(null)
  const [collectLoading, setCollectLoading]   = useState(false)
  const [collectPayForms, setCollectPayForms] = useState({})
  const [collectPayingId, setCollectPayingId] = useState(null)
  const [collectError, setCollectError]       = useState("")
  const [collectSuccess, setCollectSuccess]   = useState("")
  const [collectLastPay, setCollectLastPay]   = useState(null) // { payment, fee } after success

  useEffect(() => {
    if (success) { const t = setTimeout(() => setSuccess(""), 4000); return () => clearTimeout(t) }
  }, [success])

  useEffect(() => {
    if (bulkSuccess) { const t = setTimeout(() => setBulkSuccess(""), 4000); return () => clearTimeout(t) }
  }, [bulkSuccess])

  useEffect(() => {
    if (templateSuccess) { const t = setTimeout(() => setTemplateSuccess(""), 4000); return () => clearTimeout(t) }
  }, [templateSuccess])

  useEffect(() => {
    if (statusFilter === "all") setFiltered(fees)
    else if (statusFilter === "paid") setFiltered(fees.filter((f) => f.paid >= f.amount))
    else setFiltered(fees.filter((f) => f.paid < f.amount))
    setFeePage(1)
  }, [fees, statusFilter])

  useEffect(() => { setFeePage(1) }, [viewStudent])

  // Load courses once for Browse-by-Course mode
  useEffect(() => {
    getCoursesAPI().then((r) => setCourses(r.data.courses || [])).catch(() => {})
  }, [])

  // When course changes, load its students
  useEffect(() => {
    if (!selectedCourse) { setCourseStudents([]); return }
    setCourseLoading(true)
    getStudentsByCourseAPI(selectedCourse)
      .then((r) => setCourseStudents(r.data.students || r.data || []))
      .catch(() => setCourseStudents([]))
      .finally(() => setCourseLoading(false))
  }, [selectedCourse])

  async function fetchFees(studentId) {
    if (!studentId) return
    setLoading(true); setError("")
    try {
      const [feesRes, summaryRes] = await Promise.all([
        getFeesAPI(studentId),
        feesSummaryAPI(studentId),
      ])
      setFees(feesRes.data.fees)
      setSummary(summaryRes.data)
      setExpandedId(null)
    } catch { setError("Failed to load fees for this student.") }
    finally { setLoading(false) }
  }

  // When a student is selected in the View section
  function handleSelectViewStudent(student) {
    setViewStudent(student)
    fetchFees(student.id)
  }

  function handleClearView() {
    setViewStudent(null)
    setFees([])
    setSummary(null)
    setError("")
    setSelectedCourse("")
    setCourseStudents([])
  }

  function openEditFee(fee) {
    setEditingFee(fee)
    setEditForm({
      amount:      String(fee.amount),
      description: fee.description || "",
      due_date:    fee.due_date || "",
    })
    setDeleteConfirmId(null)
  }

  async function handleUpdateFee(e) {
    e.preventDefault(); setError(""); setSuccess("")
    if (!editForm.amount || parseFloat(editForm.amount) <= 0) { setError("Amount must be greater than 0"); return }
    setSaving(true)
    try {
      await updateFeeRecordAPI(editingFee.id, {
        amount:      parseFloat(editForm.amount),
        description: editForm.description || null,
        due_date:    editForm.due_date    || null,
      })
      setSuccess("✅ Fee record updated!")
      setEditingFee(null)
      if (viewStudent) fetchFees(viewStudent.id)
    } catch (err) {
      setError(err.response?.data?.detail || "Failed to update fee record")
    } finally { setSaving(false) }
  }

  async function handleDeleteFee(feeId) {
    setDeleting(true); setError("")
    try {
      await deleteFeeRecordAPI(feeId)
      setSuccess("✅ Fee record deleted!")
      setDeleteConfirmId(null)
      setEditingFee(null)
      if (viewStudent) fetchFees(viewStudent.id)
    } catch (err) {
      setError(err.response?.data?.detail || "Failed to delete fee record")
    } finally { setDeleting(false) }
  }

  async function handleAddFees(e) {
    e.preventDefault(); setError(""); setSuccess("")
    if (!addStudent) { setError("Please select a student first"); return }
    if (!addForm.amount) { setError("Amount is required"); return }
    if (parseFloat(addForm.amount) <= 0) { setError("Amount must be greater than 0"); return }
    setSubmitting(true)
    try {
      await addFeesAPI({
        student_id: addStudent.id,
        amount: parseFloat(addForm.amount),
        description: addForm.description || null,
        due_date: addForm.due_date || null,
      })
      setSuccess(`✅ Fee record added for ${addStudent.name}!`)
      setAddForm({ amount: "", description: "", due_date: "" })
      // If viewing the same student, refresh
      if (viewStudent?.id === addStudent.id) fetchFees(viewStudent.id)
    } catch (err) {
      setError(err.response?.data?.detail || "Failed to add fees")
    } finally { setSubmitting(false) }
  }

  function getPayForm(feeId) {
    return payForms[feeId] || { amount: "", paid_date: today(), note: "", payment_mode: "Cash" }
  }
  function setPayForm(feeId, patch) {
    setPayForms((prev) => ({ ...prev, [feeId]: { ...getPayForm(feeId), ...patch } }))
  }

  async function handlePay(feeId) {
    const pf = getPayForm(feeId)
    const payAmount = parseFloat(pf.amount)
    if (!payAmount || payAmount <= 0) { setError("Enter a valid payment amount"); return }
    setError(""); setSuccess(""); setPayingId(feeId)
    try {
      await payFeesAPI(feeId, {
        pay_amount: payAmount,
        paid_date: pf.paid_date || today(),
        note: pf.note || null,
        payment_mode: pf.payment_mode || "Cash",
      })
      setSuccess(`✅ ${formatCurrency(payAmount)} payment recorded!`)
      setPayForms((prev) => ({ ...prev, [feeId]: { amount: "", paid_date: today(), note: "", payment_mode: "Cash" } }))
      setHistoryKey((k) => k + 1)
      if (viewStudent) fetchFees(viewStudent.id)
    } catch (err) {
      setError(err.response?.data?.detail || "Payment failed")
    } finally { setPayingId(null) }
  }

  // ── Collect Fee helpers ───────────────────────────────────────
  function speakFeeReceipt(studentName, amount, mode, pending) {
    if (!window.speechSynthesis) return
    window.speechSynthesis.cancel()
    const text = `Fee payment received. Student: ${studentName}. Amount: Rupees ${Math.round(amount).toLocaleString("en-IN")}. Mode: ${mode}. Pending balance: Rupees ${Math.round(Math.max(0, pending)).toLocaleString("en-IN")}.`
    const msg = new SpeechSynthesisUtterance(text)
    msg.lang = "en-IN"
    msg.rate = 0.88
    window.speechSynthesis.speak(msg)
  }

  async function fetchCollectFees(studentId) {
    setCollectLoading(true); setCollectError("")
    try {
      const [feesRes, summaryRes] = await Promise.all([
        getFeesAPI(studentId),
        feesSummaryAPI(studentId),
      ])
      setCollectFees(feesRes.data.fees || [])
      setCollectSummary(summaryRes.data)
    } catch { setCollectError("Failed to load fees.") }
    finally { setCollectLoading(false) }
  }

  function handleSelectCollectStudent(student) {
    setCollectStudent(student)
    setCollectFees([]); setCollectSummary(null)
    setCollectPayForms({}); setCollectLastPay(null)
    setCollectError(""); setCollectSuccess("")
    fetchCollectFees(student.id)
  }

  function getCollectPayForm(feeId) {
    return collectPayForms[feeId] || { amount: "", paid_date: today(), payment_mode: "Cash" }
  }
  function setCollectPayForm(feeId, patch) {
    setCollectPayForms(prev => ({ ...prev, [feeId]: { ...getCollectPayForm(feeId), ...patch } }))
  }

  async function handleCollectPay(fee) {
    const pf = getCollectPayForm(fee.id)
    const payAmount = parseFloat(pf.amount)
    if (!payAmount || payAmount <= 0) { setCollectError("Enter a valid amount"); return }
    setCollectError(""); setCollectSuccess(""); setCollectPayingId(fee.id)
    try {
      const res = await payFeesAPI(fee.id, {
        pay_amount: payAmount,
        paid_date: pf.paid_date || today(),
        payment_mode: pf.payment_mode || "Cash",
      })
      // Build payment object with known-correct fields (API response field names vary)
      const payId = res.data?.payment?.id ?? res.data?.id ?? res.data?.pay_id ?? Date.now()
      const paidDate = pf.paid_date || today()
      const payment = {
        id: payId,
        amount: payAmount,
        paid_date: paidDate,
        payment_mode: pf.payment_mode || "Cash",
        note: res.data?.payment?.note || res.data?.note || null,
      }
      // Use post-payment fee values so receipt summary is correct
      const updatedFee = { ...fee, paid: fee.paid + payAmount }
      setCollectLastPay({ payment, fee: updatedFee })
      setCollectPayForms(prev => ({ ...prev, [fee.id]: { amount: "", paid_date: today(), payment_mode: "Cash" } }))
      setCollectSuccess(`✅ ₹${payAmount.toLocaleString("en-IN")} received from ${collectStudent?.name}!`)
      await fetchCollectFees(collectStudent.id)
      // also refresh view section if same student open
      if (viewStudent?.id === collectStudent?.id) fetchFees(viewStudent.id)
      // voice announcement
      const newSummary = await feesSummaryAPI(collectStudent.id).then(r => r.data).catch(() => null)
      const pending = newSummary ? newSummary.pending : Math.max(0, fee.amount - fee.paid - payAmount)
      speakFeeReceipt(collectStudent.name, payAmount, pf.payment_mode || "Cash", pending)
    } catch (err) {
      setCollectError(err.response?.data?.detail || "Payment failed")
    } finally { setCollectPayingId(null) }
  }

  async function handleBulkFee(e) {
    e.preventDefault(); setBulkError(""); setBulkSuccess("")
    if (!bulkForm.course_name) { setBulkError("Select a course"); return }
    if (!bulkForm.amount || parseFloat(bulkForm.amount) <= 0) { setBulkError("Enter a valid amount"); return }
    setBulkSubmitting(true)
    try {
      const res = await addBulkFeesAPI({
        course_name: bulkForm.course_name,
        amount: parseFloat(bulkForm.amount),
        description: bulkForm.description || null,
        due_date: bulkForm.due_date || null,
      })
      const count = res.data?.count || res.data?.students_count || "multiple"
      setBulkSuccess(`✅ Fee added to ${count} students in ${bulkForm.course_name}!`)
      setBulkForm({ course_name: "", amount: "", description: "", due_date: "" })
    } catch (err) {
      setBulkError(err.response?.data?.detail || "Bulk fee addition failed")
    } finally { setBulkSubmitting(false) }
  }

  async function loadTemplates() {
    setTemplatesLoading(true)
    try {
      const res = await getFeeTemplatesAPI()
      setTemplates(res.data.templates || res.data || [])
    } catch { setTemplateError("Failed to load templates") }
    finally { setTemplatesLoading(false) }
  }

  function toggleTemplates() {
    const next = !templatesOpen
    setTemplatesOpen(next)
    if (next && templates.length === 0) loadTemplates()
  }

  async function handleCreateTemplate(e) {
    e.preventDefault(); setTemplateError(""); setTemplateSuccess("")
    if (!newTemplate.name.trim()) { setTemplateError("Template name is required"); return }
    if (!newTemplate.amount || parseFloat(newTemplate.amount) <= 0) { setTemplateError("Enter a valid amount"); return }
    setTemplateSubmitting(true)
    try {
      await createFeeTemplateAPI({
        name: newTemplate.name.trim(),
        course: newTemplate.course || null,
        amount: parseFloat(newTemplate.amount),
        description: newTemplate.description || null,
      })
      setTemplateSuccess("✅ Template created!")
      setNewTemplate({ name: "", course: "", amount: "", description: "" })
      loadTemplates()
    } catch (err) {
      setTemplateError(err.response?.data?.detail || "Failed to create template")
    } finally { setTemplateSubmitting(false) }
  }

  async function handleDeleteTemplate(id) {
    try {
      await deleteFeeTemplateAPI(id)
      setTemplateSuccess("Template deleted")
      setTemplates(prev => prev.filter(t => t.id !== id))
    } catch { setTemplateError("Failed to delete template") }
  }

  async function handleApplyTemplate() {
    if (!applyModal) return
    const course = applyModal.course || applyCourse
    if (!course) { setTemplateError("Select a course to apply this template"); return }
    setApplySubmitting(true); setTemplateError("")
    try {
      const res = await addBulkFeesAPI({
        course_name: course,
        amount: applyModal.amount,
        description: applyModal.description || applyModal.name,
        due_date: null,
      })
      const count = res.data?.count || res.data?.students_count || "multiple"
      setTemplateSuccess(`✅ Applied "${applyModal.name}" to ${count} students in ${course}!`)
      setApplyModal(null); setApplyCourse("")
    } catch (err) {
      setTemplateError(err.response?.data?.detail || "Failed to apply template")
    } finally { setApplySubmitting(false) }
  }

  return (
    <div className="space-y-5">
      <h2 className="text-xl font-bold text-slate-800">Fees</h2>

      {/* ── Collect Fee ─────────────────────────────────────── */}
      <div className="card border-l-4 border-green-500">
        <div className="px-6 py-4 border-b border-slate-100 flex items-center gap-2">
          <span className="text-lg">💰</span>
          <h3 className="text-base font-semibold text-gray-800">Collect Fee</h3>
          <span className="ml-auto text-xs text-slate-400">Search student → see balance → receive payment</span>
        </div>
        <div className="px-6 py-5 space-y-5">

          {/* Student Search */}
          <StudentSearchBox
            label="Search student by name, phone or ID"
            selectedStudent={collectStudent}
            onSelect={handleSelectCollectStudent}
            onClear={() => { setCollectStudent(null); setCollectFees([]); setCollectSummary(null); setCollectLastPay(null); setCollectError(""); setCollectSuccess("") }}
          />

          {collectError && <div className="bg-red-50 border border-red-200 rounded-lg px-4 py-2"><p className="text-red-600 text-sm">{collectError}</p></div>}
          {collectSuccess && <div className="bg-green-50 border border-green-200 rounded-lg px-4 py-2 flex items-center justify-between gap-3">
            <p className="text-green-700 text-sm font-medium">{collectSuccess}</p>
            {collectLastPay && (
              <button
                onClick={() => generateReceipt(
                  collectLastPay.payment, collectLastPay.fee,
                  collectStudent?.name, collectStudent?.student_code,
                  collectStudent?.course, collectStudent?.parent_phone
                )}
                className="shrink-0 bg-blue-600 hover:bg-blue-700 text-white text-xs font-medium px-3 py-1.5 rounded-lg transition">
                🧾 Download Receipt
              </button>
            )}
          </div>}

          {collectLoading && <p className="text-sm text-slate-400">Loading fees…</p>}

          {/* Summary tiles */}
          {collectSummary && collectStudent && (
            <div className="grid grid-cols-3 gap-3">
              {[
                { label: "Total Fee",   val: collectSummary.total_fees, color: "text-slate-700",  bg: "bg-slate-50",  border: "border-slate-200" },
                { label: "Received",    val: collectSummary.paid,       color: "text-green-700",  bg: "bg-green-50",  border: "border-green-200" },
                { label: "Pending",     val: collectSummary.pending,    color: "text-red-600",    bg: "bg-red-50",    border: "border-red-200"   },
              ].map(({ label, val, color, bg, border }) => (
                <div key={label} className={`${bg} border ${border} rounded-xl p-4 text-center`}>
                  <p className="text-xs font-semibold text-slate-500 uppercase tracking-wide mb-1">{label}</p>
                  <p className={`text-xl font-bold ${color} font-variant-numeric`}>{formatCurrency(val ?? 0)}</p>
                </div>
              ))}
            </div>
          )}

          {/* Pending fees list */}
          {collectFees.filter(f => f.paid < f.amount).length > 0 && (
            <div className="space-y-3">
              <p className="text-xs font-semibold text-slate-500 uppercase tracking-wide">Pending Fee Records</p>
              {collectFees.filter(f => f.paid < f.amount).map(fee => {
                const remaining = fee.amount - fee.paid
                const pf = getCollectPayForm(fee.id)
                const isPaying = collectPayingId === fee.id
                return (
                  <div key={fee.id} className="border border-slate-200 rounded-xl overflow-hidden">
                    {/* Fee header */}
                    <div className="flex items-center justify-between px-4 py-3 bg-slate-50">
                      <div>
                        <p className="text-sm font-semibold text-slate-800">{fee.description || "Fee"}</p>
                        <p className="text-xs text-slate-500 mt-0.5">
                          Total ₹{fee.amount.toLocaleString("en-IN")} · Paid ₹{fee.paid.toLocaleString("en-IN")} ·{" "}
                          <span className="text-red-600 font-medium">Due ₹{remaining.toLocaleString("en-IN")}</span>
                          {fee.due_date && <span className="ml-2 text-slate-400">· Due {formatDate(fee.due_date)}</span>}
                        </p>
                      </div>
                      {isOverdue(fee.due_date) && fee.paid < fee.amount && (
                        <span className="text-xs font-bold text-red-600 bg-red-100 px-2 py-0.5 rounded-full">OVERDUE</span>
                      )}
                    </div>
                    {/* Inline pay form */}
                    <div className="px-4 py-3 flex flex-wrap gap-2 items-end bg-white">
                      <div>
                        <label className="form-label">Amount (₹)</label>
                        <input
                          type="number" min="1" max={remaining} placeholder={`Max ${remaining.toLocaleString("en-IN")}`}
                          value={pf.amount}
                          onChange={e => setCollectPayForm(fee.id, { amount: e.target.value })}
                          className="inp w-36"
                        />
                      </div>
                      <div>
                        <label className="form-label">Mode</label>
                        <select value={pf.payment_mode} onChange={e => setCollectPayForm(fee.id, { payment_mode: e.target.value })} className="inp w-32">
                          {["Cash","UPI","Bank Transfer","Cheque","Other"].map(m => <option key={m}>{m}</option>)}
                        </select>
                      </div>
                      <div>
                        <label className="form-label">Date</label>
                        <input type="date" value={pf.paid_date} onChange={e => setCollectPayForm(fee.id, { paid_date: e.target.value })} className="inp w-36" />
                      </div>
                      <button
                        onClick={() => handleCollectPay(fee)}
                        disabled={isPaying || !pf.amount}
                        className="bg-green-600 hover:bg-green-700 text-white px-5 py-2 rounded-lg text-sm font-semibold transition disabled:opacity-50 flex items-center gap-1.5">
                        {isPaying ? "Processing…" : "✓ Receive"}
                      </button>
                    </div>
                  </div>
                )
              })}
            </div>
          )}

          {/* All paid */}
          {collectStudent && !collectLoading && collectFees.length > 0 && collectFees.every(f => f.paid >= f.amount) && (
            <div className="text-center py-4">
              <p className="text-green-700 font-semibold text-sm">✅ All fees cleared for {collectStudent.name}</p>
            </div>
          )}

          {/* No fees */}
          {collectStudent && !collectLoading && collectFees.length === 0 && !collectError && (
            <p className="text-sm text-slate-400">No fee records found for this student.</p>
          )}

        </div>
      </div>

      {/* ── Add Fees Record ─────────────────────────────────── */}
      <div className="card p-6">
        <h3 className="section-title mb-4 pb-2 border-b border-slate-100">Add Fee Record</h3>
        <form onSubmit={handleAddFees} className="space-y-4">

          {/* Student search */}
          <StudentSearchBox
            label="Student * — search by name, phone or ID"
            selectedStudent={addStudent}
            onSelect={setAddStudent}
            onClear={() => setAddStudent(null)}
          />

          {/* Fee fields */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div>
              <label className="form-label">Total Amount (₹) *</label>
              <input type="number" value={addForm.amount}
                onChange={(e) => setAddForm({ ...addForm, amount: e.target.value })}
                placeholder="e.g. 12000" min="1"
                className="inp" />
            </div>
            <div>
              <label className="form-label">Due Date</label>
              <input type="date" value={addForm.due_date}
                onChange={(e) => setAddForm({ ...addForm, due_date: e.target.value })}
                className="inp" />
            </div>
            <div>
              <label className="form-label">Description</label>
              <input type="text" value={addForm.description}
                onChange={(e) => setAddForm({ ...addForm, description: e.target.value })}
                placeholder="e.g. Term 1 Fees"
                className="inp" />
            </div>
          </div>

          <button type="submit" disabled={submitting || !addStudent}
            className="btn-primary">
            {submitting ? "Adding..." : "Add Fees"}
          </button>
        </form>

        {error && <div className="mt-3 bg-red-50 border border-red-200 rounded-lg px-4 py-2"><p className="text-red-600 text-sm">{error}</p></div>}
        {success && <div className="mt-3 bg-green-50 border border-green-200 rounded-lg px-4 py-2"><p className="text-green-600 text-sm">{success}</p></div>}
      </div>

      {/* ── Bulk Fee Addition ───────────────────────────────── */}
      <div className="card p-6">
        <h3 className="section-title mb-4 pb-2 border-b border-slate-100">Bulk Add Fee (Entire Course)</h3>
        <form onSubmit={handleBulkFee} className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
            <div>
              <label className="form-label">Course *</label>
              <select value={bulkForm.course_name}
                onChange={e => setBulkForm(f => ({ ...f, course_name: e.target.value }))}
                className="inp">
                <option value="">— Select course —</option>
                {courses.map(c => <option key={c.id} value={c.name}>{c.name}</option>)}
              </select>
            </div>
            <div>
              <label className="form-label">Amount (₹) *</label>
              <input type="number" value={bulkForm.amount} min="1"
                onChange={e => setBulkForm(f => ({ ...f, amount: e.target.value }))}
                placeholder="e.g. 5000"
                className="inp" />
            </div>
            <div>
              <label className="form-label">Description</label>
              <input type="text" value={bulkForm.description}
                onChange={e => setBulkForm(f => ({ ...f, description: e.target.value }))}
                placeholder="e.g. Annual Fees"
                className="inp" />
            </div>
            <div>
              <label className="form-label">Due Date</label>
              <input type="date" value={bulkForm.due_date}
                onChange={e => setBulkForm(f => ({ ...f, due_date: e.target.value }))}
                className="inp" />
            </div>
          </div>
          <button type="submit" disabled={bulkSubmitting}
            className="bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-2 rounded-lg text-sm font-medium transition disabled:opacity-50">
            {bulkSubmitting ? "Applying…" : "Apply to All Students in Course"}
          </button>
        </form>
        {bulkError && <div className="mt-3 bg-red-50 border border-red-200 rounded-lg px-4 py-2"><p className="text-red-600 text-sm">{bulkError}</p></div>}
        {bulkSuccess && <div className="mt-3 bg-green-50 border border-green-200 rounded-lg px-4 py-2"><p className="text-green-600 text-sm">{bulkSuccess}</p></div>}
      </div>

      {/* ── Fee Templates ───────────────────────────────────── */}
      <div className="card overflow-hidden">
        <button onClick={toggleTemplates}
          className="w-full flex items-center justify-between px-6 py-4 text-left hover:bg-gray-50 transition">
          <h3 className="text-base font-semibold text-gray-700">📋 Fee Templates</h3>
          <span className="text-gray-400 text-sm">{templatesOpen ? "▲ Collapse" : "▼ Expand"}</span>
        </button>

        {templatesOpen && (
          <div className="border-t px-6 py-5 space-y-5">
            {templateError && <div className="bg-red-50 border border-red-200 rounded-lg px-4 py-2"><p className="text-red-600 text-sm">{templateError}</p></div>}
            {templateSuccess && <div className="bg-green-50 border border-green-200 rounded-lg px-4 py-2"><p className="text-green-600 text-sm">{templateSuccess}</p></div>}

            {/* Create Template */}
            <div>
              <h4 className="text-sm font-semibold text-gray-600 mb-3">Create New Template</h4>
              <form onSubmit={handleCreateTemplate} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
                <div>
                  <label className="form-label">Template Name *</label>
                  <input type="text" value={newTemplate.name}
                    onChange={e => setNewTemplate(f => ({ ...f, name: e.target.value }))}
                    placeholder="e.g. Term 1 Fee"
                    className="inp" />
                </div>
                <div>
                  <label className="form-label">Course (optional)</label>
                  <select value={newTemplate.course}
                    onChange={e => setNewTemplate(f => ({ ...f, course: e.target.value }))}
                    className="inp">
                    <option value="">All Courses</option>
                    {courses.map(c => <option key={c.id} value={c.name}>{c.name}</option>)}
                  </select>
                </div>
                <div>
                  <label className="form-label">Amount (₹) *</label>
                  <input type="number" value={newTemplate.amount} min="1"
                    onChange={e => setNewTemplate(f => ({ ...f, amount: e.target.value }))}
                    placeholder="e.g. 8000"
                    className="inp" />
                </div>
                <div>
                  <label className="form-label">Description</label>
                  <input type="text" value={newTemplate.description}
                    onChange={e => setNewTemplate(f => ({ ...f, description: e.target.value }))}
                    placeholder="Optional description"
                    className="inp" />
                </div>
                <div className="sm:col-span-2 lg:col-span-4">
                  <button type="submit" disabled={templateSubmitting}
                    className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-2 rounded-lg text-sm font-medium transition disabled:opacity-50">
                    {templateSubmitting ? "Saving…" : "Create Template"}
                  </button>
                </div>
              </form>
            </div>

            {/* Template List */}
            <div>
              <div className="flex items-center justify-between mb-3">
                <h4 className="text-sm font-semibold text-gray-600">Existing Templates</h4>
                <button onClick={loadTemplates} className="text-xs text-blue-600 hover:underline">Refresh</button>
              </div>
              {templatesLoading ? (
                <div className="flex items-center gap-2 text-gray-400 text-sm py-2">
                  <div className="w-4 h-4 border-2 border-blue-400 border-t-transparent rounded-full animate-spin" />Loading…
                </div>
              ) : templates.length === 0 ? (
                <p className="text-gray-400 text-sm py-2">No templates yet. Create one above.</p>
              ) : (
                <div className="space-y-2">
                  {templates.map(t => (
                    <div key={t.id} className="flex items-center justify-between bg-gray-50 rounded-lg px-4 py-3 border border-gray-200">
                      <div className="flex items-center gap-3 flex-1 min-w-0">
                        <div>
                          <p className="text-sm font-semibold text-gray-800">{t.name}</p>
                          {t.description && <p className="text-xs text-gray-400">{t.description}</p>}
                        </div>
                        {t.course
                          ? <span className="text-xs bg-blue-100 text-blue-700 px-2 py-0.5 rounded-full font-medium flex-shrink-0">{t.course}</span>
                          : <span className="text-xs bg-gray-200 text-gray-500 px-2 py-0.5 rounded-full font-medium flex-shrink-0">All Courses</span>
                        }
                        <span className="text-sm font-bold text-gray-800 flex-shrink-0">{formatCurrency(t.amount)}</span>
                      </div>
                      <div className="flex gap-2 ml-3 flex-shrink-0">
                        <button onClick={() => { setApplyModal(t); setApplyCourse(t.course || ""); setTemplateError("") }}
                          className="bg-indigo-100 hover:bg-indigo-200 text-indigo-700 px-3 py-1 rounded text-xs font-medium transition">
                          Apply
                        </button>
                        <button onClick={() => handleDeleteTemplate(t.id)}
                          className="bg-red-100 hover:bg-red-200 text-red-600 px-3 py-1 rounded text-xs font-medium transition">
                          Delete
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Apply Template Modal */}
      {applyModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
          onClick={() => { setApplyModal(null); setApplyCourse("") }}>
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md p-6" onClick={e => e.stopPropagation()}>
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-bold text-gray-800">Apply Template: {applyModal.name}</h3>
              <button onClick={() => { setApplyModal(null); setApplyCourse("") }} className="text-gray-400 hover:text-gray-600 text-2xl leading-none">×</button>
            </div>
            <p className="text-sm text-gray-500 mb-4">
              Amount: <strong>{formatCurrency(applyModal.amount)}</strong>
              {applyModal.description && <span> · {applyModal.description}</span>}
            </p>
            {!applyModal.course && (
              <div className="mb-4">
                <label className="form-label">Select Course *</label>
                <select value={applyCourse} onChange={e => setApplyCourse(e.target.value)}
                  className="inp">
                  <option value="">— Choose a course —</option>
                  {courses.map(c => <option key={c.id} value={c.name}>{c.name}</option>)}
                </select>
              </div>
            )}
            {applyModal.course && (
              <p className="text-sm text-gray-600 mb-4">This will apply to all students in <strong>{applyModal.course}</strong>.</p>
            )}
            {templateError && <p className="text-red-600 text-sm mb-3">{templateError}</p>}
            <div className="flex gap-3">
              <button onClick={handleApplyTemplate} disabled={applySubmitting || (!applyModal.course && !applyCourse)}
                className="flex-1 bg-indigo-600 hover:bg-indigo-700 text-white py-2 rounded-lg text-sm font-medium transition disabled:opacity-50">
                {applySubmitting ? "Applying…" : "Confirm & Apply"}
              </button>
              <button onClick={() => { setApplyModal(null); setApplyCourse("") }}
                className="flex-1 bg-gray-200 hover:bg-gray-300 text-gray-700 py-2 rounded-lg text-sm transition">
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ── View Student Fees ───────────────────────────────── */}
      <div className="card">
        {/* Header + mode tabs */}
        <div className="flex items-center justify-between px-5 pt-4 pb-0">
          <h3 className="text-base font-semibold text-gray-700">🔍 View Student Fees</h3>
          <div className="flex border rounded-lg overflow-hidden text-sm">
            <button
              onClick={() => { setViewMode("search"); setSelectedCourse(""); setCourseStudents([]) }}
              className={`px-4 py-1.5 font-medium transition ${viewMode === "search" ? "bg-gray-800 text-white" : "bg-white text-gray-500 hover:bg-gray-50"}`}>
              Search
            </button>
            <button
              onClick={() => { setViewMode("course"); setViewStudent(null); setFees([]); setSummary(null) }}
              className={`px-4 py-1.5 font-medium transition ${viewMode === "course" ? "bg-gray-800 text-white" : "bg-white text-gray-500 hover:bg-gray-50"}`}>
              Browse by Course
            </button>
          </div>
        </div>

        <div className="p-5">
          {viewMode === "search" ? (
            /* ── Search mode ── */
            <StudentSearchBox
              selectedStudent={viewStudent}
              onSelect={handleSelectViewStudent}
              onClear={handleClearView}
            />
          ) : (
            /* ── Browse by course mode ── */
            <div className="space-y-3">
              {/* Course selector */}
              <div>
                <label className="form-label">Select Course</label>
                <select
                  value={selectedCourse}
                  onChange={(e) => { setSelectedCourse(e.target.value); setViewStudent(null); setFees([]); setSummary(null) }}
                  className="inp">
                  <option value="">— Choose a course —</option>
                  {courses.map((c) => (
                    <option key={c.id} value={c.name}>{c.name}</option>
                  ))}
                </select>
              </div>

              {/* Student grid */}
              {courseLoading ? (
                <div className="flex items-center gap-2 text-gray-400 text-sm py-2">
                  <div className="w-4 h-4 border-2 border-blue-400 border-t-transparent rounded-full animate-spin" />
                  Loading students…
                </div>
              ) : selectedCourse && courseStudents.length === 0 ? (
                <p className="text-sm text-gray-400 py-2">No students found in this course.</p>
              ) : courseStudents.length > 0 ? (
                <>
                  <p className="text-xs text-gray-400">{courseStudents.length} student{courseStudents.length !== 1 ? "s" : ""} — click to view fees</p>
                  <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2 max-h-64 overflow-y-auto pr-1">
                    {courseStudents.map((s) => (
                      <button key={s.id}
                        onClick={() => handleSelectViewStudent(s)}
                        className={`text-left rounded-lg border px-3 py-2.5 transition hover:shadow-md hover:border-blue-400 hover:bg-blue-50
                          ${viewStudent?.id === s.id ? "border-blue-500 bg-blue-50 shadow-md" : "border-gray-200 bg-white"}`}>
                        <div className="flex items-center gap-2 mb-1">
                          <div className="w-7 h-7 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center text-xs font-bold flex-shrink-0">
                            {s.name.charAt(0).toUpperCase()}
                          </div>
                          <span className="font-mono text-xs text-gray-400">{s.student_code || `#${s.id}`}</span>
                        </div>
                        <p className="text-sm font-semibold text-gray-800 leading-tight truncate">{s.name}</p>
                        {s.phone && <p className="text-xs text-gray-400 truncate mt-0.5">{s.phone}</p>}
                      </button>
                    ))}
                  </div>
                </>
              ) : null}
            </div>
          )}
        </div>
      </div>

      {/* Summary */}
      {summary && viewStudent && (
        <>
          {/* Student banner */}
          <div className="bg-gradient-to-r from-gray-700 to-gray-900 rounded-xl p-4 text-white flex items-center gap-4">
            <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center text-lg font-bold flex-shrink-0">
              {viewStudent.name.charAt(0).toUpperCase()}
            </div>
            <div>
              <p className="font-bold text-lg">{viewStudent.name}</p>
              <p className="text-sm text-gray-300">
                {viewStudent.student_code && <span className="font-mono mr-3">{viewStudent.student_code}</span>}
                {viewStudent.phone && <span>📞 {viewStudent.phone}</span>}
                {viewStudent.course && <span className="ml-3">· {viewStudent.course}</span>}
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <SummaryCard label="Total Fees" value={formatCurrency(summary.total_fees)} color="blue" />
            <SummaryCard label="Paid" value={formatCurrency(summary.paid)} color="green" />
            <SummaryCard label="Pending" value={formatCurrency(summary.pending)} color="red" />
          </div>
        </>
      )}

      {/* Filter */}
      {fees.length > 0 && (
        <div className="card p-4 flex flex-wrap gap-3 items-center">
          <span className="text-sm font-medium text-slate-600">Filter:</span>
          <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)} className="inp w-auto">
            <option value="all">All</option>
            <option value="paid">Fully Paid</option>
            <option value="unpaid">Has Pending</option>
          </select>
          <span className="text-sm text-slate-400 ml-auto">{filtered.length} of {fees.length} records</span>
        </div>
      )}

      {/* Fees Table */}
      <div className="card overflow-hidden">
        {loading ? (
          <div className="p-6 flex items-center gap-3 text-slate-500">
            <div className="w-5 h-5 border-2 border-primary-500 border-t-transparent rounded-full animate-spin" />
            Loading fees...
          </div>
        ) : !viewStudent ? (
          <div className="p-12 text-center">
            <p className="text-4xl mb-3">💰</p>
            <p className="text-gray-400">Search and select a student above to view their fees.</p>
          </div>
        ) : fees.length === 0 ? (
          <div className="p-12 text-center">
            <p className="text-3xl mb-3">📭</p>
            <p className="text-gray-400">No fee records for this student yet.</p>
          </div>
        ) : filtered.length === 0 ? (
          <p className="p-6 text-gray-400">No records match the filter.</p>
        ) : (
          <>
          {/* ── Edit Fee Modal ── */}
          {editingFee && (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
              onClick={() => setEditingFee(null)}>
              <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md p-6" onClick={e => e.stopPropagation()}>
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-bold text-gray-800">Edit Fee Record</h3>
                  <button onClick={() => setEditingFee(null)} className="text-gray-400 hover:text-gray-600 text-2xl leading-none">×</button>
                </div>
                <form onSubmit={handleUpdateFee} className="space-y-3">
                  <div>
                    <label className="form-label">Total Amount (Rs.) *</label>
                    <input type="number" value={editForm.amount} min="0.01" step="0.01"
                      onChange={e => setEditForm(f => ({ ...f, amount: e.target.value }))}
                      className="inp" />
                    {editingFee.paid > 0 && (
                      <p className="text-xs text-gray-400 mt-0.5">Already paid: {formatCurrency(editingFee.paid)} — amount cannot go below this</p>
                    )}
                  </div>
                  <div>
                    <label className="form-label">Description</label>
                    <input type="text" value={editForm.description}
                      onChange={e => setEditForm(f => ({ ...f, description: e.target.value }))}
                      placeholder="e.g. Term 1 Fees"
                      className="inp" />
                  </div>
                  <div>
                    <label className="form-label">Due Date</label>
                    <input type="date" value={editForm.due_date}
                      onChange={e => setEditForm(f => ({ ...f, due_date: e.target.value }))}
                      className="inp" />
                  </div>
                  {error && <p className="text-red-600 text-sm">{error}</p>}
                  <div className="flex gap-2 pt-1">
                    <button type="submit" disabled={saving}
                      className="flex-1 bg-blue-600 hover:bg-blue-700 text-white py-2 rounded-lg text-sm font-medium transition disabled:opacity-50">
                      {saving ? "Saving…" : "Save Changes"}
                    </button>
                    {deleteConfirmId === editingFee.id ? (
                      <div className="flex gap-1">
                        <button type="button" onClick={() => handleDeleteFee(editingFee.id)} disabled={deleting}
                          className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition disabled:opacity-50">
                          {deleting ? "…" : "Confirm Delete"}
                        </button>
                        <button type="button" onClick={() => setDeleteConfirmId(null)}
                          className="bg-gray-200 hover:bg-gray-300 text-gray-700 px-3 py-2 rounded-lg text-sm transition">
                          Cancel
                        </button>
                      </div>
                    ) : (
                      <button type="button" onClick={() => setDeleteConfirmId(editingFee.id)}
                        className="bg-red-50 hover:bg-red-100 text-red-600 border border-red-200 px-4 py-2 rounded-lg text-sm font-medium transition">
                        🗑 Delete
                      </button>
                    )}
                  </div>
                </form>
              </div>
            </div>
          )}

          <div className="overflow-x-auto">
            <table className="w-full text-sm min-w-[700px]">
              <thead>
                <tr className="bg-slate-800 text-white text-xs uppercase">
                  <th className="text-left px-5 py-3">Description</th>
                  <th className="text-left px-5 py-3">Due Date</th>
                  <th className="text-left px-5 py-3">Total</th>
                  <th className="text-left px-5 py-3">Paid</th>
                  <th className="text-left px-5 py-3">Pending</th>
                  <th className="text-left px-5 py-3">Status</th>
                  <th className="text-left px-5 py-3">Record Payment</th>
                  <th className="text-left px-5 py-3">History</th>
                  <th className="px-5 py-3"></th>
                </tr>
              </thead>
              <tbody>
                {filtered.slice((feePage - 1) * FEE_PAGE_SIZE, feePage * FEE_PAGE_SIZE).map((f) => {
                  const pending = f.amount - f.paid
                  const isFullyPaid = pending <= 0.001
                  const overdue = !isFullyPaid && isOverdue(f.due_date)
                  const expanded = expandedId === f.id
                  const pf = getPayForm(f.id)
                  return (
                    <>
                      <tr key={f.id} className={`border-t transition ${overdue ? "bg-red-50" : ""} hover:bg-gray-50`}>
                        <td className="px-5 py-3 font-medium">{f.description || "—"}</td>
                        <td className="px-5 py-3">
                          {f.due_date ? (
                            <span className={`text-xs font-medium ${overdue ? "text-red-600" : "text-gray-600"}`}>
                              {overdue && "⚠️ "}{formatDate(f.due_date)}
                            </span>
                          ) : "—"}
                        </td>
                        <td className="px-5 py-3">{formatCurrency(f.amount)}</td>
                        <td className="px-5 py-3 text-green-600 font-medium">{formatCurrency(f.paid)}</td>
                        <td className="px-5 py-3 text-red-600 font-medium">{formatCurrency(pending)}</td>
                        <td className="px-5 py-3">
                          <span className={`px-2 py-1 rounded-full text-xs font-medium ${isFullyPaid ? "bg-green-100 text-green-700" : overdue ? "bg-red-100 text-red-700" : "bg-yellow-100 text-yellow-700"}`}>
                            {isFullyPaid ? "Paid" : overdue ? "Overdue" : "Pending"}
                          </span>
                        </td>
                        <td className="px-5 py-3">
                          {!isFullyPaid ? (
                            <div className="flex flex-col gap-1 min-w-[220px]">
                              <div className="flex gap-1">
                                <input type="number" placeholder="Rs. Amount" value={pf.amount}
                                  onChange={(e) => setPayForm(f.id, { amount: e.target.value })}
                                  min="1" className="border border-gray-300 rounded px-2 py-1 w-24 text-xs focus:outline-none focus:ring-1 focus:ring-blue-500" />
                                <input type="date" value={pf.paid_date}
                                  onChange={(e) => setPayForm(f.id, { paid_date: e.target.value })}
                                  className="border border-gray-300 rounded px-2 py-1 text-xs focus:outline-none focus:ring-1 focus:ring-blue-500" />
                              </div>
                              <div className="flex gap-1">
                                <input type="text" placeholder="Note (optional)" value={pf.note}
                                  onChange={(e) => setPayForm(f.id, { note: e.target.value })}
                                  className="border border-gray-300 rounded px-2 py-1 flex-1 text-xs focus:outline-none focus:ring-1 focus:ring-blue-500" />
                              </div>
                              <div className="flex gap-1">
                                <select value={pf.payment_mode}
                                  onChange={(e) => setPayForm(f.id, { payment_mode: e.target.value })}
                                  className="border border-gray-300 rounded px-2 py-1 flex-1 text-xs focus:outline-none focus:ring-1 focus:ring-blue-500">
                                  <option value="Cash">Cash</option>
                                  <option value="UPI">UPI</option>
                                  <option value="Bank Transfer">Bank Transfer</option>
                                  <option value="Cheque">Cheque</option>
                                </select>
                                <button onClick={() => handlePay(f.id)} disabled={payingId === f.id}
                                  className="bg-green-500 hover:bg-green-600 text-white px-3 py-1 rounded text-xs transition disabled:opacity-50">
                                  {payingId === f.id ? "..." : "Pay"}
                                </button>
                              </div>
                            </div>
                          ) : (
                            <span className="text-green-600 text-xs font-medium">✅ Fully Paid</span>
                          )}
                        </td>
                        <td className="px-5 py-3">
                          <button onClick={() => setExpandedId(expanded ? null : f.id)}
                            className="text-blue-600 text-xs underline hover:text-blue-800">
                            {expanded ? "Hide" : "View"}
                          </button>
                        </td>
                        <td className="px-5 py-3">
                          <button onClick={() => openEditFee(f)}
                            className="bg-gray-100 hover:bg-gray-200 text-gray-600 px-2.5 py-1 rounded text-xs font-medium transition">
                            ✏️ Edit
                          </button>
                        </td>
                      </tr>
                      {expanded && (
                        <tr key={`hist-${f.id}`} className="bg-blue-50 border-t">
                          <td colSpan={9} className="px-2 py-2">
                            <p className="text-xs font-semibold text-gray-500 px-4 pb-1">Payment History</p>
                            <PaymentHistory key={historyKey} feeId={f.id} fee={f}
                              studentName={viewStudent?.name} studentCode={viewStudent?.student_code}
                              course={viewStudent?.course} parentPhone={viewStudent?.parent_phone} />
                          </td>
                        </tr>
                      )}
                    </>
                  )
                })}
              </tbody>
            </table>
          </div>
          <PaginationBar page={feePage} total={filtered.length} pageSize={FEE_PAGE_SIZE} onChange={setFeePage} />
          </>
        )}
      </div>
    </div>
  )
}

// ── Shared summary card ──────────────────────────────────────
function SummaryCard({ label, value, color }) {
  const border = { blue: "border-primary-500", green: "border-green-500", red: "border-red-500" }[color]
  const text = { blue: "text-slate-800", green: "text-green-600", red: "text-red-600" }[color]
  return (
    <div className={`card p-5 border-l-4 ${border}`}>
      <p className="text-xs text-slate-500 font-medium">{label}</p>
      <p className={`text-2xl font-bold mt-1 ${text}`}>{value}</p>
    </div>
  )
}

function today() {
  return new Date().toISOString().split("T")[0]
}

// ── Main ─────────────────────────────────────────────────────
export default function Fees() {
  const { user, isAdmin, isStaff } = useAuth()
  return (
    <div className="flex min-h-screen">
      <Sidebar />
      <main className="page-main">
        {(isAdmin || isStaff) ? <AdminFees /> : <StudentFees studentId={user?.student_id} studentName={user?.name} studentCode={user?.student_code} course={user?.course} parentPhone={user?.parent_phone} />}
      </main>
    </div>
  )
}
