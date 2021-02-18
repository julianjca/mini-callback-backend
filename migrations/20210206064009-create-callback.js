module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('Callbacks', {
      id: {
        allowNull: false,
        primaryKey: true,
        type: Sequelize.UUID,
        defaultValue: Sequelize.UUIDV4
      },
      virtual_account: {
        type: Sequelize.STRING
      },
      bank_code: {
        type: Sequelize.STRING
      },
      timestamp: {
        type: Sequelize.DATE
      },
      business_id: {
        type: Sequelize.UUID,
        references: {
          model: 'Businesses',
          key: 'id'
        }
      },
      transaction_id: {
        type: Sequelize.STRING,
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE
      }
    });
  },
  down: async (queryInterface) => {
    await queryInterface.dropTable('Callbacks');
  }
};