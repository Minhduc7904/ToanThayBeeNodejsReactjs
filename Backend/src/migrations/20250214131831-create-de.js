'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('De', {
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
      lop: {
        allowNull: false,
        type: Sequelize.STRING
      },
      kieu_de: {
        type: Sequelize.STRING,
        references: {
          model: 'All_code', // tên bảng mà bạn tham chiếu
          key: 'code'         // cột trong bảng All_codes làm khóa chính
        },
        onUpdate: 'CASCADE',
        onDelete: 'SET NULL'
      },
      chuong: {
        type: Sequelize.STRING,
        references: {
          model: 'All_code', // tên bảng mà bạn tham chiếu
          key: 'code'         // cột trong bảng All_codes làm khóa chính
        },
        onUpdate: 'CASCADE',
        onDelete: 'SET NULL'
      },
      thoi_gian_lam_bai: {
        type: Sequelize.INTEGER
      },
      mo_ta: {
        type: Sequelize.TEXT
      },
      ty_le_dat: {
        type: Sequelize.INTEGER
      },
      link_chua: {
        type: Sequelize.TEXT
      },
      link_anh: {
        type: Sequelize.TEXT
      },
      public: {
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
    await queryInterface.dropTable('De');
  }
};