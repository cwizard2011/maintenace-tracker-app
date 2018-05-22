import dotenv from 'dotenv';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import { Client } from 'pg';


// import Auth from '../helpers/Auth';
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
}
export default UserControllers;
