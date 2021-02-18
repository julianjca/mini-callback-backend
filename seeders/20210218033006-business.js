const businesses = [
  {
    id: '270cd61d-1965-4ed2-bbf3-a91425a030b8',
    businessName: 'Business 1',
    businessCallbackUrl: 'https://webhook.site/600f6bff-d278-4df7-b115-238d882c2223',
    createdAt: new Date(),
    updatedAt: new Date(),
  }, 
  {
    id: 'a6e21744-7aa9-4118-b666-f9c1619bba2d',
    businessName: 'Business 2',
    businessCallbackUrl: 'https://webhook.site/600f6bff-d278-4df7-b115-238d882c2223',
    createdAt: new Date(),
    updatedAt: new Date(),
  }, 
  {
    id: '115fb3ed-c7a2-4a19-8c1d-43b9a13365b1',
    businessName: 'Business 3',
    businessCallbackUrl: 'https://webhook.site/600f6bff-d278-4df7-b115-238d882c2223',
    createdAt: new Date(),
    updatedAt: new Date(),
  },
]

module.exports = {
  up: async (queryInterface) => {
    return queryInterface.bulkInsert('Businesses', businesses);
  },

  down: async (queryInterface) => {
    return queryInterface.bulkDelete('Businesses', businesses);
  }
};
