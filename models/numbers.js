module.exports = (connection, Sequelize) => connection.define('numbers', {
  number: { type: Sequelize.INTEGER, primaryKey: true },
  times: { type: Sequelize.INTEGER, defaultValue: 1 },
}, { paranoid: true })
