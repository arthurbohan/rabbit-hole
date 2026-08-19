import { useEffect, useRef, useState } from 'react'

const CRATE_KEY = 'rabbithole:crate:v1'

function loadCrate() {
  try {
    return JSON.parse(localStorage.getItem(CRATE_KEY)) || []
  } catch {
    return []
  }
}

const crateId = (branch) => `${branch.name}::${branch.track || ''}`

export function useCrate(user) {
  const [crate, setCrate] = useState(loadCrate)
  const [crateOpen, setCrateOpen] = useState(false)
  const crateRef = useRef(crate)
  const syncedUserId = useRef(null)

  useEffect(() => {
    crateRef.current = crate
    try {
      localStorage.setItem(CRATE_KEY, JSON.stringify(crate))
    } catch (e) {
      console.error('Could not save crate', e)
    }
  }, [crate])

  // On login, merge whatever's local into the server copy, then adopt the
  // merged result — runs once per session, not on every crate change.
  useEffect(() => {
    if (!user || syncedUserId.current === user.id) return
    syncedUserId.current = user.id
    fetch('/api/crate', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ items: crateRef.current })
    })
      .then((res) => res.json())
      .then((data) => setCrate(data.items))
      .catch((e) => console.error('Could not sync crate', e))
  }, [user])

  const inCrate = (branch) => crate.some((c) => c.id === crateId(branch))

  const addToCrate = (branch, fromName) => {
    if (inCrate(branch)) return
    const item = {
      id: crateId(branch),
      name: branch.name,
      track: branch.track,
      from: fromName || '',
      relation: branch.relation
    }
    setCrate((prev) => [item, ...prev])
    if (user) {
      fetch('/api/crate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ items: [item] })
      }).catch((e) => console.error('Could not save crate item', e))
    }
  }

  const removeFromCrate = (id) => {
    setCrate((prev) => prev.filter((c) => c.id !== id))
    if (user) {
      fetch(`/api/crate/${encodeURIComponent(id)}`, { method: 'DELETE' }).catch((e) =>
        console.error('Could not remove crate item', e)
      )
    }
  }

  return {
    crate,
    crateOpen,
    setCrateOpen,
    inCrate,
    addToCrate,
    removeFromCrate
  }
}
