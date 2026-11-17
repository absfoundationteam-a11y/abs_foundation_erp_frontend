import { useState, useEffect } from "react"
import axios from "axios"
import Sidebar from "../components/Sidebar"
import { LoadingState, Alert } from "../components/UI"

const BRANCH1_URL = import.meta.env.VITE_API_URL || "https://erp-backend-8wcj.onrender.com"
const BRANCH2_URL = import.meta.env.VITE_BRANCH2_API_URL || ""

function StatCard({ label, b1, b2, format = (v) => v ?? "—", color = "text-gray-800" }) {
  return (
    <div className="card p-5">
      <p className="text-xs text-gray-400 font-medium uppercase tracking-wide mb-3">{label}</p>
      <div className="grid grid-cols-2 gap-4">
        <div className="text-center">
          <p className={`text-2xl font-bold ${color}`}>{b1 !== null ? format(b1) : "—"}</p>
          <p className="text-xs text-blue-500 font-medium mt-1">Branch 1</p>
        </div>
        <div className="text-center">
          <p className={`text-2xl font-bold ${color}`}>{b2 !== null ? format(b2) : "—"}</p>
          <p className="text-xs text-purple-500 font-medium mt-1">Branch 2</p>
        </div>
      </div>
    </div>
  )
}

function CombinedStatCard({ label, b1, b2, format = (v) => v ?? "—", combineWith = (a, b) => a + b, color = "text-gray-800" }) {
  const combined = b1 !== null && b2 !== null ? combineWith(b1, b2) : null
  return (
    <div className="card p-5 border-l-4 border-green-400">
      <p className="text-xs text-gray-400 font-medium uppercase tracking-wide mb-1">{label}</p>
      <p className="text-xs text-green-500 font-medium mb-3">Combined Total</p>
      <div className="grid grid-cols-3 gap-3">
        <div className="text-center">
          <p className={`text-xl font-bold ${color}`}>{b1 !== null ? format(b1) : "—"}</p>
          <p className="text-xs text-blue-500 mt-1">Branch 1</p>
        </div>
        <div className="text-center border-x">
          <p className={`text-xl font-bold ${color}`}>{b2 !== null ? format(b2) : "—"}</p>
          <p className="text-xs text-purple-500 mt-1">Branch 2</p>
        </div>
        <div className="text-center">
          <p className={`text-2xl font-bold text-green-600`}>{combined !== null ? format(combined) : "—"}</p>
          <p className="text-xs text-green-500 mt-1">Total</p>
        </div>
      </div>
    </div>
  )
}

