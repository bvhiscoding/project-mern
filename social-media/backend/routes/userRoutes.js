const express = require('express');
const router = express.Router();
const {
  getUserByID,
  updateProfile,
  updateAvatar,
  followUser,
  unfollowUser,
  getFollowers,
  getFollowing,
} = require('../controllers/userController');
const { protect } = require('../middlewares/authMiddleware');
const upload = require('../middlewares/uploadMiddleware');


router.use(protect)

router.get('/:id' ,getUserByID)
router.put('/profile' , updateProfile)
router.put('/avatar', upload.single('avatar'), updateAvatar)
router.put('/follow/:id' , followUser)
router.put('/unfollow/:id' , unfollowUser)
router.get('/:id/followers', getFollowers);
router.get('/:id/following', getFollowing);
module.exports = router;