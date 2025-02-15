'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class HS_LH extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  HS_LH.init({
    ma_hoc_sinh: {
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true
    },
    ma_lop: {
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true
    },
    trang_thai: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'HS_LH',
  });
  return HS_LH;
};