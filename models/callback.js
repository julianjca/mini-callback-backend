const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Callback extends Model {
    static associate(models) {
      models.Callback.belongsTo(models.Business, { targetKey: 'id', as: 'business'})
    }
  }
  Callback.init({
    virtual_account: DataTypes.STRING,
    bank_code: DataTypes.STRING,
    timestamp: DataTypes.DATE,
    transaction_id: DataTypes.STRING,
    businessId: DataTypes.STRING,
    callbackResponseCode: DataTypes.INTEGER,
  }, {
    sequelize,
    modelName: 'Callback',
  });
  return Callback;
};