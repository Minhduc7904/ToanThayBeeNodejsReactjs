'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Bao_cao_cau_hoi extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  Bao_cao_cau_hoi.init({
    ma_nguoi_dung: DataTypes.INTEGER,
    ma_cau_hoi: DataTypes.INTEGER,
    noi_dung: DataTypes.TEXT,
    createdAt: DataTypes.DATE,
  }, {
    sequelize,
    modelName: 'Bao_cao_cau_hoi',
    tableName: 'Bao_cao_cau_hoi'
  });
  return Bao_cao_cau_hoi;
};