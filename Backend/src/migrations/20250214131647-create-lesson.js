'use strict'
/** @type {import('sequelize-cli').Migration} */
export default {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('lesson', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      name: {
        allowNull: false,
        type: Sequelize.STRING
      },
      description: {
        type: Sequelize.TEXT
      },
      learningItemCount: {
        defaultValue: 0,
        type: Sequelize.INTEGER
      },
      day: {
        type: Sequelize.DATE,
        allowNull: false,
      },
      classId: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'class',
          key: 'id',
        },
        onDelete: 'CASCADE',
      },
      chapter: {
        type: Sequelize.STRING,
        references: {
          model: 'allCode',
          key: 'code'
        },
        onUpdate: 'CASCADE',
        onDelete: 'SET NULL'
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE,
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE,
      }
    })
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('lesson')
  }
}