const callbacks = [
  {
    virtual_account: "1234",
    bank_code: "BANK_ABC",
    timestamp: new Date('2021-02-18T03:13:01.411Z'),
    transaction_id: '123',
    businessId: '270cd61d-1965-4ed2-bbf3-a91425a030b8',
    id: 'e8980029-04a0-4b9c-8c64-182c8a81cc43',
    callbackResponseCode: 200,
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    virtual_account: "1234",
    bank_code: "BANK_ABC",
    timestamp: new Date('2021-02-18T03:13:01.411Z'),
    transaction_id: '123',
    businessId: 'a6e21744-7aa9-4118-b666-f9c1619bba2d',
    id: 'a53d7e25-1eb9-4e15-88ac-19e9d78101a1',
    callbackResponseCode: 200,
    createdAt: new Date(),
    updatedAt: new Date(),
  }
]

module.exports = {
  up: async (queryInterface) => {
    return queryInterface.bulkInsert('Callbacks', callbacks);
  },

  down: async (queryInterface) => {
    return queryInterface.bulkDelete('Callbacks', callbacks);
  }
};
