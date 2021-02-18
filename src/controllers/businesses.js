const uuid = require('uuid')
const models = require('../../models')

module.exports = {
  async getAll (_, res) {
    try {
      const businesses = await models.Business.findAll()
      res.status(200).json({
        businesses,
      })
    } catch (e) {
      res.status(500).json({
        message: 'Failed getting businesses.'
      })
    }
  },
  async create (req, res) {
    const payload = { 
      ...req.body,
      id: uuid.v4(),
      createdAt: new Date(),
      updatedAt: new Date(),
    }

    try {
      const business = await models.Business.create(payload)
      res.status(200).json({
        business,
      })
    } catch (e) {
      res.status(500).json({
        message: 'Failed creating business.'
      })
    }
  },
  async update (req, res) {
    const payload = { 
      ...req.body,
      updatedAt: new Date(),
    }

    try {
      const business = await models.Business.update(payload, {
        where: {
          id: req.params.id,
        },
        returning: true,
      })
      res.status(200).json({
        business: business[1][0],
        message: 'success updating business',
      })
    } catch (e) {
      res.status(500).json({
        message: 'Failed creating business.'
      })
    }
  }
}