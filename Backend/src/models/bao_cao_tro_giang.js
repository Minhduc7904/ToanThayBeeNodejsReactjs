'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Bao_cao_tro_giang extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  Bao_cao_tro_giang.init({
    ma_nguoi_dung: DataTypes.INTEGER,
    ma_tro_giang: DataTypes.INTEGER,
    noi_dung: DataTypes.TEXT,
    star: DataTypes.INTEGER,
    createdAt: DataTypes.DATE,
  }, {
    sequelize,
    modelName: 'Bao_cao_tro_giang',
    tableName: 'Bao_cao_tro_giang'
  });
  return Bao_cao_tro_giang;
};