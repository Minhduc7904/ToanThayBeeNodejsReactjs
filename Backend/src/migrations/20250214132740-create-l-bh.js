'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('L_BH', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      ma_lop: {
        allowNull: false,
        type: Sequelize.INTEGER,
        references: {
          model: 'Lop',
          key: 'id'
        },
      },
      ma_buoi_hoc: {
        allowNull: false,
        type: Sequelize.INTEGER,
        references: {
          model: 'Buoi_hoc',
          key: 'id'
        },
      },
    });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('L_BH');
  }
};