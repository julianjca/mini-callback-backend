const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Business extends Model {
    static associate(models) {
      models.Business.hasMany(models.Callback, {foreignKey: 'business_id', as: 'callbacks'})
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