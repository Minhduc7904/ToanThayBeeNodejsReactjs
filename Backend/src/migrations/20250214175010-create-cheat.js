'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('cheat', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      typeOfCheat: {
        allowNull: false,
        type: Sequelize.STRING,
        references: {
          model: 'allCode',
          key: 'code'
        },
        onUpdate: 'CASCADE',
      },
      attemptId: {
        type: Sequelize.INTEGER,
        references: {
          model: 'studentExamAttempt',
          key: 'id'
        },
        onDelete: "CASCADE"
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE,
        defaultValue: Sequelize.NOW, // ✅ Thêm dòng này để tự động lấy thời gian hiện tại
      },
    }, { timestamps: false });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('cheat');
  }
};
