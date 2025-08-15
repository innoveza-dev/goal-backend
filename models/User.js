// models/User.js
const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/db');

const User = sequelize.define('User', {
  tableName: 'users',
  companyName: { type: DataTypes.STRING, allowNull: false },  
  firstName: { type: DataTypes.STRING, allowNull: false },
  lastName: { type: DataTypes.STRING, allowNull: false },
  email: { type: DataTypes.STRING, allowNull: false, unique: true },
  mobile: { type: DataTypes.STRING, allowNull: false },
  password: { type: DataTypes.STRING, allowNull: false },
  confirmPassword: { type: DataTypes.STRING, allowNull: false },
  photo: { type: DataTypes.STRING, allowNull: true },
  gender: { type: DataTypes.ENUM('male', 'female', 'other'), allowNull: true },
  dateOfBirth: { type: DataTypes.DATEONLY, allowNull: true },
  anniversaryDate: { type: DataTypes.DATEONLY, allowNull: true },
  role: { type: DataTypes.ENUM('admin', 'superadmin'), allowNull: false, defaultValue: 'admin' },
}, {
  timestamps: true,
});

module.exports = User;
