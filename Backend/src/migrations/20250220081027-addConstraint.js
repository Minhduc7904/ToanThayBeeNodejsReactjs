'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.addConstraint('class', {
      fields: ['academicYear'],
      type: 'foreign key',
      name: 'fk_academic_year',
      references: {
        table: 'allCode',
        field: 'code',
      },
      onUpdate: 'CASCADE',
    });
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.removeConstraint('class', 'fk_academic_year');
  },
};
