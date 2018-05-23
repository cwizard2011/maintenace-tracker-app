import dotenv from 'dotenv';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import { Client } from 'pg';
import Authentication from '../helpers/Auth';

dotenv.config();

const connectionString = process.env.DATABASE_URL;
const salt = bcrypt.genSaltSync(10);

/**
 * class User: controls all user routes
 *
 * @class
 */
class UserControllers {
  /**
 * @description: controls a user's registration
 * through route POST: api/v1/user/signup
 *
 * @param {Object} req request object
 * @param {Object} res response object
 *
 * @return {Object} response containing the registered user
 */
  static signUp(req, res) {
    const client = new Client(connectionString);
    client.connect();
    const {
      username,
      password,
      firstName,
      lastName,
      email,
    } = req.body;
    const hashedPassword = bcrypt.hashSync(password, salt);
    const query = {
      text: 'INSERT INTO userlist(username, password, firstName, lastName, email) VALUES ($1, $2, $3, $4, $5) RETURNING *',
      values: [username, hashedPassword, firstName, lastName, email],
    };
    client.query(query, (err, response) => {
      client.end();
      if (err) {
        return res.status(500).json({
          data: { err },
          message: 'User registration failed',
          status: 'error',
        });
      }
      return res.status(201).json({
        data: {
          user: {
            username,
            password: hashedPassword,
            email,
            id: response.rows[0].id,
            user_role: response.rows[0].user_role,
          },
          token: jwt.sign(
            {
              id: response.rows[0].id,
              email: response.rows[0].email,
              user_role: response.rows[0].user_role,
            },
            process.env.JWT_SECRET, { expiresIn: process.env.JWT_EXPIRY },
          ),
        },
        message: 'User registration successful',
        status: 'success',
      });
    });
  }
  /**
 * @description: controls a user's login through route POST: api/user/signin
 *
 * @param {Object} req request object
 * @param {Object} res response object
 *
 * @return {Object} response containing the logged-in user
 */
  static login(req, res) {
    const { username, password } = req.body;
    const newQuery = {
      text: 'SELECT username, password, id FROM userlist WHERE username = $1',
      values: [username],
    };
    const client = new Client(connectionString);
    client.connect();
    client.query(newQuery, (error, result) => {
      client.end();
      if (error) {
        return res.status(500).json({
          data: { error },
          message: 'Login failed',
          status: 'error',
        });
      } else if (result.rows[0] === undefined) {
        return res.status(401).json({
          data: {},
          message: 'username or password incorrect, please provide valid credential',
          status: 'fail',
        });
      } else if (bcrypt.compareSync(password, result.rows[0].password)) {
        const token = Authentication.generateToken({
          id: result.rows[0].id,
          email: result.rows[0].email,
          user_role: result.rows[0].user_role,
        });
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
        data: {},
        message: 'username or password incorrect, try again',
        status: 'fail',
      });
    });
  }
}
export default UserControllers;
