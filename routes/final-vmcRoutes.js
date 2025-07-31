const express = require('express');
const router = express.Router();
const sectionUpload = require('../middleware/sectionUpload');
const authenticate = require('../middleware/authMiddleware');
const {
  addVision,
  addMission,
  addCore,
  getAll,
  getById,
  updateById,
  deleteById,
} = require('../controller/vmcController');

// router.post(
//   "/vision",
//   authenticate,
//   (req, res, next) => {
//     sectionUpload.vision.any()(req, res, (err) => {
//       if (err) return next(err);
//       sectionUpload.mission.any()(req, res, (err) => {
//         if (err) return next(err);
//         sectionUpload.core.any()(req, res, next);
//       });
//     });
//   },
//   addVision
// );

router.post('/vision', authenticate, sectionUpload.vision.any(), addVision);
router.post('/mission', authenticate, sectionUpload.mission.array('missionImage'), addMission);
router.get('/', authenticate, getAll);
router.get('/:id', authenticate, getById);
router.put(
  '/:id', authenticate,
  (req, res, next) => {
    const field = req.headers['upload-section'];
    if (field === 'vision') {
      return sectionUpload.vision.array('visionImage')(req, res, next);
    } else if (field === 'mission') {
      return sectionUpload.mission.array('missionImage')(req, res, next);
    } else if (field === 'core') {
      return sectionUpload.core.array('coreImage')(req, res, next);
    }
    next();
  },
  updateById
);
router.delete('/:id', authenticate, deleteById);


module.exports = router;
