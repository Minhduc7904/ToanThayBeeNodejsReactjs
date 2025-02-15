'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('Luot_lam_bai', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      ma_hoc_sinh: {
        allowNull: false,
        type: Sequelize.INTEGER,
        references: {
          model: 'Nguoi_dung',
          key: 'id'
        },
      },
      ma_de: {
        allowNull: false,
        type: Sequelize.INTEGER,
        references: {
          model: 'De',
          key: 'id'
        },
      },
      thoi_gian_lam_bai: {
        allowNull: false,
        type: Sequelize.DATE,
        defaultValue: Sequelize.NOW
      },
      thoi_gian_ket_thuc: {
        type: Sequelize.DATE
      },
      diem: {
        type: Sequelize.FLOAT
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE,
      }
    });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('Luot_lam_bai');
  }
};