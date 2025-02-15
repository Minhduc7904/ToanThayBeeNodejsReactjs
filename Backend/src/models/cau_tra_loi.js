'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Cau_tra_loi extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  Cau_tra_loi.init({
    ma_lam_bai: DataTypes.INTEGER,
    ma_cau_hoi: DataTypes.INTEGER,
    cau_tra_loi: DataTypes.STRING,
    ket_qua: DataTypes.BOOLEAN,
    createdAt: DataTypes.DATE,
    updatedAt: DataTypes.DATE
  }, {
    sequelize,
    modelName: 'Cau_tra_loi',
    tableName: 'Cau_tra_loi'
  });
  return Cau_tra_loi;
};