const {
  Model
} = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class User extends Model {
    static associate(models) {
      models.User.belongsTo(models.Business, { targetKey: 'id', as: 'business'})
    }
  }
  User.init({
    name: DataTypes.STRING,
    email: DataTypes.STRING,
    password: DataTypes.STRING,
    businessId: DataTypes.UUID
  }, {
    sequelize,
    modelName: 'User',
  });
  return User;
};