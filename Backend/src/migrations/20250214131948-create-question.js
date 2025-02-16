'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('question', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      class: {
        allowNull: false,
        type: Sequelize.STRING
      },
      content: {
        allowNull: false,
        type: Sequelize.TEXT
      },
      typeOfQuestion: {
        type: Sequelize.STRING,
        references: {
          model: 'allCode', 
          key: 'code'         
        },
        onUpdate: 'CASCADE',
        onDelete: 'SET NULL'
      },
      correctAnswer: {
        type: Sequelize.STRING
      },
      difficult: {
        type: Sequelize.STRING,
        references: {
          model: 'allCode', 
          key: 'code'        
        },
        onUpdate: 'CASCADE',
        onDelete: 'SET NULL'
      },
      chapter: {
        type: Sequelize.STRING,
        references: {
          model: 'allCode', 
          key: 'code'         
        },
        onUpdate: 'CASCADE',
        onDelete: 'SET NULL'
      },
      description: {
        type: Sequelize.TEXT
      },
      solutionUrl: {
        type: Sequelize.TEXT
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
    await queryInterface.dropTable('question');
  }
};