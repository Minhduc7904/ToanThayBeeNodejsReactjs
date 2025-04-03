'use strict';

export default {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.addColumn('class', 'class_code', {
      type: Sequelize.STRING(20),
      allowNull: false,
      unique: true,
    });
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.removeColumn('class', 'class_code');
  }
};
