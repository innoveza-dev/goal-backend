const Goal = require('../models/Goal');

exports.createGoal = async (req, res) => {
  try {
    const { mainTitle, year, title, points } = req.body;

    const parsedPoints = typeof points === 'string' ? JSON.parse(points) : points;


    const imageFiles = req.files?.map(file => file.filename) || [];
    console.log(imageFiles);
    console.log('req.user:', req.user);
    // console.log('CompanyId from req.user:', req.user);
    console.log('UserId from req.user:', req.user.id);
    const goal = await Goal.create({
      mainTitle,
      year,
      title,
      points: parsedPoints,
      imageURL: imageFiles,
      // companyId: req.user.companyId,
      userId: req.user.userId
    });

    res.status(201).json(goal);
  } catch (err) {
    console.error('Create Goal Error:', err);
    res.status(500).json({
      error: 'Failed to create goal',
      details: err.message || err,
    });
  }
};

exports.getGoals = async (req, res) => {
  try {
    console.log('req.user in getGoals:', req.user);
    const goals = await Goal.findAll({
      // where: { companyId: req.user.companyId },
      where: { userId: req.user.userId },
      order: [['year', 'DESC']]
    });
    res.json(goals);
  } catch (err) {
    console.error('Get Goals Error:', err);
    res.status(500).json({ error: 'Failed to fetch goals', details: err.message });
  }
};

exports.getGoalById = async (req, res) => {
  try {
    const goal = await Goal.findOne({
      where: {
        id: req.params.id,
        // companyId: req.user.companyId
        userId: req.user.userId
      }
    });
    if (!goal) return res.status(404).json({ error: 'Goal not found' });
    res.json(goal);
  } catch (err) {
    console.error('Get Goal By ID Error:', err);
    res.status(500).json({ error: 'Failed to get goal' });
  }
};

exports.updateGoal = async (req, res) => {
  try {
    const { mainTitle, year, title, points } = req.body;
    const parsedPoints = typeof points === 'string' ? JSON.parse(points) : points;
    const imageFiles = req.files?.map(file => file.filename) || [];

    const goal = await Goal.findOne({
      where: {
        id: req.params.id,
        // companyId: req.user.companyId
        userId: req.user.userId
      }
    });

    if (!goal) return res.status(404).json({ error: 'Goal not found' });

    goal.mainTitle = mainTitle;
    goal.year = year;
    goal.title = title;
    goal.points = parsedPoints;

    // Update imageURL only if new images uploaded
    if (imageFiles.length) {
      goal.imageURL = imageFiles;
    }

    await goal.save();
    res.json(goal);
  } catch (err) {
    console.error('Update Goal Error:', err);
    res.status(500).json({ error: 'Failed to update goal' });
  }
};

exports.deleteGoal = async (req, res) => {
  try {
    const goal = await Goal.findOne({
      where: {
        id: req.params.id,
        // companyId: req.user.companyId
        userId: req.user.userId
      }
    });

    if (!goal) return res.status(404).json({ error: 'Goal not found' });

    await goal.destroy();
    res.json({ message: 'Goal deleted successfully' });
  } catch (err) {
    console.error('Delete Goal Error:', err);
    res.status(500).json({ error: 'Failed to delete goal' });
  }
};
