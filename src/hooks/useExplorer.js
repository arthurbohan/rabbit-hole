import { useCallback, useEffect, useRef, useState } from 'react'
import { askGemini, parseJSON, branchPrompt } from '../api.js'
import { randomSeed } from '../music.js'

const SESSION_KEY = 'rabbithole:session:v1'

function loadSession() {
  try {
    return JSON.parse(localStorage.getItem(SESSION_KEY)) || {}
  } catch {
    return {}
  }
}

export function useExplorer({ onExploreStart, user } = {}) {
  const [query, setQuery] = useState('')
  const [current, setCurrent] = useState(() => loadSession().current || null)
  const [branches, setBranches] = useState(() => loadSession().branches || [])
  const [trail, setTrail] = useState(() => loadSession().trail || [])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const lastAttempt = useRef(null)
  const syncedUserId = useRef(null)

  // Keep the current page across reloads — only the "which page am I on"
  // state, not loading/error, which shouldn't survive a refresh. While
  // signed in, also push it to the server so it follows the account.
  useEffect(() => {
    try {
      localStorage.setItem(SESSION_KEY, JSON.stringify({ current, branches, trail }))
    } catch (e) {
      console.error('Could not save session', e)
    }
    if (user && current) {
      fetch('/api/trail', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ state: { current, branches, trail } })
      }).catch((e) => console.error('Could not save trail', e))
    }
  }, [current, branches, trail, user])

  // On login, resume the position saved on the server if there is one;
  // otherwise push whatever's currently showing as the starting point.
  useEffect(() => {
    if (!user || syncedUserId.current === user.id) return
    syncedUserId.current = user.id
    fetch('/api/trail')
      .then((res) => (res.ok ? res.json() : { state: null }))
      .then(({ state }) => {
        if (!state) return
        setCurrent(state.current || null)
        setBranches(state.branches || [])
        setTrail(state.trail || [])
      })
      .catch((e) => console.error('Could not sync trail', e))
  }, [user])

  const explore = useCallback(
    async (name, visited = []) => {
      lastAttempt.current = { name, visited }
      setLoading(true)
      setError(null)
      onExploreStart?.()
      try {
        const parsed = parseJSON(await askGemini(branchPrompt(name, visited)))
        setCurrent(parsed.node)
        setBranches(parsed.branches || [])
      } catch (e) {
        console.error(e)
        setError("Couldn't load the connections. Try again.")
      } finally {
        setLoading(false)
      }
    },
    [onExploreStart]
  )

  const retry = useCallback(() => {
    if (!lastAttempt.current) return
    explore(lastAttempt.current.name, lastAttempt.current.visited)
  }, [explore])

  const start = (name) => {
    if (!name.trim()) return
    setTrail([])
    explore(name.trim())
    setQuery('')
  }

  const surprise = () => {
    setTrail([])
    explore(randomSeed())
    setQuery('')
  }

  const goTo = (branch) => {
    const nextTrail = [
      ...trail,
      { name: current.name, relation: branch.relation },
    ]
    setTrail(nextTrail)
    explore(branch.name, [...nextTrail.map((hop) => hop.name), current.name])
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  const jumpBack = (index) => {
    const target = trail[index]
    const nextTrail = trail.slice(0, index)
    setTrail(nextTrail)
    explore(
      target.name,
      nextTrail.map((hop) => hop.name)
    )
  }

  return {
    query,
    setQuery,
    current,
    branches,
    trail,
    loading,
    error,
    start,
    surprise,
    goTo,
    jumpBack,
    retry,
  }
}
