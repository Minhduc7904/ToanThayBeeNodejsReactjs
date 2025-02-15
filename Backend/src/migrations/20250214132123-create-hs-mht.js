'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('Hs_Mht', {
      ma_muc_hoc_tap: {
        primaryKey: true,
        allowNull: false,
        type: Sequelize.INTEGER,
        references: {
          model: 'Muc_hoc_tap',
          key: 'id'
        },
      },
      ma_hoc_sinh: {
        primaryKey: true,
        allowNull: false,
        type: Sequelize.INTEGER,
        references: {
          model: 'Muc_hoc_tap',
          key: 'id'
        },
      },
      da_lam: {
        type: Sequelize.BOOLEAN
      },
      thoi_gian_hoc_bai: {
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
    await queryInterface.dropTable('Hs_Mht');
  }
};