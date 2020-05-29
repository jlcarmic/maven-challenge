module.exports = {
  up: (queryInterface, Sequelize) => queryInterface.createTable('numbers', {
    number: { type: Sequelize.INTEGER, primaryKey: true },
    times: { type: Sequelize.INTEGER, defaultValue: 1 },
    createdAt: { type: Sequelize.DATE, defaultValue: Sequelize.literal('CURRENT_TIMESTAMP') },
    updatedAt: { type: Sequelize.DATE, defaultValue: Sequelize.literal('CURRENT_TIMESTAMP') },
    deletedAt: { type: Sequelize.DATE },
  }),
  down: (queryInterface) => queryInterface.dropTable('numbers')
}