export default function CombinedReports() {
  const [data, setData] = useState({ b1: null, b2: null })
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")
  const [lastFetched, setLastFetched] = useState(null)

  const branch2Ready = Boolean(BRANCH2_URL)

  async function fetchAll() {
    setLoading(true)
    setError("")
    const token = localStorage.getItem("token")
    const headers = { Authorization: `Bearer ${token}` }

    const [r1, r2] = await Promise.allSettled([
      axios.get(`${BRANCH1_URL}/dashboard/summary`, { headers }),
      branch2Ready
        ? axios.get(`${BRANCH2_URL}/dashboard/summary`, { headers })
        : Promise.reject(new Error("Branch 2 not configured")),
    ])

    setData({
      b1: r1.status === "fulfilled" ? r1.value.data : null,
      b2: r2.status === "fulfilled" ? r2.value.data : null,
    })

    if (r1.status === "rejected") setError("Could not reach Branch 1 backend.")
    setLastFetched(new Date().toLocaleTimeString())
    setLoading(false)
  }

  useEffect(() => { fetchAll() }, [])

  const fmt = (n) => n?.toLocaleString("en-IN") ?? "—"
  const fmtRs = (n) => n != null ? `₹${Math.round(n).toLocaleString("en-IN")}` : "—"
  const fmtPct = (n) => n != null ? `${n}%` : "—"

  return (
    <div className="flex min-h-screen">
      <Sidebar />
      <main className="page-main">
        <div className="flex items-center justify-between mb-6 flex-wrap gap-3">
          <div>
            <h2 className="text-2xl font-bold text-slate-800">🏢 Combined Reports</h2>
            <p className="text-sm text-gray-400 mt-0.5">Live comparison across both branches</p>
          </div>
          <div className="flex items-center gap-3">
            {lastFetched && <span className="text-xs text-gray-400">Last updated: {lastFetched}</span>}
            <button onClick={fetchAll} disabled={loading}
              className="btn-primary text-sm px-4 py-2">
              {loading ? "Refreshing…" : "🔄 Refresh"}
            </button>
          </div>
        </div>

        {error && <Alert type="error" message={error} className="mb-4" />}

        {!branch2Ready && (
          <div className="card p-5 mb-6 border border-orange-200 bg-orange-50">
            <p className="text-orange-700 font-semibold text-sm">⚠️ Branch 2 not configured yet</p>
            <p className="text-orange-600 text-sm mt-1">
              Add <code className="bg-orange-100 px-1 rounded">VITE_BRANCH2_API_URL</code> to your Vercel environment variables once Branch 2 is deployed on Render.
            </p>
          </div>
        )}

        {loading ? (
          <LoadingState message="Fetching data from both branches…" />
        ) : (
          <div className="space-y-6">

            {/* Combined totals */}
            <div>
              <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wide mb-3">Combined Totals</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <CombinedStatCard label="Students"  b1={data.b1?.total_students}  b2={data.b2?.total_students}  format={fmt}   color="text-blue-600" />
                <CombinedStatCard label="Teachers"  b1={data.b1?.total_teachers}  b2={data.b2?.total_teachers}  format={fmt}   color="text-purple-600" />
                <CombinedStatCard label="Total Fees"    b1={data.b1?.total_fees}    b2={data.b2?.total_fees}    format={fmtRs} color="text-gray-700" />
                <CombinedStatCard label="Fees Collected" b1={data.b1?.total_paid}  b2={data.b2?.total_paid}    format={fmtRs} color="text-green-600" />
                <CombinedStatCard label="Fees Pending"  b1={data.b1?.total_pending} b2={data.b2?.total_pending} format={fmtRs} color="text-red-500" />
              </div>
            </div>

            {/* Side-by-side comparison */}
            <div>
              <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wide mb-3">Branch Comparison</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                <StatCard label="Today's Attendance"
                  b1={data.b1?.attendance_today_pct?.pct}
                  b2={data.b2?.attendance_today_pct?.pct}
                  format={fmtPct}
                  color="text-teal-600" />
                <StatCard label="Overdue Fees Count"
                  b1={data.b1?.overdue_fees_count}
                  b2={data.b2?.overdue_fees_count}
                  format={fmt}
                  color="text-orange-500" />
                <StatCard label="Total Courses"
                  b1={data.b1?.course_stats?.length}
                  b2={data.b2?.course_stats?.length}
                  format={fmt}
                  color="text-indigo-600" />
              </div>
            </div>

            {/* Course breakdown */}
            {(data.b1?.course_stats?.length > 0 || data.b2?.course_stats?.length > 0) && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {[
                  { label: "Branch 1 — Courses", stats: data.b1?.course_stats, color: "border-blue-500", badge: "bg-blue-50 text-blue-700" },
                  { label: "Branch 2 — Courses", stats: data.b2?.course_stats, color: "border-purple-500", badge: "bg-purple-50 text-purple-700" },
                ].map(({ label, stats, color, badge }) => (
                  <div key={label} className={`card overflow-hidden border-t-4 ${color}`}>
                    <div className="px-5 py-3 border-b bg-gray-50">
                      <p className="font-semibold text-gray-700 text-sm">{label}</p>
                    </div>
                    {!stats ? (
                      <p className="px-5 py-4 text-sm text-gray-400">Not available</p>
                    ) : stats.length === 0 ? (
                      <p className="px-5 py-4 text-sm text-gray-400">No courses yet</p>
                    ) : (
                      <div className="divide-y">
                        {stats.map((c) => (
                          <div key={c.name} className="flex items-center justify-between px-5 py-3">
                            <span className="text-sm font-medium text-gray-700">{c.name}</span>
                            <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${badge}`}>
                              {c.student_count ?? c.students ?? "—"} students
                            </span>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}

          </div>
        )}
      </main>
    </div>
  )
}
