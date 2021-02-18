const uuid = require('uuid')
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
      const callback = await models.Callback.create(payload)
      res.status(200).json({
        callback,
      })
    } catch (e) {
      res.status(500).json({
        message: 'Failed creating callback.'
      })
    }
  }
}