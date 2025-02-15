'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('Muc_hoc_tap', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      ten: {
        allowNull: false,
        type: Sequelize.STRING
      },
      kieu_muc: {
        type: Sequelize.STRING,
        references: {
          model: 'All_code', // tên bảng mà bạn tham chiếu
          key: 'code'         // cột trong bảng All_codes làm khóa chính
        },
        onUpdate: 'CASCADE',
        onDelete: 'SET NULL'
      },
      link: {
        type: Sequelize.TEXT
      },
      han_thoi_gian: {
        type: Sequelize.DATE
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
    await queryInterface.dropTable('Muc_hoc_tap');
  }
};