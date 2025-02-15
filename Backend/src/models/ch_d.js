'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class CH_D extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  CH_D.init({
    ma_cau_hoi: {
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true
    },
    ma_de: {
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true
    },
  }, {
    sequelize,
    modelName: 'CH_D',
    tableName: 'CH_D'
  });
  return CH_D;
};