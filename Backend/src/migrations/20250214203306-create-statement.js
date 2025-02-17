'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('statement', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      content: {
        allowNull: false,
        type: Sequelize.TEXT
      },
      isCorrect: {
        allowNull: false,
        type: Sequelize.BOOLEAN,
        defaultValue: false
      },
      questionId: {
        allowNull: false,
        type: Sequelize.INTEGER,
        references: {
          model: 'question',
          key: 'id'
        }
      },
      difficulty: {
        type: Sequelize.STRING,
        references: {
          model: 'allCode',
          key: 'code'
        },
        onUpdate: 'CASCADE',
        onDelete: 'SET NULL'
      },
      imageUrl: {
        type: Sequelize.TEXT
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE,
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE,
      }
    });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('statement');
  }
};