'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Luot_lam_bai extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  Luot_lam_bai.init({
    ma_hoc_sinh: {
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true
  },
    ma_de: {
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true
  },
    thoi_gian_lam_bai: DataTypes.DATE,
    thoi_gian_ket_thuc: DataTypes.DATE,
    diem: DataTypes.FLOAT
  }, {
    sequelize,
    modelName: 'Luot_lam_bai',
    tableName: 'Luot_lam_bai'
  });
  return Luot_lam_bai;
};