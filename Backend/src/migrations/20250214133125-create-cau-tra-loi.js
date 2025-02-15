'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('Cau_tra_loi', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      ma_lam_bai: {
        allowNull: false,
        type: Sequelize.INTEGER,
        references: {
          model: 'Luot_lam_bai',
          key: 'id'
        },
      },
      ma_cau_hoi: {
        allowNull: false,
        type: Sequelize.INTEGER,
        references: {
          model: 'Cau_hoi',
          key: 'id'
        },
      },
      cau_tra_loi: {
        type: Sequelize.STRING
      },
      ket_qua: {
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
    await queryInterface.dropTable('Cau_tra_loi');
  }
};