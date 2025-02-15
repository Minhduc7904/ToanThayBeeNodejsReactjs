'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class BH_TG extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  BH_TG.init({
    ma_buoi_hoc: {
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true
  },
    ma_tro_giang: {
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true
  },

  }, {
    sequelize,
    modelName: 'BH_TG',
    tableName: 'BH_TG'
  });
  return BH_TG;
};