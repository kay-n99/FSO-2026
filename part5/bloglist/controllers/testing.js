const router = require('express').Router()
const Blog = require('../models/blog')
const User = require('../models/user')

router.post('/reset', async (request, response) => {
  console.log('Resetting database...') // ADD THIS LOG
  try {
    await Blog.deleteMany({})
    await User.deleteMany({})
    console.log('Database cleared successfully')
    response.status(204).end()
  } catch (error) {
    console.error('Reset failed:', error)
    response.status(500).json({ error: 'reset failed' })
  }
})

module.exports = router