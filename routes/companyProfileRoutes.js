const express = require('express');
const router = express.Router();

const {
  createCompanyProfile,
  getAllCompanyProfiles,
  getCompanyProfileById,
  updateCompanyProfile,
  deleteCompanyProfile,
} = require('../controller/companyProfileController');

const companyUpload = require('../middleware/companyUpload');
const authMiddleware = require('../middleware/authMiddleware');
const checkRole = require('../middleware/checkRole');

router.post('/', authMiddleware, checkRole('superadmin'), companyUpload.single('logoUrl'), createCompanyProfile);
router.get('/', authMiddleware, checkRole('admin', 'superadmin'), getAllCompanyProfiles);
router.get('/:id', authMiddleware, checkRole('admin', 'superadmin'), getCompanyProfileById);
router.put('/:id', authMiddleware, checkRole('admin', 'superadmin'), companyUpload.single('logoUrl'), updateCompanyProfile);
router.delete('/:id', authMiddleware, checkRole('superadmin'), deleteCompanyProfile);

module.exports = router;
