const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/db');
const User = require('./User'); 

const Goal = sequelize.define('Goal', {
  tableName: 'goals',
  mainTitle: {
    type: DataTypes.STRING,
    allowNull: false
  },
  year: {
    type: DataTypes.STRING,
    allowNull: false
  },
  title: {
    type: DataTypes.STRING,
    allowNull: false
  },
  points: {
    type: DataTypes.JSON,
    allowNull: false
  },
  imageURL: {
    type: DataTypes.JSON,
    allowNull: true,
    defaultValue: []
  },
  // companyId: {
  //   type: DataTypes.INTEGER,
  //   allowNull: false,
  //   references: {
  //     model: 'CompanyProfiles',
  //     key: 'id'
  //   },
  //   onUpdate: 'CASCADE',
  //   onDelete: 'CASCADE'
  // },
  userId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: User, 
      key: 'id'
    },
    onUpdate: 'CASCADE',
    onDelete: 'CASCADE'
  }
});

module.exports = Goal;
