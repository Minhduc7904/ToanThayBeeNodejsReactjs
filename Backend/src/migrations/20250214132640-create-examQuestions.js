'use strict'
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('examQuestions', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      questionId: {
        allowNull: false,
        type: Sequelize.INTEGER,
        references: {
          model: 'question',
          key: 'id'
        },
        onDelete: "CASCADE"
      },
      examId: {
        allowNull: false,
        type: Sequelize.INTEGER,
        references: {
          model: 'exam',
          key: 'id'
        },
        onDelete: "CASCADE"
      },
      order: {
        type: Sequelize.INTEGER,
      }
    })
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('examQuestions')
  }
}