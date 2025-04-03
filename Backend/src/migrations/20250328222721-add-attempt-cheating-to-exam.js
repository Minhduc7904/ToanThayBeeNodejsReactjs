'use strict';

export default {
  async up(queryInterface, Sequelize) {
    await queryInterface.addColumn('exam', 'attemptLimit', {
      type: Sequelize.INTEGER,
      allowNull: true,
      defaultValue: 1,
      comment: 'Số lần học sinh được phép làm bài'
    });

    await queryInterface.addColumn('exam', 'isCheatingCheckEnabled', {
      type: Sequelize.BOOLEAN,
      allowNull: false,
      defaultValue: false,
      comment: 'Có bật kiểm tra gian lận hay không'
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.removeColumn('exam', 'attemptLimit');
    await queryInterface.removeColumn('exam', 'isCheatingCheckEnabled');
  }
};
