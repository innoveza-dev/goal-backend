const { Sequelize } = require('sequelize');

const sequelize = new Sequelize('softGoal', 'root', '', {
  host: 'localhost',
  dialect: 'mysql',
  port: 3306,
});

sequelize.authenticate()
  .then(() => console.log("✅ MySQL Database Connected"))
  .catch(err => console.log("❌ Error:", err));

module.exports = { sequelize };
