const request = require('supertest')
const axios = require('axios')

const app = require('../app')
const models = require('../models')

jest.mock('axios')

const callback = {
  virtual_account: "1234",
  bank_code: "BANK_ABC",
  timestamp: new Date('2021-02-18T03:13:01.411Z'),
  transaction_id: '123',
  businessId: '2ca01b01-4d0a-4ae4-ac60-56ff0f952d8f',
  id: 'e8980029-04a0-4b9c-8c64-182c8a81cc43',
  callbackResponseCode: 200,
}

const business = {
  id: '2ca01b01-4d0a-4ae4-ac60-56ff0f952d8f',
  businessName: 'Test',
  businessCallbackUrl: 'https://google.com'
}

const body = {
  "virtual_account": "1234",
  "bank_code": "BANK_JAGO",
  "timestamp": "2021-02-18T03:13:01.411Z",
  "transaction_id": "123",
  "business_id": "2ca01b01-4d0a-4ae4-ac60-56ff0f952d8f"
}

afterAll(async () => {
	await new Promise(resolve => setTimeout(() => resolve(), 500)); // avoid jest open handle error
});

describe('Main API is working', () => {
  it('Should return API is ready', async () => {
    const res = await request(app).get('/')
    expect(res.statusCode).toEqual(200)
    expect(res.body.text).toEqual('API ready')
  })
})

describe('Callbacks API', () => {
  beforeAll(async () => {
    await models.Business.create(business)
    await models.Callback.create(callback)

  });

  afterAll(async () => {
    // wipe db
    await models.Callback.destroy({
      where: {},
      truncate: true
    })

    await models.Business.destroy({
      where: {
        id: business.id,
      },
    })
  })

  it('Should return empty array when there is no data', async () => {
    const res = await request(app).get('/callbacks')
    expect(res.statusCode).toEqual(200)
    expect(res.body.callbacks[0].bank_code).toEqual('BANK_ABC')
    expect(res.body.callbacks[0].businessId).toEqual('2ca01b01-4d0a-4ae4-ac60-56ff0f952d8f')
    expect(res.body.callbacks[0].id).toEqual('e8980029-04a0-4b9c-8c64-182c8a81cc43')
    expect(res.body.callbacks[0].timestamp).toEqual('2021-02-18T03:13:01.411Z')
    expect(res.body.callbacks[0].transaction_id).toEqual('123')
    expect(res.body.callbacks[0].virtual_account).toEqual('1234')
    expect(res.body.callbacks[0].callbackResponseCode).toEqual(200)
  })

  it('Should return be able to create callback', async () => {
    axios.get.mockImplementation(() => Promise.resolve({
      data: [],
      status: 200,
    }))
    const res = await request(app).post('/callbacks').send(body)
    expect(res.statusCode).toEqual(200)
    expect(res.body.callback.bank_code).toEqual(body.bank_code)
    expect(res.body.callback.businessId).toEqual(body.business_id)
    expect(res.body.callback.timestamp).toEqual(body.timestamp)
    expect(res.body.callback.transaction_id).toEqual(body.transaction_id)
    expect(res.body.callback.virtual_account).toEqual(body.virtual_account)
    expect(res.body.callback.callbackResponseCode).toEqual(200)
  })

  it('Should failed to create callback when business_id is invalid', async () => {
    axios.get.mockImplementation(() => Promise.resolve({
      data: [],
      status: 200,
    }))
    const res = await request(app).post('/callbacks').send({...body, business_id: 'e6a1f0e6-af5b-45bf-997b-3e8d41916597'})
    expect(res.statusCode).toEqual(400)
    expect(res.body.message).toEqual('business_id is invalid.')
  })

  it('Should create a callback with callbackResponseCode 400', async () => {
    axios.get.mockImplementation(() => Promise.resolve({
      data: [],
      status: 400,
    }))

    const res = await request(app).post('/callbacks').send(body)
    expect(res.statusCode).toEqual(200)
    expect(res.body.callback.bank_code).toEqual(body.bank_code)
    expect(res.body.callback.businessId).toEqual(body.business_id)
    expect(res.body.callback.timestamp).toEqual(body.timestamp)
    expect(res.body.callback.transaction_id).toEqual(body.transaction_id)
    expect(res.body.callback.virtual_account).toEqual(body.virtual_account)
    expect(res.body.callback.callbackResponseCode).toEqual(400)
  })
})

