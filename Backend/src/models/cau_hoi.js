'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Cau_hoi extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  Cau_hoi.init({
    lop: DataTypes.STRING,
    noi_dung: DataTypes.TEXT,
    kieu_cau_hoi: DataTypes.STRING,
    dap_an_dung: DataTypes.STRING,
    do_kho: DataTypes.STRING,
    chuong: DataTypes.STRING,
    mo_ta: DataTypes.TEXT,
    link_chua: DataTypes.TEXT,
    link_anhMH: DataTypes.TEXT,
    createdAt: DataTypes.DATE,
    updatedAt: DataTypes.DATE
  }, {
    sequelize,
    modelName: 'Cau_hoi',
    tableName: 'Cau_hoi'
  });
  return Cau_hoi;
};