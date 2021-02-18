const models = require('../models')

const { getAll, create, update } = require('../src/controllers/businesses')

const businesses = [
  {
    "id": "270cd61d-1965-4ed2-bbf3-a91425a030b8",
    "businessName": "Business 1",
    "businessCallbackUrl": "https://webhook.site/600f6bff-d278-4df7-b115-238d882c2223",
    "createdAt": "2021-02-18T03:45:35.342Z",
    "updatedAt": "2021-02-18T03:45:35.342Z"
  },
]


describe('Business controller', () => {
  it('should retrieve all businesses', async () => {
    const mock = jest.spyOn(models.Business, 'findAll').mockResolvedValueOnce(businesses);
    const mReq = {};
    const mRes = { status: jest.fn().mockReturnThis(), json: jest.fn() };
    await getAll(mReq, mRes);

    expect(mRes.status).toBeCalledWith(200);
    expect(mRes.json).toBeCalledWith({ businesses });

    mock.mockRestore()
  });
  
  it('should fail getting businesses when there is an error from database', async () => {
    const mock = jest.spyOn(models.Business, 'findAll').mockImplementationOnce(() => Promise.reject());
    const mReq = {};
    const mRes = { status: jest.fn().mockReturnThis(), json: jest.fn() };
    await getAll(mReq, mRes);
    
    expect(mRes.status).toBeCalledWith(500);
    expect(mRes.json).toBeCalledWith({
      message: 'Failed getting businesses.'
    });

    mock.mockRestore()
  });

  it('should return empty array when there is no data from DB', async () => {
    const mock = jest.spyOn(models.Business, 'findAll').mockResolvedValueOnce([]);
    const mReq = {};
    const mRes = { status: jest.fn().mockReturnThis(), json: jest.fn() };
    await getAll(mReq, mRes);
    
    expect(mRes.status).toBeCalledWith(200);
    expect(mRes.json).toBeCalledWith({
      businesses: [],
    });

    mock.mockRestore()
  });

  it('should fail to create a business when there is an error from database', async () => {
    const mock = jest.spyOn(models.Business, 'create').mockImplementationOnce(() => Promise.reject());

    const mReq = { 
      body: {
        "id": "270cd61d-1965-4ed2-bbf3-a91425a030b8",
        "businessName": "Business 1",
        "businessCallbackUrl": "https://webhook.site/600f6bff-d278-4df7-b115-238d882c2223",
      }};
    const mRes = { status: jest.fn().mockReturnThis(), json: jest.fn() };
    await create(mReq, mRes);
    
    expect(mRes.status).toBeCalledWith(500);
    expect(mRes.json).toBeCalledWith({
      message: 'Failed creating business.'
    });

    mock.mockRestore()
  });

  it('should create a business when everything is valid.', async () => {
    const mock = jest.spyOn(models.Business, 'create').mockImplementationOnce(() => Promise.resolve());

    const mReq = { 
      body: {
        "id": "270cd61d-1965-4ed2-bbf3-a91425a030b8",
        "businessName": "Business 1",
        "businessCallbackUrl": "https://webhook.site/600f6bff-d278-4df7-b115-238d882c2223",
      }};

    const mRes = { status: jest.fn().mockReturnThis(), json: jest.fn() };
    await create(mReq, mRes);
    
    expect(mRes.status).toBeCalledWith(200);

    mock.mockRestore()
  });

  it('should update a business when everything is valid.', async () => {
    const mock = jest.spyOn(models.Business, 'update').mockImplementationOnce(() => Promise.resolve());

    const mReq = { 
      body: {
        "id": "270cd61d-1965-4ed2-bbf3-a91425a030b8",
        "businessName": "Business 1",
        "businessCallbackUrl": "https://webhook.site/600f6bff-d278-4df7-b115-238d882c2223",
      },
      params: {
        id: '270cd61d-1965-4ed2-bbf3-a91425a030b8'
      }
    };

    const mRes = { status: jest.fn().mockReturnThis(), json: jest.fn() };
    await update(mReq, mRes);
    
    expect(mRes.status).toBeCalledWith(200);

    mock.mockRestore()
  });

  it('should failed to update a business when everything is valid.', async () => {
    const mock = jest.spyOn(models.Business, 'update').mockImplementationOnce(() => Promise.reject());

    const mReq = { 
      body: {
        "id": "270cd61d-1965-4ed2-bbf3-a91425a030b8",
        "businessName": "Business 1",
        "businessCallbackUrl": "https://webhook.site/600f6bff-d278-4df7-b115-238d882c2223",
      },
      params: {
        id: '270cd61d-1965-4ed2-bbf3-a91425a030b8'
      }
    };

    const mRes = { status: jest.fn().mockReturnThis(), json: jest.fn() };
    await update(mReq, mRes);
    
    expect(mRes.status).toBeCalledWith(500);

    mock.mockRestore()
  });
})

