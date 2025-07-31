const express = require('express');
const router = express.Router();
const upload = require('../middleware/upload');
const goalController = require('../controller/goalController');
const authenticate = require('../middleware/authMiddleware');

router.post('/', authenticate, upload.array('images', 10), goalController.createGoal);
router.get('/', authenticate, goalController.getGoals);
router.get('/:id', authenticate, goalController.getGoalById);
router.put('/:id', authenticate, upload.array('images', 10), goalController.updateGoal);
router.delete('/:id', authenticate, goalController.deleteGoal);
// Delete a single section (sub-goal) by ID (for edit page section delete)
router.delete('/section/:id', authenticate, goalController.deleteGoalSection);

module.exports = router;


// const express = require('express');
// const router = express.Router();
// const upload = require('../middleware/upload');
// const authMiddleware = require('../middleware/authMiddleware');
// const {
//   createGoal,
//   getGoals,
//   getGoalById,
//   updateGoal,
//   deleteGoal,
// } = require('../controller/goalController');

// // ✅ Apply auth middleware to each route
// router.post('/', authMiddleware, upload.array('images', 3), createGoal);
// router.get('/', authMiddleware, getGoals);
// router.get('/:id', authMiddleware, getGoalById);
// router.put('/:id', authMiddleware, upload.array('images', 3), updateGoal);
// router.delete('/:id', authMiddleware, deleteGoal);

// module.exports = router;
