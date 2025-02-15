'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('Menh_De', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      noi_dung: {
        allowNull: false,
        type: Sequelize.TEXT
      },
      is_correct: {
        allowNull: false,
        type: Sequelize.BOOLEAN
      },
      ma_cau_hoi: {
        allowNull: false,
        type: Sequelize.INTEGER,
        references: {
          model: 'Cau_hoi',
          key: 'id'
        }
      },
      do_kho: {
        type: Sequelize.STRING,
        references: {
          model: 'All_code',
          key: 'code'
        },
        onUpdate: 'CASCADE',
        onDelete: 'SET NULL'
      },
      link_anhMH: {
        type: Sequelize.TEXT
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
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('Menh_De');
  }
};