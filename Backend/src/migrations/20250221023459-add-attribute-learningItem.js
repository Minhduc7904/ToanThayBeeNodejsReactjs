'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    // Thêm cột 'day' vào bảng 'lesson'
    await queryInterface.addColumn('lesson', 'day', {
      type: Sequelize.DATE,
      allowNull: false,
    });

    // Thêm cột 'classId' vào bảng 'lesson' và thiết lập khóa ngoại tham chiếu tới 'class'
    await queryInterface.addColumn('lesson', 'classId', {
      type: Sequelize.INTEGER,
      allowNull: false, // Nếu classId là bắt buộc
      references: {
        model: 'class', // Tên bảng được tham chiếu
        key: 'id', // Khóa chính của bảng 'class'
      },
      onDelete: 'CASCADE', // Xóa bài học khi lớp bị xóa (tùy thuộc yêu cầu)
    });
  },

  async down(queryInterface, Sequelize) {
    // Xóa cột 'classId' khỏi bảng 'lesson'
    await queryInterface.removeColumn('lesson', 'classId');

    // Xóa cột 'day' khỏi bảng 'lesson'
    await queryInterface.removeColumn('lesson', 'day');
  },
};
