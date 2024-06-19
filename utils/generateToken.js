const dotenv = require('dotenv');
const jwt = require('jsonwebtoken')

// get config vars
dotenv.config();

// access config var
// process.env.TOKEN_SECRET;
function generateAccessToken(id) {
  return jwt.sign({id}, process.env.TOKEN_SECRET, { expiresIn: 60 * 60 });
}

module.exports = generateAccessToken