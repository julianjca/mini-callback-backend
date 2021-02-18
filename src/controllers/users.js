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
        const accessToken = jwt.sign({ 
          name: user.name, 
          email: user.email, 
          businessName: user.business.businessName,
          businessId: user.businessId,
        }, accessTokenSecret);

        res.status(200).json({
            accessToken,
            message: 'Successfully logged in.',
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
      console.log(e)
      res.status(500).json({
        message: 'Failed creating user.',
      })
    }
  },
  async authenticate (req, res) {
    const authHeader = req.headers.authorization;

  if (authHeader) {
      const token = authHeader.split(' ')[1];

      // eslint-disable-next-line consistent-return
      jwt.verify(token, accessTokenSecret, (err, user) => {
          if (err) {
              return res.status(403).json({
                message: 'Unauthorized'
              });
          }
          return res.status(200).json({
            user,
            message: 'Authenticated.',
          }) 
      });
  } else {
      res.status(401).json({
        message: 'Unauthorized.'
      });
  }
  },
}