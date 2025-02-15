'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class L_BH extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  L_BH.init({
    ma_lop: {
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true
    },
    ma_buoi_hoc: {
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true
    },
  }, {
    sequelize,
    modelName: 'L_BH',
    tableName: 'L_BH'
  });
  return L_BH;
};