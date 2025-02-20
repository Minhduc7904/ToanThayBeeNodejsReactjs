'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class Cheat extends Model {
    static associate(models) {
      // define association here
    }
  }

  Cheat.init({
    typeOfCheat: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    attemptId: {
      type: DataTypes.INTEGER,
    },
    createdAt: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW, // ✅ Tự động lấy thời gian hiện tại khi thêm dữ liệu
    },
  }, {
    sequelize,
    modelName: 'Cheat',
    tableName: 'cheat',
    timestamps: false, // ✅ Không tự thêm createdAt và updatedAt
  });

  return Cheat;
};
