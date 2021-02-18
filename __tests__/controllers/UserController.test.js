const argon = require('argon2')
const jwt = require('jsonwebtoken')

jest.mock('argon2')
jest.mock('jsonwebtoken')

const models = require('../../models')

const { login, create, authenticate } = require('../../src/controllers/users')

describe('Business controller', () => {
  it('should create a user', async () => {
    const mock = jest.spyOn(models.User, 'create').mockResolvedValueOnce({});
    const argonMock = jest.spyOn(argon, 'hash').mockImplementation(() => Promise.resolve('hashedpassword'))

    const mReq = {
      body: {
        name: 'John',
        email: 'john@mail.com',
        password: 'password',
        businessId: '19b5eec0-1439-4598-bc73-c4580d04f45b',
      }
    };
    const mRes = { status: jest.fn().mockReturnThis(), json: jest.fn() };
    await create(mReq, mRes);

    expect(mRes.status).toBeCalledWith(200);
    expect(mRes.json).toBeCalledWith({
      "message": "Success creating user.",
      "user": {
          "email": "john@mail.com",
          "name": "John"
      }
  });

    mock.mockRestore()
    argonMock.mockRestore()
  });

  it('should failed to create a user when there is an error from DB', async () => {
    const mock = jest.spyOn(models.User, 'create').mockImplementation(() => Promise.reject());
    const argonMock = jest.spyOn(argon, 'hash').mockImplementation(() => Promise.resolve('hashedpassword'))

    const mReq = {
      body: {
        name: 'John',
        email: 'john@mail.com',
        password: 'password',
        businessId: '19b5eec0-1439-4598-bc73-c4580d04f45b',
      }
    };
    const mRes = { status: jest.fn().mockReturnThis(), json: jest.fn() };
    await create(mReq, mRes);

    expect(mRes.status).toBeCalledWith(500);
    expect(mRes.json).toBeCalledWith({
      message: 'Failed creating user.',
    });

    mock.mockRestore()
    argonMock.mockRestore()
  });

  it('should be able to login', async () => {
    const mock = jest.spyOn(models.User, 'findOne').mockImplementation(() => Promise.resolve({
      name: 'John',
      email: 'john@mail.com',
      businessId: '19b5eec0-1439-4598-bc73-c4580d04f45b',
      business: {
        businessName: 'Business Name'
      }
    }));
    const argonMock = jest.spyOn(argon, 'verify').mockImplementation(() => Promise.resolve(true))

    const mReq = {
      body: {
        email: 'john@mail.com',
        password: 'password',
      }
    };
    const mRes = { status: jest.fn().mockReturnThis(), json: jest.fn() };
    await login(mReq, mRes);

    expect(mRes.status).toBeCalledWith(200);

    mock.mockRestore()
    argonMock.mockRestore()
  });

  it('should fail to login when password is not matched', async () => {
    const mock = jest.spyOn(models.User, 'findOne').mockImplementation(() => Promise.resolve({
      name: 'John',
      email: 'john@mail.com',
      businessId: '19b5eec0-1439-4598-bc73-c4580d04f45b',
      business: {
        businessName: 'Business Name'
      }
    }));
    const argonMock = jest.spyOn(argon, 'verify').mockImplementation(() => Promise.resolve(false))

    const mReq = {
      body: {
        email: 'john@mail.com',
        password: 'password',
      }
    };
    const mRes = { status: jest.fn().mockReturnThis(), json: jest.fn() };
    await login(mReq, mRes);

    expect(mRes.status).toBeCalledWith(400);
    expect(mRes.json).toBeCalledWith({
      message: 'Failed to logged in.'
    })

    mock.mockRestore()
    argonMock.mockRestore()
  });

  it('should fail to login when there is no user from DB', async () => {
    const mock = jest.spyOn(models.User, 'findOne').mockImplementation(() => Promise.resolve(null));

    const mReq = {
      body: {
        email: 'john@mail.com',
        password: 'password',
      }
    };
    const mRes = { status: jest.fn().mockReturnThis(), json: jest.fn() };
    await login(mReq, mRes);

    expect(mRes.status).toBeCalledWith(500);
    expect(mRes.json).toBeCalledWith({
      message: 'No user found.'
    })

    mock.mockRestore()
  });

  it('should authenticate JWT', async () => {
    const mock = jest.spyOn(jwt, 'verify').mockImplementation(() => Promise.resolve({
      "email": "john@mail.com",
      "name": "John",
      "businessId": "a6e21744-7aa9-4118-b666-f9c1619bba2d",
      "businessName": "Business 2",
      "iat": 1613638142
  }));

    const mReq = {
      headers: {
        authorization: 'Bearer token1231231231232',
      }
    };
    const mRes = { status: jest.fn().mockReturnThis(), json: jest.fn() };
    await authenticate(mReq, mRes);

    expect(mRes.status).toBeCalledWith(200);
    expect(mRes.json).toBeCalledWith({
      "user": {
          "email": "john@mail.com",
          "name": "John",
          "businessId": "a6e21744-7aa9-4118-b666-f9c1619bba2d",
          "businessName": "Business 2",
          "iat": 1613638142
      },
      "message": "Authenticated."
    })

    mock.mockRestore()
  });

  it('should failed to authenticate JWT when no token provided', async () => {
    const mock = jest.spyOn(jwt, 'verify').mockImplementation(() => Promise.resolve({
      "email": "john@mail.com",
      "name": "John",
      "businessId": "a6e21744-7aa9-4118-b666-f9c1619bba2d",
      "businessName": "Business 2",
      "iat": 1613638142
  }));

    const mReq = {
      headers: {}
    };
    const mRes = { status: jest.fn().mockReturnThis(), json: jest.fn() };
    await authenticate(mReq, mRes);

    expect(mRes.status).toBeCalledWith(401);
    expect(mRes.json).toBeCalledWith({
      "message": "Unauthorized."
    })

    mock.mockRestore()
  });

  it('should failed to authenticate JWT when JWT returns error', async () => {
    const mock = jest.spyOn(jwt, 'verify').mockImplementation(() => Promise.reject());

    const mReq = {
      headers: {
        authorization: 'Bearer token'
      }
    };
    const mRes = { status: jest.fn().mockReturnThis(), json: jest.fn() };
    await authenticate(mReq, mRes);

    expect(mRes.status).toBeCalledWith(403);
    expect(mRes.json).toBeCalledWith({
      "message": "Unauthorized."
    })

    mock.mockRestore()
  });
})

