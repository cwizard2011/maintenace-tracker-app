import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import Authentication from '../helpers/Authentication';
import pool from '../models/database';

const salt = bcrypt.genSaltSync(10);

/**
 * @description: class for controlling all users routes
 *
 * @class: User controller
 */
class UserControllers {
  /**
 * @static: method for a user's registration
 *
 * @param {Object} req request object
 * @param {Object} res response object
 *
 * @return {Object} response containing the registered user
 */
  static signUp(req, res) {
    const {
      username,
      password,
      firstname,
      lastname,
      email,
    } = req.body;
    const hashedPassword = bcrypt.hashSync(password, salt);
    const query = {
      text: 'INSERT INTO userlist(username, password, firstname, lastname, email) VALUES ($1, $2, $3, $4, $5) RETURNING *',
      values: [username, hashedPassword, firstname, lastname, email],
    };
    pool.query(query, (err, response) => {
      if (err) {
        return res.status(500).json({
          message: 'User registration failed',
          status: 'error',
        });
      }
      return res.status(201).json({
        data: {
          user: {
            username,
            email,
            id: response.rows[0].id,
            user_role: response.rows[0].user_role,
            fullname: `${response.rows[0].firstname} ${response.rows[0].lastname}`,
          },
          token: jwt.sign(
            response.rows[0],
            process.env.JWT_SECRET, { expiresIn: process.env.JWT_EXPIRY },
          ),
        },
        message: 'User registration successful',
        status: 'success',
      });
    });
  }
  /**
 * @static: controls a user's login
 *
 * @param {Object} req request object
 * @param {Object} res response object
 *
 * @return {Object} response containing the logged-in user
 */
  static login(req, res) {
    const { username, password } = req.body;
    const newQuery = {
      text: 'SELECT * FROM userlist WHERE username = $1',
      values: [username],
    };
    pool.query(newQuery, (error, result) => {
      if (error) {
        return res.status(500).json({
          message: 'Login failed',
          status: 'error',
        });
      } else if (result.rows[0] === undefined) {
        return res.status(401).json({
          message: 'Username or password incorrect, please provide valid credential',
          status: 'fail',
        });
      } else if (bcrypt.compareSync(password, result.rows[0].password)) {
        const token = Authentication.generateToken(result.rows[0]);
        return res.status(200).json({
          data: {
            id: result.rows[0].id,
            username: result.rows[0].username,
            email: result.rows[0].email,
            role: result.rows[0].user_role,
            token,
          },
          message: 'You are now logged in',
          status: 'success',
        });
      }
      return res.status(401).json({
        message: 'Username or password incorrect, try again',
        status: 'fail',
      });
    });
  }
}
export default UserControllers;
