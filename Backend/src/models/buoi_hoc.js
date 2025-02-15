'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Buoi_hoc extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  Buoi_hoc.init({
    ten: DataTypes.STRING,
    mo_ta: DataTypes.TEXT,
    so_muc_hoc_tap: DataTypes.INTEGER,
    createdAt: DataTypes.DATE,
    updatedAt: DataTypes.DATE
  }, {
    sequelize,
    modelName: 'Buoi_hoc',
    tableName: 'Buoi_hoc'
  });
  return Buoi_hoc;
};