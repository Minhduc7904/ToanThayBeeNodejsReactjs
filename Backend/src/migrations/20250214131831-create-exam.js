'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('exam', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      name: {
        allowNull: false,
        type: Sequelize.STRING
      },
      class: {
        allowNull: false,
        type: Sequelize.STRING
      },
      typeOfExam: {
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
      testDuration: {
        type: Sequelize.INTEGER
      },
      description: {
        type: Sequelize.TEXT
      },
      passRate: {
        type: Sequelize.INTEGER
      },
      solutionUrl: {
        type: Sequelize.TEXT
      },
      imageUrl: {
        type: Sequelize.TEXT
      },
      public: {
        type: Sequelize.BOOLEAN
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
    await queryInterface.dropTable('exam');
  }
};