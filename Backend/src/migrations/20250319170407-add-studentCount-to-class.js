'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.addColumn('class', 'studentCount', {
      type: Sequelize.INTEGER,
      allowNull: false,
      defaultValue: 0, // ✅ Mặc định là 0
    });
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.removeColumn('class', 'studentCount');
  }
};
