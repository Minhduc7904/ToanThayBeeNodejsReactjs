'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class De extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  De.init({
    ten: DataTypes.STRING,
    lop: DataTypes.STRING,
    kieu_de: DataTypes.STRING,
    chuong: DataTypes.STRING,
    thoi_gian_lam_bai: DataTypes.INTEGER,
    mo_ta: DataTypes.TEXT,
    ty_le_dat: DataTypes.INTEGER,
    link_chua: DataTypes.TEXT,
    link_anh: DataTypes.TEXT,
    public: DataTypes.BOOLEAN,
    createdAt: DataTypes.DATE,
    updatedAt: DataTypes.DATE
  }, {
    sequelize,
    modelName: 'De',
    tableName: 'De'
  });
  return De;
};