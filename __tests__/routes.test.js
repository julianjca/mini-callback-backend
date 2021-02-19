const request = require('supertest')
const axios = require('axios')

const app = require('../app')
const models = require('../models')
jest.mock('../src/middlewares/auth', () => jest.fn((req, res, next) => next()));

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

const businessBody = {
  businessName: 'Test',
  businessCallbackUrl: 'https://google.com'
}

const userBody = {
  "name": "John",
  "email": "john@mail.com",
  "password": "password",
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
  it('Should return all callbacks', async () => {
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

  it('Should return callback by id', async () => {
    const res = await request(app).get('/callbacks/e8980029-04a0-4b9c-8c64-182c8a81cc43')
    expect(res.statusCode).toEqual(200)

    expect(res.body.bank_code).toEqual('BANK_ABC')
    expect(res.body.businessId).toEqual('2ca01b01-4d0a-4ae4-ac60-56ff0f952d8f')
    expect(res.body.id).toEqual('e8980029-04a0-4b9c-8c64-182c8a81cc43')
    expect(res.body.timestamp).toEqual('2021-02-18T03:13:01.411Z')
    expect(res.body.transaction_id).toEqual('123')
    expect(res.body.virtual_account).toEqual('1234')
    expect(res.body.callbackResponseCode).toEqual(200)
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

  it('Should be able to retry', async () => {
    axios.get.mockImplementation(() => Promise.resolve({
      data: [],
      status: 400,
    }))
    const res = await request(app).put('/callbacks/retry/e8980029-04a0-4b9c-8c64-182c8a81cc43')
    expect(res.statusCode).toEqual(200)
    expect(res.body.message).toEqual("success retrying callback")
  })

  it('Should failed to retry when callback id is invalid', async () => {
    axios.get.mockImplementation(() => Promise.resolve({
      data: [],
      status: 400,
    }))
    const res = await request(app).put('/callbacks/retry/e8980029-04a0-4b9c-8c64-182c8a81cc41')
    expect(res.statusCode).toEqual(400)
    expect(res.body.message).toEqual("id is invalid.")
  })

  it('Should create a callback with callbackResponseCode 400', async () => {
    axios.get.mockImplementation(() => Promise.reject({
      data: [],
      response: {
        status: 400,
      }
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

describe('Businesses API', () => {
  it('Should return empty array when there is no data', async () => {
    const res = await request(app).get('/businesses')
    expect(res.statusCode).toEqual(200)
    expect(res.body.businesses[0].businessName).toEqual('Test')
    expect(res.body.businesses[0].businessCallbackUrl).toEqual('https://google.com')
  })

  it('Should return be able to create a business', async () => {
    const res = await request(app).post('/businesses').send(businessBody)
    expect(res.statusCode).toEqual(200)
    expect(res.body.business.businessName).toEqual('Test')
    expect(res.body.business.businessCallbackUrl).toEqual('https://google.com')
  })

  it('Should return be able to update a business', async () => {
    const res = await request(app).put('/businesses/2ca01b01-4d0a-4ae4-ac60-56ff0f952d8f').send({
      businessName: 'new business',
      businessCallbackUrl: 'https://twitter.com'
    })
    expect(res.statusCode).toEqual(200)
    expect(res.body.business.businessName).toEqual('new business')
    expect(res.body.business.businessCallbackUrl).toEqual('https://twitter.com')
  })
})

describe('Users API', () => {
  it('Should be able to create user', async () => {
    const res = await request(app).post('/users').send(userBody)
    expect(res.statusCode).toEqual(200)
    expect(res.body).toEqual({
      "message": "Success creating user.",
      "user": {
          "email": "john@mail.com",
          "name": "John"
      }
    })
  })

  it('User should be able to login', async () => {
    const res = await request(app).post('/users/login').send({
      email: 'john@mail.com',
      password: 'password'
    })
    expect(res.statusCode).toEqual(200)
    expect(res.body.message).toEqual('Successfully logged in.')
    expect(res.body.user).toEqual({
      email: 'john@mail.com',
      name: 'John',
    })

  })

  it('should be able to authenticate JWT', async () => {
    // first log in the user
    const res = await request(app).post('/users/login').send({
      email: 'john@mail.com',
      password: 'password'
    })
    expect(res.statusCode).toEqual(200)
    expect(res.body.message).toEqual('Successfully logged in.')

    // get the accessToken from login
    const { accessToken } = res.body
    const authenticateResponse = await request(app).get('/users/authenticate').set('Authorization', `Bearer ${accessToken}`)

    expect(authenticateResponse.statusCode).toEqual(200)
    expect(authenticateResponse.body.message).toEqual('Authenticated.')
    expect(authenticateResponse.body.user.name).toEqual('John')
    expect(authenticateResponse.body.user.email).toEqual('john@mail.com')
  })
})

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

  await models.User.destroy({
    where: {},
    truncate: true
  })

  await models.Business.destroy({
    where: {},
  })
})