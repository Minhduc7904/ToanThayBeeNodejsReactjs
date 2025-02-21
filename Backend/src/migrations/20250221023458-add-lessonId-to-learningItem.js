'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    return queryInterface.addColumn('learningItem', 'lessonId', {
      type: Sequelize.INTEGER,
      allowNull: false, // ❓ Nếu muốn không cho phép null thì giữ nguyên, ngược lại sửa thành true
      references: {
        model: 'lesson', // 👉 Tên bảng mà lessonId liên kết (đảm bảo trùng tên trong DB)
        key: 'id',        // 👉 Khóa chính của bảng lessons
      },
      onDelete: 'CASCADE', // Hoặc 'CASCADE', 'RESTRICT' tùy logic của bạn
    });
  },

  async down(queryInterface, Sequelize) {
    return queryInterface.removeColumn('learningItem', 'lessonId');
  },
};
