import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import dotenv from 'dotenv';
import Authentication from '../helpers/Authentication';
import pool from '../models/database';
import Mailer from '../helpers/Mailer';

dotenv.config();
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
    const username = req.body.username.toLowerCase();
    const {
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
      Mailer.welcomeMail(email, firstname);
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
            {
              id: response.rows[0].id,
              username,
              email,
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
 * @static: controls a user's login
 *
 * @param {Object} req request object
 * @param {Object} res response object
 *
 * @return {Object} response containing the logged-in user
 */
  static login(req, res) {
    const { username, email, password } = req.body;
    const newQuery = {
      text: 'SELECT * FROM userlist WHERE username = $1 OR email = $2',
      values: [username, email],
    };
    pool.query(newQuery, (error, result) => {
      if (error) {
        return res.status(500).json({
          message: 'Login failed',
          status: 'error',
        });
      } else if (result.rows[0] === undefined) {
        return res.status(401).json({
          message: 'Email/username invalid, please provide valid credentials',
          status: 'fail',
        });
      } else if (bcrypt.compareSync(password, result.rows[0].password)) {
        const token = Authentication.generateToken({
          id: result.rows[0].id,
          username,
          email,
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
        message: 'Password incorrect, try again',
        status: 'fail',
      });
    });
  }
  /**
   * @static Method for retrieving users profile
   *
   * @param {Object} req - Request object
   * @param {Object} res - Response object
   */
  static userProfile(req, res) {
    const query = {
      text: 'SELECT * FROM userlist WHERE id = $1',
      values: [req.decode.id],
    };
    pool.query(query, (err, response) => {
      const {
        firstname, lastname, email,
      } = response.rows[0];
      return res.status(200).json({
        data: {
          firstname,
          lastname,
          email,
          memberSince: response.rows[0].created_at,
          profilePics: response.rows[0].profile_img,
        },
        message: 'Profile successfully retrieved',
        status: 'success',
      });
    });
  }
  /**
   * @static Method for changing user password
   *
   * @param {Object} req - Request object
   * @param {Object} res - Response object
   */
  static updatePassword(req, res) {
    const {
      oldpassword, newpassword,
    } = req.body;
    const query = {
      text: 'SELECT * FROM userlist WHERE id = $1',
      values: [req.decode.id],
    };
    pool.query(query, (err, response) => {
      if (!bcrypt.compareSync(oldpassword, response.rows[0].password)) {
        return res.status(401).json({
          message: 'Old password incorrect, please check the old password again',
          status: 'fail',
        });
      } else if (bcrypt.compareSync(newpassword, response.rows[0].password)) {
        return res.status(409).json({
          message: 'New password is the same as previous password, please change your new password',
          status: 'fail',
        });
      }
      const hashedPassword = bcrypt.hashSync(newpassword, salt);
      const updateAt = new Date();

      const updateQuery = {
        text: 'UPDATE userlist SET password = $1, updated_at = $2 WHERE id = $3 RETURNING *;',
        values: [hashedPassword, updateAt, req.decode.id],
      };
      pool.query(updateQuery, (error, result) => {
        if (result.rows[0]) {
          const { firstname, email } = result.rows[0];
          Mailer.passwordChangeNotification(firstname, email);
          res.status(200).json({
            data: {
              token: jwt.sign(
                {
                  id: result.rows[0].id,
                  username: result.rows[0].username,
                  email: result.rows[0].email,
                  user_role: result.rows[0].user_role,
                },
                process.env.JWT_SECRET, { expiresIn: process.env.JWT_EXPIRY },
              ),
            },
            message: 'Your password has been successfully updated',
            status: 'success',
          });
        }
      });
      return null;
    });
  }
  /**
   * @static Method for resetting user password
   *
   * @param {Object} req - Request object
   * @param {Object} res - Response object
   */
  static passwordReset(req, res) {
    const { email, username } = req.body;
    const query = {
      text: 'SELECT * FROM userlist WHERE email = $1 OR username = $2;',
      values: [email, username],
    };
    pool.query(query, (error, result) => {
      if (result.rows[0]) {
        const payload = {
          id: result.rows[0].id,
          email: result.rows[0].email,
          username,
        };
        const { firstname } = result.rows[0];
        const secret = `${result.rows[0].password} '-' ${result.updated_at}`;
        const token = jwt.sign(payload, secret, {
          expiresIn: process.env.JWT_PASSWORD_RESET_EXPIRY,
        });
        Mailer.passwordReset(firstname, payload.id, token, payload.email);
        return res.status(200).json({
          data: {
            token,
          },
          message: 'Password reset link has been successfully sent to your email, please check your email',
          status: 'success',
        });
      }
      return res.status(404).json({
        message: 'User not found in the database',
        status: 'fail',
      });
    });
  }
  /**
   * @static Method to decode token for password reset
   *
   * @param {Object} req - Request object
   * @param {Object} res - Response object
   */
  static resetPassword(req, res) {
    const { id, token } = req.params;
    const query = {
      text: 'SELECT * FROM userlist WHERE id = $1;',
      values: [id],
    };
    pool.query(query, (err, result) => {
      if (result.rows[0]) {
        const secret = `${result.rows[0].password} '-' ${result.updated_at}`;
        const payload = jwt.decode(token, secret);
        return res.status(200).json({
          data: {
            payload,
          },
          message: 'Token successfully decoded, please enter a new password in the provided form',
          status: 'success',
        });
      }
      return res.status(404).json({
        message: 'User not found in the database',
        status: 'fail',
      });
    });
  }
  /**
   * @static - Method to create a new password
   *
   * @param {Object} req - Request object
   * @param {Object} res - Response object
   */
  static createNewPassword(req, res) {
    const { id, token, password } = req.body;
    const query = {
      text: 'SELECT * FROM userlist WHERE id = $1;',
      values: [id],
    };
    pool.query(query, (err, result) => {
      if (result.rows[0]) {
        const secret = `${result.rows[0].password} '-' ${result.updated_at}`;
        const payload = jwt.decode(token, secret);

        const hashedPassword = bcrypt.hashSync(password, salt);
        const updateAt = new Date();
        const resetQuery = {
          text: 'UPDATE userlist SET password = $1, updated_at = $2 WHERE id = $3 RETURNING *;',
          values: [hashedPassword, updateAt, payload.id],
        };
        pool.query(resetQuery, (error, response) => {
          if (response.rows[0]) {
            const { firstname, email } = response.rows[0];
            Mailer.passwordChangeNotification(firstname, email);
            res.status(200).json({
              data: {
                id,
                email: response.rows[0].email,
                username: response.rows[0].username,
                createdAt: response.rows[0].created_at,
                updatedAt: response.rows[0].updated_at,
              },
              message: 'Password has been successfully changed, please login with your new password',
              status: 'success',
            });
          } else {
            res.status(404).json({
              message: 'User not found in the database',
              status: 'fail',
            });
          }
        });
      } else {
        res.status(404).json({
          message: 'User not found in the database',
          status: 'fail',
        });
      }
    });
  }
}
export default UserControllers;
