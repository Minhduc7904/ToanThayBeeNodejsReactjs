'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('CH_D', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      ma_cau_hoi: {
        allowNull: false,
        type: Sequelize.INTEGER,
        references: {
          model: 'Cau_hoi',
          key: 'id'
        },
      },
      ma_de: {
        allowNull: false,
        type: Sequelize.INTEGER,
        references: {
          model: 'De',
          key: 'id'
        },
      },
    });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('CH_D');
  }
};