'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Nguoi_dung extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  Nguoi_dung.init({
    ho_ten_dem: DataTypes.STRING,
    ten: DataTypes.STRING,
    tai_khoan: DataTypes.STRING,
    mat_khau: DataTypes.STRING,
    kieu_nguoi_dung: DataTypes.STRING,
    gioi_tinh: DataTypes.BOOLEAN,
    ngay_sinh: DataTypes.DATE,
    sdt: DataTypes.STRING,
    truong_c3: DataTypes.STRING,
    lop: DataTypes.STRING,
    email: DataTypes.STRING,
    trang_thai: DataTypes.STRING,
    nam_tot_nghiep: DataTypes.INTEGER,
    diem_thi_thpt: DataTypes.FLOAT,
    dai_hoc: DataTypes.STRING,
    link_avartar: DataTypes.TEXT,
    createdAt: DataTypes.DATE,
    updatedAt: DataTypes.DATE
  }, {
    sequelize,
    modelName: 'Nguoi_dung',
    tableName: 'Nguoi_dung'
  });
  return Nguoi_dung;
};