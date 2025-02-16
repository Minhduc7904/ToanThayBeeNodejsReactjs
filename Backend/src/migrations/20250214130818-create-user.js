'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('user', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      middleName: {
        allowNull: false,
        type: Sequelize.STRING
      },
      firstName: {
        allowNull: false,
        type: Sequelize.STRING
      },
      username: {
        allowNull: false,
        unique: true,
        type: Sequelize.STRING
      },
      password: {
        allowNull: false,
        type: Sequelize.STRING
      },
      userType: {
        allowNull: false,
        type: Sequelize.STRING,
        references: {
          model: 'allCode', 
          key: 'code'        
        },
        onUpdate: 'CASCADE'
      },
      gender: {
        type: Sequelize.BOOLEAN
      },
      birthDate: {
        type: Sequelize.DATE
      },
      phone: {
        unique: true,
        type: Sequelize.STRING
      },
      highSchool: {
        type: Sequelize.STRING
      },
      class: {
        type: Sequelize.STRING
      },
      email: {
        unique: true,
        type: Sequelize.STRING
      },
      status: {
        type: Sequelize.STRING,
        references: {
          model: 'allCode', 
          key: 'code'       
        },
        onUpdate: 'CASCADE',
        onDelete: 'SET NULL'
      },
      graduationYear: {
        type: Sequelize.INTEGER
      },
      highSchoolScore: {
        type: Sequelize.FLOAT
      },
      university: {
        type: Sequelize.STRING
      },
      avatarUrl: {
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
    await queryInterface.dropTable('user');
  }
};
