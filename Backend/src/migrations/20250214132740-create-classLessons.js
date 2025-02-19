'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('classLessons', {
      classId: {
        allowNull: false,
        primaryKey: true,
        type: Sequelize.INTEGER,
        references: {
          model: 'class',
          key: 'id'
        },
        onDelete: "CASCADE"
      },
      lessonId: {
        allowNull: false,
        primaryKey: true,
        type: Sequelize.INTEGER,
        references: {
          model: 'lesson',
          key: 'id'
        },
        onDelete: "CASCADE"
      },
    });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('classLessons');
  }
};