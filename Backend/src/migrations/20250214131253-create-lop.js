'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('Lop', {
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
      mo_ta: {
        type: Sequelize.TEXT
      },
      nam_hoc: {
        allowNull: false,
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
      link_image: {
        type: Sequelize.TEXT
      },
      lich_hoc: {
        type: Sequelize.STRING,
        references: {
          model: 'All_code', // tên bảng mà bạn tham chiếu
          key: 'code'         // cột trong bảng All_codes làm khóa chính
        },
        onUpdate: 'CASCADE',
        onDelete: 'SET NULL'
      },
      thoi_gian_hoc: {
        type: Sequelize.STRING,
        references: {
          model: 'All_code', // tên bảng mà bạn tham chiếu
          key: 'code'         // cột trong bảng All_codes làm khóa chính
        },
        onUpdate: 'CASCADE',
        onDelete: 'SET NULL'
      },
      so_buoi_hoc: {
        type: Sequelize.INTEGER,
        defaultValue: 0
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
    await queryInterface.dropTable('Lop');
  }
};