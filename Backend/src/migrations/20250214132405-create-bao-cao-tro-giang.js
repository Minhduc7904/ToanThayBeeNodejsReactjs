'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('Bao_cao_tro_giang', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      ma_nguoi_dung: {
        allowNull: false,
        type: Sequelize.INTEGER,
        references: {
          model: 'Nguoi_dung',
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
      noi_dung: {
        allowNull: false,
        type: Sequelize.TEXT
      },
      star: {
        allowNull: false,
        type: Sequelize.INTEGER
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
    await queryInterface.dropTable('Bao_cao_tro_giang');
  }
};