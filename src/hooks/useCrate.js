import { useEffect, useState } from 'react'

const CRATE_KEY = 'rabbithole:crate:v1'

function loadCrate() {
  try {
    return JSON.parse(localStorage.getItem(CRATE_KEY)) || []
  } catch {
    return []
  }
}

const crateId = (branch) => `${branch.name}::${branch.track || ''}`

export function useCrate() {
  const [crate, setCrate] = useState(loadCrate)
  const [crateOpen, setCrateOpen] = useState(false)

  useEffect(() => {
    try {
      localStorage.setItem(CRATE_KEY, JSON.stringify(crate))
    } catch (e) {
      console.error('Could not save crate', e)
    }
  }, [crate])

  const inCrate = (branch) => crate.some((c) => c.id === crateId(branch))

  const addToCrate = (branch, fromName) => {
    if (inCrate(branch)) return
    setCrate((prev) => [
      {
        id: crateId(branch),
        name: branch.name,
        track: branch.track,
        from: fromName || '',
        relation: branch.relation,
      },
      ...prev,
    ])
  }

  const removeFromCrate = (id) =>
    setCrate((prev) => prev.filter((c) => c.id !== id))

  return {
    crate,
    crateOpen,
    setCrateOpen,
    inCrate,
    addToCrate,
    removeFromCrate,
  }
}
