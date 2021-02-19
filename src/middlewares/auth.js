const jwt = require('jsonwebtoken')

const accessTokenSecret = process.env.JWT_SECRET

// eslint-disable-next-line consistent-return
const authenticateJWT = async (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (authHeader) {
      const token = authHeader.split(' ')[1];

      try {
        const user = await jwt.verify(token, accessTokenSecret)
        req.user = user;
        next();
      }
      catch {
        return res.status(403).json({
          message: 'Unauthorized'
        });
      }
  } else {
      res.status(401).json({
        message: 'Unauthorized.'
      });
  }
};

module.exports = authenticateJWT