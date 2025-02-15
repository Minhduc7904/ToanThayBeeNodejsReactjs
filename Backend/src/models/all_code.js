'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class All_code extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  All_code.init({
    code: {
        type: DataTypes.STRING,
        allowNull: false,
        primaryKey: true // ✅ Xác định `code` là khóa chính
    },
    kieu: DataTypes.STRING,
    mo_ta: DataTypes.TEXT,
    createdAt: DataTypes.DATE,
    updatedAt: DataTypes.DATE
  }, {
    sequelize,
    modelName: 'All_code',
    tableName: 'All_code'
  });
  return All_code;
};