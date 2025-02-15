'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('Cau_hoi', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      lop: {
        allowNull: false,
        type: Sequelize.STRING
      },
      noi_dung: {
        allowNull: false,
        type: Sequelize.TEXT
      },
      kieu_cau_hoi: {
        type: Sequelize.STRING,
        references: {
          model: 'All_code', // tên bảng mà bạn tham chiếu
          key: 'code'         // cột trong bảng All_codes làm khóa chính
        },
        onUpdate: 'CASCADE',
        onDelete: 'SET NULL'
      },
      dap_an_dung: {
        type: Sequelize.STRING
      },
      do_kho: {
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
      mo_ta: {
        type: Sequelize.TEXT
      },
      link_chua: {
        type: Sequelize.TEXT
      },
      link_anhMH: {
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
    await queryInterface.dropTable('Cau_hoi');
  }
};