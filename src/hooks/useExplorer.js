import { useCallback, useState } from 'react'
import { askGemini, parseJSON, branchPrompt } from '../api.js'
import { randomSeed } from '../music.js'

export function useExplorer({ onExploreStart } = {}) {
  const [query, setQuery] = useState('')
  const [current, setCurrent] = useState(null)
  const [branches, setBranches] = useState([])
  const [trail, setTrail] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  const explore = useCallback(
    async (name, visited = []) => {
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
  }
}
