'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Hs_Mht extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  Hs_Mht.init({
    ma_muc_hoc_tap: {
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true
    },
    ma_hoc_sinh: {
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true
    },
    da_lam: DataTypes.BOOLEAN,
    thoi_gian_hoc_bai: DataTypes.DATE
  }, {
    sequelize,
    modelName: 'Hs_Mht',
    tableName: 'Hs_Mht'
  });
  return Hs_Mht;
};