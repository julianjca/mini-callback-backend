const {
  Model
} = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class Business extends Model {
    static associate(models) {
      models.Business.hasMany(models.Callback, {foreignKey: 'businessId', as: 'callbacks'})
    }
  }
  Business.init({
    businessName: DataTypes.STRING,
    businessCallbackUrl: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'Business',
  });
  return Business;
};