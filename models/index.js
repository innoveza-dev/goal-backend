const User = require('./User');
const CompanyProfile = require('./CompanyProfile');
const VisionMissionCore = require('./VisionMissionCore');
const Goal = require('./Goal');

// User → CompanyProfile (1:1)
User.hasOne(CompanyProfile, { foreignKey: 'userId', as: 'companyProfile' });
CompanyProfile.belongsTo(User, { foreignKey: 'userId', as: 'user' });

// User → Goal (1:M)
User.hasMany(Goal, { foreignKey: 'userId', as: 'goals' });
Goal.belongsTo(User, { foreignKey: 'userId', as: 'user' });

// CompanyProfile → Goal (1:M)
// CompanyProfile.hasMany(Goal, { foreignKey: 'companyId' });
// Goal.belongsTo(CompanyProfile, { foreignKey: 'companyId' });


module.exports = { User, CompanyProfile, VisionMissionCore, Goal };
