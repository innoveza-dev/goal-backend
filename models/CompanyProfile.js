const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/db');

const CompanyProfile = sequelize.define('CompanyProfile', {
  userId: {
    type: DataTypes.INTEGER,
    allowNull: true,
    references: {
      model: 'Users',
      key: 'id',
    }
  },
  logoUrl: { type: DataTypes.STRING, allowNull: true },
  companyName: { type: DataTypes.STRING, allowNull: false, unique: true },
  emailId: { type: DataTypes.STRING, allowNull: true },
  password: { type: DataTypes.STRING, allowNull: true },
  website: { type: DataTypes.STRING, allowNull: true, validate: { isUrl: true } },
  companyType: { type: DataTypes.STRING, allowNull: true },
  mobileNumber: { type: DataTypes.STRING, allowNull: true },
  whatsappNumber: { type: DataTypes.STRING, allowNull: true },
  address: { type: DataTypes.STRING, allowNull: true },
  state: { type: DataTypes.STRING, allowNull: true },
  city: { type: DataTypes.STRING, allowNull: true },
  nation: { type: DataTypes.STRING, allowNull: true },
  pincode: { type: DataTypes.STRING, allowNull: true },
  aboutCompany: { type: DataTypes.TEXT, allowNull: true, validate: { len: [0, 600] } },
  socialYahoo: { type: DataTypes.STRING, allowNull: true, validate: { isUrl: true } },
  socialFacebook: { type: DataTypes.STRING, allowNull: true, validate: { isUrl: true } },
  socialInstagram: { type: DataTypes.STRING, allowNull: true, validate: { isUrl: true } },
  socialTwitter: { type: DataTypes.STRING, allowNull: true, validate: { isUrl: true } },
  socialYoutube: { type: DataTypes.STRING, allowNull: true, validate: { isUrl: true } },
}, {
  tableName: 'companyprofiles',
  timestamps: true,
});

module.exports = CompanyProfile;
