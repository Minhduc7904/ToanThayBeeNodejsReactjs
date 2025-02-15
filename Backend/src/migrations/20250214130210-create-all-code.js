'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('All_code', {
      code: {
        allowNull: false,
        primaryKey: true,
        type: Sequelize.STRING
      },
      kieu: {
        allowNull: false,
        type: Sequelize.STRING
      },
      mo_ta: {
        allowNull: false,
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
    await queryInterface.dropTable('All_code');
  }
};