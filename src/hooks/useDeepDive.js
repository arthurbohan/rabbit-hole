import { useCallback, useState } from 'react'
import { askGemini } from '../api.js'

export function useDeepDive() {
  const [deep, setDeep] = useState({})
  const [deepLoading, setDeepLoading] = useState(null)

  const reset = useCallback(() => setDeep({}), [])

  const digDeeper = async (key, prompt) => {
    if (deep[key]) {
      setDeep((d) => ({ ...d, [key]: null }))
      return
    }
    setDeepLoading(key)
    try {
      const text = await askGemini(prompt, 3000)
      setDeep((d) => ({ ...d, [key]: text.trim() }))
    } catch (e) {
      console.error(e)
      setDeep((d) => ({ ...d, [key]: "Couldn't load the notes. Try again." }))
    } finally {
      setDeepLoading(null)
    }
  }

  return { deep, deepLoading, digDeeper, reset }
}