const VisionMissionCore = require('../models/VisionMissionCore');
const path = require('path');

// ADD VISION
const addVision = async (req, res) => {

  try {
    const files = req.files || [];
    const { userId, companyId } = req.user;
    console.log(req.user);
    console.log(req.body.data);

    const visions = files.map((file, index) => {
      const visionDescription = req.body[`visionDescription_${index}`] || '';
      return {
        visionDescription,
        visionImageUrl: file.path,
      };
    });

    const savedVision = await VisionMissionCore.create({
      vision: visions,
      userId,
      companyId,
    });

    res.status(201).json({ message: 'Vision added', data: savedVision });
  } catch (err) {
    res.status(500).json({ message: 'Error adding vision', error: err.message });
  }
};

// ADD MISSION
const addMission = async (req, res) => {
  try {
    const files = req.files || [];
    const { userId, companyId } = req.user;

    const missions = files.map((file, index) => {
      const missionDescription = req.body[`missionDescription_${index}`] || '';
      return {
        missionDescription,
        missionImageUrl: file.path,
      };
    });

    const savedMission = await VisionMissionCore.create({
      mission: missions,
      userId,
      companyId,
    });

    res.status(201).json({ message: 'Mission added', data: savedMission });
  } catch (err) {
    res.status(500).json({ message: 'Error adding mission', error: err.message });
  }
};

// ADD CORE
const addCore = async (req, res) => {
  try {
    const files = req.files || [];
    const { userId, companyId } = req.user;

    const cores = files.map((file, index) => {
      const coreTitle = req.body[`coreTitle_${index}`] || '';
      return {
        coreTitle,
        coreImageUrl: file.path,
      };
    });

    const savedCore = await VisionMissionCore.create({
      core: cores,
      userId,
      companyId,
    });

    res.status(201).json({ message: 'Core values added', data: savedCore });
  } catch (err) {
    res.status(500).json({ message: 'Error adding core values', error: err.message });
  }
};

const getAll = async (req, res) => {
  try {                                                                                                                       
    
    const { userId, companyId } = req.user;
    const all = await VisionMissionCore.findAll({
      where: {
        companyId,
        userId,
      },
      order: [['createdAt', 'DESC']]
    });
    res.status(200).json({ message: 'Fetched all records', data: all });
  } catch (err) {
    console.log(' ERROR IN getAll:', err);
    res.status(500).json({ message: 'Error fetching data', error: err.message });
  }
};



// GET BY ID
const getById = async (req, res) => {
  try {
    const { userId, companyId } = req.user;
    const { id } = req.params;
    const record = await VisionMissionCore.findOne({
      where: {
        id,
        userId,
        companyId,
      },
    });
    if (!record) return res.status(404).json({ message: 'Record not found' });

    res.status(200).json({ message: 'Fetched', data: record });
  } catch (err) {
    res.status(500).json({ message: 'Error', error: err.message });
  }
};

const updateById = async (req, res) => {
  console.log('Update Request file:', req.files);
  try {
    const { userId, companyId } = req.user;
    const { id } = req.params;
    const uploadSection = req.headers['upload-section'];
    const body = req.body || {};
    const {
      visionDescription,
      missionDescription,
      coreTitle,
    } = body;

    const record = await VisionMissionCore.findOne({
      where: {
        id,
        userId,
        companyId,
      },
    });
    if (!record) {
      return res.status(404).json({ message: 'Record not found' });
    }

    let vision = record.vision;
    let mission = record.mission;
    let core = record.core;

    if (typeof vision === 'string') {
      try { vision = JSON.parse(vision); } catch (e) { vision = []; }
    }
    if (typeof mission === 'string') {
      try { mission = JSON.parse(mission); } catch (e) { mission = []; }
    }
    if (typeof core === 'string') {
      try { core = JSON.parse(core); } catch (e) { core = []; }
    }

    
    // Step 1: Get existing image URLs
    let visionImageUrl = vision?.[0]?.visionImageUrl || '';
    let missionImageUrl = mission?.[0]?.missionImageUrl || '';
    let coreImageUrl = core?.[0]?.coreImageUrl || '';



    // Step 2: Replace only if a new file is uploaded
    if (req.files && req.files.length > 0) {
      const uploadedPath = req.files[0].path;

      if (uploadSection === 'vision') {
        visionImageUrl = uploadedPath;
      } else if (uploadSection === 'mission') {
        missionImageUrl = uploadedPath;
      } else if (uploadSection === 'core') {
        coreImageUrl = uploadedPath;
      }
    }


    // Step 3: Build update payload
    const updatePayload = {
      vision: visionDescription
        ? [{ visionDescription, visionImageUrl }]
        : record.vision,

      mission: missionDescription
        ? [{ missionDescription, missionImageUrl }]
        : record.mission,

      core: coreTitle
        ? [{ coreTitle, coreImageUrl }]
        : record.core,
    };

    await record.update(updatePayload);

    const refreshed = await VisionMissionCore.findByPk(id);
    return res.status(200).json({
      message: 'Updated successfully ✅',
      data: refreshed,
    });

  } catch (err) {
    console.error('Update Error:', err);
    res.status(500).json({ message: 'Error updating', error: err.message });
  }
};


// DELETE
const deleteById = async (req, res) => {
  try {
    const { userId, companyId } = req.user;
    const { id } = req.params;
    const record = await VisionMissionCore.findOne({
      where: {
        id,
        userId,
        companyId
      }
    });
    if (!record) return res.status(404).json({ message: 'Not found' });

    await record.destroy();
    res.status(200).json({ message: 'Deleted successfully' });
  } catch (err) {
    res.status(500).json({ message: 'Error deleting', error: err.message });
  }
};

module.exports = {
  addVision,
  addMission,
  addCore,
  getAll,
  getById,
  updateById,
  deleteById
};
