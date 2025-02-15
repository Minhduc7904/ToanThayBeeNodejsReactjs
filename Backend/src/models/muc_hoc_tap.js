'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Muc_hoc_tap extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  Muc_hoc_tap.init({
    ten: DataTypes.STRING,
    kieu_muc: DataTypes.STRING,
    link: DataTypes.TEXT,
    han_thoi_gian: DataTypes.DATE,
    createdAt: DataTypes.DATE,
    updatedAt: DataTypes.DATE
  }, {
    sequelize,
    modelName: 'Muc_hoc_tap',
    tableName: 'Muc_hoc_tap'
  });
  return Muc_hoc_tap;
};