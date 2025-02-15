'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('Nguoi_dung', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      ho_ten_dem: {
        allowNull: false,
        type: Sequelize.STRING
      },
      ten: {
        allowNull: false,
        type: Sequelize.STRING
      },
      tai_khoan: {
        allowNull: false,
        unique: true,
        type: Sequelize.STRING
      },
      mat_khau: {
        allowNull: false,
        type: Sequelize.STRING
      },
      kieu_nguoi_dung: {
        allowNull: false,
        type: Sequelize.STRING,
        references: {
          model: 'All_code', // tên bảng mà bạn tham chiếu
          key: 'code'         // cột trong bảng All_codes làm khóa chính
        },
        onUpdate: 'CASCADE',
      },
      gioi_tinh: {
        type: Sequelize.BOOLEAN
      },
      ngay_sinh: {
        type: Sequelize.DATE
      },
      sdt: {
        unique: true,
        type: Sequelize.STRING
      },
      truong_c3: {
        type: Sequelize.STRING
      },
      lop: {
        type: Sequelize.STRING
      },
      email: {
        unique: true,
        type: Sequelize.STRING
      },
      trang_thai: {
        type: Sequelize.STRING,
        references: {
          model: 'All_code', // tên bảng mà bạn tham chiếu
          key: 'code'         // cột trong bảng All_codes làm khóa chính
        },
        onUpdate: 'CASCADE',
        onDelete: 'SET NULL'
      },
      nam_tot_nghiep: {
        type: Sequelize.INTEGER
      },
      diem_thi_thpt: {
        type: Sequelize.FLOAT
      },
      dai_hoc: {
        type: Sequelize.STRING
      },
      link_avartar: {
        type: Sequelize.TEXT
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
    await queryInterface.dropTable('Nguoi_dung');
  }
};