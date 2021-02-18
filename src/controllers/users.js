const uuid = require('uuid')
const argon2 = require('argon2');
const jwt = require('jsonwebtoken')

const models = require('../../models')
const accessTokenSecret = process.env.JWT_SECRET

module.exports = {
  async login (req, res) {
    const { email, password } = req.body
    const user = await models.User.findOne({
      where: {
        email,
      },
      include: {
        model: models.Business,
        as: 'business',
        attributes:['businessName']
      },
    })

    if(user) {
      const isValid = await argon2.verify(user.password, password)

      if (isValid) {
        const userData = {
          email: user.email,
          name: user.name,
          businessId: user.businessId,
          businessName: user.business.businessName,
        }
        const accessToken = jwt.sign(userData, accessTokenSecret);

        res.status(200).json({
          accessToken,
          message: 'Successfully logged in.',
          user: userData,
        });
      } else {
        res.status(400).json({
          message: 'Failed to logged in.',
        });
      }
    } else {
      res.status(500).json({
        message: 'No user found.',
      })
    }
  },
  async create (req, res) {
    const { name, email, password, businessId } = req.body
    const hash = await argon2.hash(password);

    const user = await models.User.findOne({
      where: {
        email,
      }
    })

    if (!user) {
      try {
        await models.User.create({
          name,
          email,
          businessId,
          password: hash,
          id: uuid.v4(),
          createdAt: new Date(),
          updatedAt: new Date(),
        })
        res.status(200).json({
          message: 'Success creating user.',
          user: {
            email,
            name,
          }
        })
      } catch(e) {
        res.status(500).json({
          message: 'Failed creating user.',
        })
      }
    } else {
      res.status(500).json({
        message: 'Email has been used.',
      })
    }   
  },
  async authenticate (req, res) {
    const authHeader = req.headers.authorization;

    if (authHeader) {
        const token = authHeader.split(' ')[1];

        try {
          const user = await jwt.verify(token, accessTokenSecret)
          res.status(200).json({
            user,
            message: 'Authenticated.',
          }) 
        } catch {
          res.status(403).json({
            message: 'Unauthorized.'
          });
        }       
    } else {
        res.status(401).json({
          message: 'Unauthorized.'
        });
    }
  },
}