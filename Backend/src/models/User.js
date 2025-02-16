'use strict';
const { Model } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class User extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  User.init({
    middleName: DataTypes.STRING,   
    firstName: DataTypes.STRING,      
    username: DataTypes.STRING,       
    password: DataTypes.STRING,      
    userType: DataTypes.STRING,       
    gender: DataTypes.BOOLEAN,        
    birthDate: DataTypes.DATE,        
    phone: DataTypes.STRING,          
    highSchool: DataTypes.STRING,     
    class: DataTypes.STRING,         
    email: DataTypes.STRING,          
    status: DataTypes.STRING,         
    graduationYear: DataTypes.INTEGER, 
    highSchoolScore: DataTypes.FLOAT, 
    university: DataTypes.STRING,     
    avatarUrl: DataTypes.TEXT,        
    createdAt: DataTypes.DATE,
    updatedAt: DataTypes.DATE
  }, {
    sequelize,
    modelName: 'User',
    tableName: 'user'
  });
  return User;
};
