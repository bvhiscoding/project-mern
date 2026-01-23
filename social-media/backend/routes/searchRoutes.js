const express = require('express')
const router = express.Router()
const {
    searchUsers,
    searchPosts,
    searchAll
} = require('../controllers/searchController')
const {protect} = require('../middlewares/authMiddleware')

router.use(protect)
router.get('/users', searchUsers)
router.get('/posts',searchPosts)
router.get('/', searchAll)

module.exports = router