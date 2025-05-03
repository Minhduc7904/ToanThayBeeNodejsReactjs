'use strict'
/** @type {import('sequelize-cli').Migration} */
export default {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('class', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      class_code: {
        allowNull: false,
        type: Sequelize.STRING(20),
        unique: true
      },
      name: {
        allowNull: false,
        type: Sequelize.STRING
      },
      description: {
        type: Sequelize.TEXT
      },
      academicYear: {
        allowNull: false,
        type: Sequelize.STRING,
        references: {
          model: 'allCode', 
          key: 'code'
        },
        onUpdate: 'CASCADE',
      },
      status: {
        allowNull: false,
        type: Sequelize.STRING,
        references: {
          model: 'allCode', 
          key: 'code'
        },
        onUpdate: 'CASCADE',
      },
      slideId: { 
        type: Sequelize.INTEGER,
        references: {
          model: 'slides',
          key: 'id'
        },
        onDelete: 'SET NULL',
      },
      studentCount: {
        type: Sequelize.INTEGER,
        defaultValue: 0
      },
      lessonCount: {
        type: Sequelize.INTEGER,
        defaultValue: 0
      },
      dayOfWeek: {
        type: Sequelize.STRING,
        references: {
          model: 'allCode',
          key: 'code'
        },
        onUpdate: 'CASCADE',
        onDelete: 'SET NULL'
      },
      studyTime: {
        type: Sequelize.STRING,
        references: {
          model: 'allCode',
          key: 'code'
        },
        onUpdate: 'CASCADE',
        onDelete: 'SET NULL'
      },
      public: {
        allowNull: false,
        type: Sequelize.BOOLEAN,
        defaultValue: false
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
    await queryInterface.dropTable('class')
  }
}
