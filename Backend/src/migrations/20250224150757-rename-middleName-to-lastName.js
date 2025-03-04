'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  up: async (queryInterface, Sequelize) => {
    // ✅ Đổi tên cột từ lastName thành lastName trong bảng Users
    await queryInterface.renameColumn('user', 'lastName', 'lastName');
  },

  down: async (queryInterface, Sequelize) => {
    // 🔄 Nếu rollback, đổi lại từ lastName về lastName
    await queryInterface.renameColumn('user', 'lastName', 'lastName');
  }
};
