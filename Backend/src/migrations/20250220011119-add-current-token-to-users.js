'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  up: async (queryInterface, Sequelize) => {
    return queryInterface.addColumn('user', 'currentToken', {
      type: Sequelize.TEXT,
      allowNull: true,
      comment: 'Token hiện tại của người dùng, dùng để kiểm soát đăng nhập 1 thiết bị',
    });
  },

  down: async (queryInterface, Sequelize) => {
    return queryInterface.removeColumn('user', 'currentToken');
  },
};
