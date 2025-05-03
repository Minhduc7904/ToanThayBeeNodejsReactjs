'use strict';

export default {
  async up(queryInterface, Sequelize) {
    await queryInterface.addColumn('exam', 'acceptDoExam', {
      type: Sequelize.BOOLEAN,
      allowNull: false,
      defaultValue: true,
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.removeColumn('exam', 'acceptDoExam');
  },
};
