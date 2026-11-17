import { createContext, useContext, useState, useEffect } from "react"
import { setAPIBaseURL } from "../api"

const BRANCH1_URL = import.meta.env.VITE_API_URL || "https://erp-backend-8wcj.onrender.com"
const BRANCH2_URL = import.meta.env.VITE_BRANCH2_API_URL || ""

export const BRANCHES = {
  branch1: { id: "branch1", name: "Branch 1", shortName: "B1", url: BRANCH1_URL },
  branch2: { id: "branch2", name: "Branch 2", shortName: "B2", url: BRANCH2_URL },
}

const BranchContext = createContext()

export function BranchProvider({ children }) {
  const [activeBranchId, setActiveBranchId] = useState(() => {
    const stored = localStorage.getItem("activeBranch")
    return stored && BRANCHES[stored] ? stored : "branch1"
  })

  useEffect(() => {
    const branch = BRANCHES[activeBranchId]
    if (branch?.url) setAPIBaseURL(branch.url)
  }, [])

  function switchBranch(branchId) {
    if (branchId === activeBranchId) return
    const branch = BRANCHES[branchId]
    if (!branch?.url) return
    localStorage.setItem("activeBranch", branchId)
    setActiveBranchId(branchId)
    setAPIBaseURL(branch.url)
    window.location.reload()
  }

  return (
    <BranchContext.Provider value={{
      activeBranchId,
      activeBranch: BRANCHES[activeBranchId],
      switchBranch,
      branches: BRANCHES,
      branch2Configured: Boolean(BRANCH2_URL),
    }}>
      {children}
    </BranchContext.Provider>
  )
}

export function useBranch() {
  return useContext(BranchContext)
}
