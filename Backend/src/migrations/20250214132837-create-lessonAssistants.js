'use strict'
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('lessonAssistants', {
      lessonId: {
        allowNull: false,
        primaryKey: true,
        type: Sequelize.INTEGER,
        references: {
          model: 'lesson',
          key: 'id'
        },
        onDelete: "CASCADE"
      },
      assistantId: {
        allowNull: false,
        primaryKey: true,
        type: Sequelize.INTEGER,
        references: {
          model: 'user',
          key: 'id'
        },
        onDelete: "CASCADE"
      },
    })
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('lessonAssistants')
  }
}