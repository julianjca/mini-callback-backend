const models = require('../models')
const axios = require('axios')
jest.mock('axios')

const { getAll, create } = require('../src/controllers/callbacks')

const callbacks = [
  {
    virtual_account: "1234",
    bank_code: "BANK_ABC",
    timestamp: new Date('2021-02-18T03:13:01.411Z'),
    transaction_id: '123',
    businessId: '2ca01b01-4d0a-4ae4-ac60-56ff0f952d8f',
    id: 'e8980029-04a0-4b9c-8c64-182c8a81cc43',
    callbackResponseCode: 200,
  },
]

axios.get.mockImplementation(() => Promise.resolve({ status: 200 }))

describe('Callback controller', () => {
  it('should retrieve all callbacks', async () => {
    const mock = jest.spyOn(models.Callback, 'findAll').mockResolvedValueOnce(callbacks);
    const mReq = {};
    const mRes = { status: jest.fn().mockReturnThis(), json: jest.fn() };
    await getAll(mReq, mRes);

    expect(mRes.status).toBeCalledWith(200);
    expect(mRes.json).toBeCalledWith({ callbacks });

    mock.mockRestore()
  });
  
  it('should fail getting callbacks when there is an error from database', async () => {
    const mock = jest.spyOn(models.Callback, 'findAll').mockImplementationOnce(() => Promise.reject());
    const mReq = {};
    const mRes = { status: jest.fn().mockReturnThis(), json: jest.fn() };
    await getAll(mReq, mRes);
    
    expect(mRes.status).toBeCalledWith(500);
    expect(mRes.json).toBeCalledWith({
      message: 'Failed getting callbacks.'
    });

    mock.mockRestore()
  });

  it('should return empty array when there is no data from DB', async () => {
    const mock = jest.spyOn(models.Callback, 'findAll').mockResolvedValueOnce([]);
    const mReq = {};
    const mRes = { status: jest.fn().mockReturnThis(), json: jest.fn() };
    await getAll(mReq, mRes);
    
    expect(mRes.status).toBeCalledWith(200);
    expect(mRes.json).toBeCalledWith({
      callbacks: [],
    });

    mock.mockRestore()
  });

  it('should fail to create a callback when there is an error from database', async () => {
    const mock = jest.spyOn(models.Callback, 'create').mockImplementationOnce(() => Promise.reject());
    const businessMock = jest.spyOn(models.Business, 'findOne').mockImplementationOnce(() => Promise.resolve( true ));

    const mReq = { 
      body: {
        "virtual_account": "1234",
        "bank_code": "BANK_JAGO",
        "timestamp": "2021-02-18T03:13:01.411Z",
        "transaction_id": "123",
        "business_id": "2ca01b01-4d0a-4ae4-ac60-56ff0f952d8f"
    }};
    const mRes = { status: jest.fn().mockReturnThis(), json: jest.fn() };
    await create(mReq, mRes);
    
    expect(mRes.status).toBeCalledWith(500);
    expect(mRes.json).toBeCalledWith({
      message: 'Failed creating callback.'
    });

    mock.mockRestore()
    businessMock.mockRestore()
  });

  it('should fail to create a callback when the business_id is invalid.', async () => {
    const mock = jest.spyOn(models.Callback, 'create').mockImplementationOnce(() => Promise.reject());
    const businessMock = jest.spyOn(models.Business, 'findOne').mockImplementationOnce(() => Promise.resolve( false ));

    const mReq = { 
      body: {
        "virtual_account": "1234",
        "bank_code": "BANK_JAGO",
        "timestamp": "2021-02-18T03:13:01.411Z",
        "transaction_id": "123",
        "business_id": "2ca01b01-4d0a-4ae4-ac60-56ff0f952d8f"
    }};

    const mRes = { status: jest.fn().mockReturnThis(), json: jest.fn() };
    await create(mReq, mRes);
    
    expect(mRes.status).toBeCalledWith(400);
    expect(mRes.json).toBeCalledWith({
      message: 'business_id is invalid.'
    });

    mock.mockRestore()
    businessMock.mockRestore()
  });

  it('should create a callback when everything is valid.', async () => {
    const mock = jest.spyOn(models.Callback, 'create').mockImplementationOnce(() => Promise.resolve());
    const businessMock = jest.spyOn(models.Business, 'findOne').mockImplementationOnce(() => Promise.resolve( true ));

    const mReq = { 
      body: {
        "virtual_account": "1234",
        "bank_code": "BANK_JAGO",
        "timestamp": "2021-02-18T03:13:01.411Z",
        "transaction_id": "123",
        "business_id": "2ca01b01-4d0a-4ae4-ac60-56ff0f952d8f"
    }};

    const mRes = { status: jest.fn().mockReturnThis(), json: jest.fn() };
    await create(mReq, mRes);
    
    expect(mRes.status).toBeCalledWith(200);

    mock.mockRestore()
    businessMock.mockRestore()
  });
})

