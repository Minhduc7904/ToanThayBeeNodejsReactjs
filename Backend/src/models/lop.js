'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Lop extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  Lop.init({
    ten: DataTypes.STRING,
    mo_ta: DataTypes.TEXT,
    nam_hoc: DataTypes.STRING,
    trang_thai: DataTypes.STRING,
    link_image: DataTypes.TEXT,
    so_buoi_hoc: DataTypes.INTEGER,
    lich_hoc: DataTypes.STRING,
    Thoi_gian_hoc: DataTypes.STRING,
    createdAt: DataTypes.DATE,
    updatedAt: DataTypes.DATE
  }, {
    sequelize,
    modelName: 'Lop',
    tableName: 'Lop'
  });
  return Lop;
};