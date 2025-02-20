'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.addColumn('examQuestions', 'order', {
      type: Sequelize.INTEGER,
      allowNull: true,
      comment: 'Thứ tự câu hỏi trong đề thi',
    });
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.removeColumn('examQuestions', 'order');
  },
};