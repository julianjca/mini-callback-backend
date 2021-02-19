const uuid = require('uuid')
const axios = require('axios')

const models = require('../../models')

module.exports = {
  async getAll (_, res) {
    try {
      const callbacks = await models.Callback.findAll()
      res.status(200).json({
        callbacks,
      })
    } catch (e) {
      res.status(500).json({
        message: 'Failed getting callbacks.'
      })
    }
  },
  async getById (req, res) {
    const { id } = req.params
    try {
      const callback = await models.Callback.findOne({
        where: {
          id,
        }
      })
      res.status(200).json(callback)
    } catch (e) {
      res.status(500).json({
        message: 'Failed getting callbacks.'
      })
    }
  },
  async create (req, res) {
    const timestamp = req.body.timestamp
    const payload = { 
      ...req.body,
      businessId: req.body.business_id,
      timestamp,
      id: uuid.v4(),
      createdAt: new Date(),
      updatedAt: new Date(),
    }

    delete payload.business_id

    const business = await models.Business.findOne({
      where: {
        id: payload.businessId,
      }
    })

    if(!business) {
      res.status(400).json({
        message: 'business_id is invalid.'
      })
      return
    }

    try {
      const { status } = await axios.get(business.businessCallbackUrl)
      payload.callbackResponseCode = status

    } catch (e) {
      payload.callbackResponseCode = e.response.status
    }



    try {
      const callback = await models.Callback.create(payload)
      res.status(200).json({
        callback,
      })
    } catch (e) {
      res.status(500).json({
        message: 'Failed creating callback.'
      })
    }
  },
  async retry (req, res) {
    const { id } = req.params
    
    const callback = await models.Callback.findOne({
      where: {
        id,
      }
    })

    if(!callback) {
      res.status(400).json({
        message: 'id is invalid.'
      })
      return
    }

    const business = await models.Business.findOne({
      where: {
        id: callback.businessId,
      }
    })

    const payload = {
      ...callback
    }


    try {
      const { status } = await axios.get(business.businessCallbackUrl)
      payload.callbackResponseCode = status

    } catch (e) {
      payload.callbackResponseCode = e.response.status
    }



    try {
      const response = await models.Callback.update(payload, {
        where: {
          id,
        },
        returning: true,
      })
      res.status(200).json({
        callback: response[1][0],
        message: 'success retrying callback',
      })
    } catch (e) {
      res.status(500).json({
        message: 'Failed creating callback.'
      })
    }
  }
}