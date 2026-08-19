import { Router } from 'express'
import crypto from 'node:crypto'
import { getAuthUrl, exchangeCode } from '../services/googleAuth.js'
import { findOrCreateUser, getUserById } from '../services/userStore.js'

const router = Router()

router.get('/google', (req, res) => {
  const state = crypto.randomBytes(16).toString('hex')
  req.session.oauthState = state
  res.redirect(getAuthUrl(state))
})

router.get('/google/callback', async (req, res) => {
  const { code, state } = req.query
  if (!code || !state || state !== req.session.oauthState) {
    return res.status(400).send('Invalid OAuth state')
  }
  delete req.session.oauthState

  try {
    const profile = await exchangeCode(code)
    const user = findOrCreateUser(profile)
    req.session.userId = user.id
    res.redirect(process.env.PUBLIC_URL)
  } catch (e) {
    console.error(e)
    res.status(500).send('Login failed')
  }
})

router.get('/me', (req, res) => {
  const user = req.session.userId ? getUserById(req.session.userId) : null
  if (!user) return res.status(401).json({ error: 'Not logged in' })
  res.json({ user: { id: user.id, email: user.email, name: user.name } })
})

router.post('/logout', (req, res) => {
  req.session.destroy(() => res.status(204).end())
})

export default router
