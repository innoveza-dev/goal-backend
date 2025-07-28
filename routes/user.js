const express = require('express');
const router = express.Router();
const {
  signup,
  login,
  createProfile,
  getProfile,
  updateProfile,
  deleteProfile,
  getAllProfiles
} = require('../controller/userController');
const authMiddleware = require('../middleware/authMiddleware');
const upload = require('../middleware/upload');

router.post('/signup', signup);
router.post('/login', login);
router.post('/profile', authMiddleware, upload.single('photo'), createProfile);
router.get('/profile', authMiddleware, getProfile);
router.put('/profile/:id', authMiddleware, upload.single('photo'), updateProfile);
router.delete('/profile/:id', authMiddleware, deleteProfile);
router.get('/all', authMiddleware, getAllProfiles);

module.exports = router;
