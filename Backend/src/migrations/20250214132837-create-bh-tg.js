'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('BH_TG', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      ma_buoi_hoc: {
        allowNull: false,
        type: Sequelize.INTEGER,
        references: {
          model: 'Buoi_hoc',
          key: 'id'
        },
      },
      ma_tro_giang: {
        allowNull: false,
        type: Sequelize.INTEGER,
        references: {
          model: 'Nguoi_dung',
          key: 'id'
        },
      },
    });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('BH_TG');
  }
};