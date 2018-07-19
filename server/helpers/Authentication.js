import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';


dotenv.config();
const jwtSecret = process.env.JWT_SECRET;

/**
 * @description: protects the routes with jwt
 *
 * @class Authenticate
 *
 */
export default class Authentication {
/**
 * @static: it generate a login token
 *
 * @param {Object} payload payload to generate token
 *
 * @return {String} the generated token
 *
 */
  static generateToken(payload) {
    const token = jwt.sign(payload, jwtSecret, {
      expiresIn: process.env.JWT_EXPIRY,
    });
    return token;
  }

  /**
 * @static: verifies the token supplied
 *
 * @param {Object} req request object
 * @param {Object} res response object
 * @param {Function} next callback function
 *
 * @return {Object} response containing user's access status
 */
  static verifyToken(req, res, next) {
    const token = req.headers.token || req.body.token;
    if (token) {
      jwt.verify(token, jwtSecret, (err, decode) => {
        if (decode === undefined) {
          return res.status(401).json({
            message: 'Oops! Access denied. Kindly login',
            status: 'fail',
            code: 401,
          });
        }
        req.decode = decode;
        return next();
      });
    } else {
      res.status(401).json({
        message: 'Please login with your username and password',
        status: 'fail',
        code: 401,
      });
    }
  }
}
