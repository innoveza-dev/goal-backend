const VisionMissionCore = require('../models/VisionMissionCore');
const path = require('path');

// ADD VISION (Combined Vision, Mission, Core)
const addVision = async (req, res) => {
  console.log('📥 Received request body:', req.body);
  console.log('📁 Received files:', req.files);

  try {
    const files = req.files || [];
    const { userId, companyId } = req.user;

    // Parse incoming JSON string if sent that way
    let parsedData;
    if (req.body.data) {
      parsedData = JSON.parse(req.body.data);
    } else {
      parsedData = req.body;
    }

    const visionItems = parsedData.vision || [];
    const missionItems = parsedData.mission || [];
    const coreItems = parsedData.core || [];

    // Map file uploads
    const fileMap = {};
    files.forEach((file) => {
      fileMap[file.fieldname] = file.path;
    });

    // Map vision
    const vision = visionItems.map((v) => {
      if (v.visionImageUrl && /^https?:\/\//.test(v.visionImageUrl)) {
        return {
          description: v.description,
          visionImageUrl: v.visionImageUrl,
        };
      }
      if (v.imageUrl && fileMap[v.imageUrl]) {
        return {
          description: v.description,
          visionImageUrl: fileMap[v.imageUrl],
        };
      }
      return {
        description: v.description,
        visionImageUrl: '',
      };
    });

    // Map mission
    const mission = missionItems.map((m) => {
      if (m.missionImageUrl && /^https?:\/\//.test(m.missionImageUrl)) {
        return {
          description: m.description,
          missionImageUrl: m.missionImageUrl,
        };
      }
      if (m.imageUrl && fileMap[m.imageUrl]) {
        return {
          description: m.description,
          missionImageUrl: fileMap[m.imageUrl],
        };
      }
      return {
        description: m.description,
        missionImageUrl: '',
      };
    });

    // Map core
    const newCore = coreItems.map((c) => {
      // Always assign a unique id if not present
      const id = c.id || Date.now().toString() + Math.floor(Math.random()*10000).toString();
      if (c.coreImageUrl && /^https?:\/\//.test(c.coreImageUrl)) {
        return {
          id,
          title: c.title,
          coreImageUrl: c.coreImageUrl,
          description: c.description || '',
        };
      }
      if (c.imageUrl && fileMap[c.imageUrl]) {
        return {
          id,
          title: c.title,
          coreImageUrl: fileMap[c.imageUrl],
          description: c.description || '',
        };
      }
      return {
        id,
        title: c.title,
        coreImageUrl: '',
        description: c.description || '',
      };
    });

    // 🔍 Find existing record
    let existing = await VisionMissionCore.findOne({ userId, companyId });
    
    if (existing) {
      // Ensure existing data is properly parsed as arrays
      let existingVision = [];
      let existingMission = [];
      let existingCore = [];
      
      try {
        existingVision = Array.isArray(existing.vision) 
          ? existing.vision 
          : JSON.parse(existing.vision || '[]');
      } catch (e) {
        console.error('Failed to parse existing vision JSON:', e);
        existingVision = [];
      }
      
      try {
        existingMission = Array.isArray(existing.mission) 
          ? existing.mission 
          : JSON.parse(existing.mission || '[]');
      } catch (e) {
        console.error('Failed to parse existing mission JSON:', e);
        existingMission = [];
      }
      
      try {
        existingCore = Array.isArray(existing.core)
          ? existing.core
          : JSON.parse(existing.core || '[]');
      } catch (e) {
        console.error('Failed to parse existing core JSON:', e);
        existingCore = [];
      }
      
      // Merge: old + new
      const mergedVision = vision.length > 0 ? [...existingVision, ...vision] : existingVision;
      const mergedMission = mission.length > 0 ? [...existingMission, ...mission] : existingMission;
      const mergedCore = [...existingCore, ...newCore];

      existing.vision = mergedVision;
      existing.mission = mergedMission;
      existing.core = mergedCore;

      const updated = await existing.save();

      return res.status(200).json({
        message: 'Vision, Mission, and Core updated successfully',
        data: updated,
      });
    } else {
      // If not found, create a new one
      const created = await VisionMissionCore.create({
        vision,
        mission,
        core: newCore,
        userId,
        companyId,
      });

      return res.status(201).json({
        message: 'Vision, Mission, and Core added successfully',
        data: created,
      });
    }
  } catch (err) {
    console.error('❌ Error in addVision:', err);
    res.status(500).json({ message: 'Error adding vision, mission, and core', error: err.message });
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

// REMOVE the old addCore function if not used elsewhere

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
      coreId, // unique id for core value update
      coreIndex, // index for core value update
      coreDescription,
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

    // Parse existing data safely
    let vision = [];
    let mission = [];
    let core = [];

    try { 
      vision = Array.isArray(record.vision) ? record.vision : JSON.parse(record.vision || '[]'); 
    } catch (e) {
      console.error('Error parsing vision:', e);
      vision = [];
    }
    
    try { 
      mission = Array.isArray(record.mission) ? record.mission : JSON.parse(record.mission || '[]'); 
    } catch (e) {
      console.error('Error parsing mission:', e);
      mission = [];
    }
    
    try { 
      core = Array.isArray(record.core) ? record.core : JSON.parse(record.core || '[]'); 
    } catch (e) {
      console.error('Error parsing core:', e);
      core = [];
    }

    // Default image paths
    let visionImageUrl = vision?.[0]?.visionImageUrl || '';
    let missionImageUrl = mission?.[0]?.missionImageUrl || '';
    let coreImageUrl = core?.[0]?.coreImageUrl || '';

    // Handle uploaded image
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


    // Update or add core value using 'id' or 'coreIndex' as unique key
    let updatedCore = core;
    if (coreTitle && (coreId || coreIndex !== undefined)) {
      // Update existing core value by id or index
      updatedCore = core.map((item, idx) => {
        if ((coreId && item.id === coreId) || (coreIndex !== undefined && idx === Number(coreIndex))) {
          return {
            ...item,
            title: coreTitle,
            coreImageUrl,
            description: coreDescription !== undefined ? coreDescription : item.description,
          };
        }
        return item;
      });
    } else if (coreTitle && !coreId && coreIndex === undefined) {
      // Add new core value (assign a new id if not provided)
      const newId = Date.now().toString();
      const newCoreItem = {
        id: newId,
        title: coreTitle,
        coreImageUrl,
        description: coreDescription || '',
      };
      updatedCore = [...core, newCoreItem];
    }

    const updatePayload = {
      vision: visionDescription
        ? [{
            description: visionDescription,
            visionImageUrl,
          }]
        : record.vision,

      mission: missionDescription
        ? [{
            description: missionDescription,
            missionImageUrl,
          }]
        : record.mission,

      core: updatedCore,
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




// DELETE SPECIFIC ITEM (Vision, Mission, or Core)
const deleteSpecificItem = async (req, res) => {
  try {
    const { userId, companyId } = req.user;
    const { id } = req.params;
    const { type, index } = req.body; // type: 'vision', 'mission', 'core', index: item index to delete

    if (!type || index === undefined) {
      return res.status(400).json({ message: 'Type and index are required' });
    }

    const record = await VisionMissionCore.findOne({
      where: {
        id,
        userId,
        companyId
      }
    });

    if (!record) {
      return res.status(404).json({ message: 'Record not found' });
    }

    // Parse existing data safely
    let vision = [];
    let mission = [];
    let core = [];

    try { 
      vision = Array.isArray(record.vision) ? record.vision : JSON.parse(record.vision || '[]'); 
    } catch (e) {
      console.error('Error parsing vision:', e);
      vision = [];
    }
    
    try { 
      mission = Array.isArray(record.mission) ? record.mission : JSON.parse(record.mission || '[]'); 
    } catch (e) {
      console.error('Error parsing mission:', e);
      mission = [];
    }
    
    try { 
      core = Array.isArray(record.core) ? record.core : JSON.parse(record.core || '[]'); 
    } catch (e) {
      console.error('Error parsing core:', e);
      core = [];
    }

    // Remove specific item based on type and index
    switch (type) {
      case 'vision':
        if (index >= 0 && index < vision.length) {
          vision.splice(index, 1);
        } else {
          return res.status(400).json({ message: 'Invalid vision index' });
        }
        break;
      case 'mission':
        if (index >= 0 && index < mission.length) {
          mission.splice(index, 1);
        } else {
          return res.status(400).json({ message: 'Invalid mission index' });
        }
        break;
      case 'core':
        if (index >= 0 && index < core.length) {
          core.splice(index, 1);
        } else {
          return res.status(400).json({ message: 'Invalid core index' });
        }
        break;
      default:
        return res.status(400).json({ message: 'Invalid type. Must be vision, mission, or core' });
    }

    // Update the record
    await record.update({
      vision,
      mission,
      core
    });

    // If all arrays are empty, delete the entire record
    if (vision.length === 0 && mission.length === 0 && core.length === 0) {
      await record.destroy();
      return res.status(200).json({ message: 'Record completely deleted as all items were removed' });
    }

    const refreshed = await VisionMissionCore.findByPk(id);
    res.status(200).json({ 
      message: `${type.charAt(0).toUpperCase() + type.slice(1)} item deleted successfully`,
      data: refreshed
    });

  } catch (err) {
    console.error('Error deleting specific item:', err);
    res.status(500).json({ message: 'Error deleting item', error: err.message });
  }
};

// DELETE ENTIRE RECORD
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
  getAll,
  getById,
  updateById,
  deleteById,
  deleteSpecificItem
};
