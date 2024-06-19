const jwt = require('jsonwebtoken');
const dotenv = require('dotenv');
// get config vars
dotenv.config();
function authenticateToken(req, res, next) {
  const authHeader = req.headers['authorization']
  if (authHeader == null) return res.sendStatus(401)
  console.log(authHeader)

  jwt.verify(authHeader, process.env.TOKEN_SECRET, (err, user) => {
    if (err) return res.sendStatus(403)
    req.user = user
    next()
  })
}

module.exports = authenticateToken