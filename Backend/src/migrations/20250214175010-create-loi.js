'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('Lois', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      kieu_loi: {
        allowNull: false,
        type: Sequelize.STRING,
        references: {
          model: 'All_code',
          key: 'code'
        },
        onUpdate: 'CASCADE',
      },
      ma_lam_bai: {
        type: Sequelize.INTEGER,
        references: {
          model: 'Luot_lam_bai',
          key: 'id'
        }
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE,
      },
    });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('Lois');
  }
};