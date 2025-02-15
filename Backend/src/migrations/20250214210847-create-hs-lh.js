'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('HS_LHs', {
      ma_hoc_sinh: {
        allowNull: false,
        primaryKey: true,
        type: Sequelize.INTEGER,
        references: {
          model: 'Nguoi_dung',
          key: 'id'
        },
      },
      ma_lop: {
        allowNull: false,
        primaryKey: true,
        type: Sequelize.INTEGER,
        references: {
          model: 'Lop',
          key: 'id'
        },
      },
      trang_thai: {
        type: Sequelize.STRING,
        references: {
          model: 'All_code',
          key: 'code'
        },
      },
    });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('HS_LHs');
  }
};