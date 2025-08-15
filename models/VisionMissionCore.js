const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/db');

const VisionMissionCore = sequelize.define('VisionMissionCore', {
  tableName: 'visionmissioncores',
  userId: {
    type: DataTypes.INTEGER,
    allowNull: true,
    references: {
      model: 'Users',
      key: 'id',
    },
  },
  companyId: {
    type: DataTypes.INTEGER,
    allowNull: true,
    references: {
      model: 'CompanyProfiles', 
      key: 'id',
    },
  },
   vmc: {
    type: DataTypes.JSON,
    allowNull: true,
  },
    vision: {
    type: DataTypes.JSON,
    allowNull: true,
  },
  mission: {
    type: DataTypes.JSON,
    allowNull: true,
  },
  core: {
    type: DataTypes.JSON,
    allowNull: true,
  },
}, {
  timestamps: true,
});

module.exports = VisionMissionCore;
