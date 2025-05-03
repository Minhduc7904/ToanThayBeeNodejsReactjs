'use strict';

export default {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('article', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER,
      },
      name: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      type: {
        type: Sequelize.STRING,
        allowNull: false,
        references: {
          model: 'allCode',
          key: 'code',
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE',
      },
      class: {
        type: Sequelize.STRING,
        references: {
          model: 'allCode',
          key: 'code',
        },
        onUpdate: 'CASCADE',
        onDelete: 'SET NULL',
      },
      chapter: {
        type: Sequelize.STRING,
        references: {
          model: 'allCode',
          key: 'code',
        },
        onUpdate: 'CASCADE',
        onDelete: 'SET NULL',
      },
      title: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      content: {
        type: Sequelize.TEXT('long'), // dùng 'long' nếu muốn lưu nội dung dài
        allowNull: false,
      },
      author: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE,
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE,
      }
    });
  },

  down: async (queryInterface) => {
    await queryInterface.dropTable('article');
  },
};
