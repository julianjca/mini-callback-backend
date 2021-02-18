const jwt = require('jsonwebtoken')

const accessTokenSecret = process.env.JWT_SECRET

const authenticateJWT = (req, res, next) => {
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

          req.user = user;
          next();
      });
  } else {
      res.status(401).json({
        message: 'Unauthorized.'
      });
  }
};

module.exports = authenticateJWT