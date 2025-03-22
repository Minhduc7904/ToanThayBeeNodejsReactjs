'use strict'
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('studentExamStatus', {
      id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        primaryKey: true
      },
      studentId: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'user',
          key: 'id'
        },
        onDelete: 'CASCADE'
      },
      examId: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'exam',
          key: 'id'
        },
        onDelete: 'CASCADE'
      },
      isDone: {
        type: Sequelize.BOOLEAN,
        defaultValue: false
      },
      isSave: {
        type: Sequelize.BOOLEAN,
        defaultValue: false
      },
      completionTime: {
        type: Sequelize.DATE
      },
    })
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('studentExamStatus')
  }
}