'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  up: async (queryInterface, Sequelize) => {
    // ✅ Đổi tên cột từ middleName thành lastName trong bảng Users
    await queryInterface.renameColumn('user', 'middleName', 'lastName');
  },

  down: async (queryInterface, Sequelize) => {
    // 🔄 Nếu rollback, đổi lại từ lastName về middleName
    await queryInterface.renameColumn('user', 'lastName', 'middleName');
  }
};
