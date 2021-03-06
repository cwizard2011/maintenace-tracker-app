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
          code: 500,
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
        code: 201,
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
          code: 401,
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
          code: 200,
        });
      }
      return res.status(401).json({
        message: 'Password incorrect, try again',
        status: 'fail',
        code: 401,
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
        firstname, lastname, email, username,
      } = response.rows[0];
      return res.status(200).json({
        data: {
          firstname,
          lastname,
          email,
          username,
          userRole: response.rows[0].user_role,
          memberSince: response.rows[0].created_at,
          profilePics: response.rows[0].profile_img,
        },
        message: 'Profile successfully retrieved',
        status: 'success',
        code: 200,
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
          code: 401,
        });
      } else if (bcrypt.compareSync(newpassword, response.rows[0].password)) {
        return res.status(409).json({
          message: 'New password is the same as previous password, please change your new password',
          status: 'fail',
          code: 409,
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
            code: 200,
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
          code: 200,
        });
      }
      return res.status(404).json({
        message: 'User not found in the database',
        status: 'fail',
        code: 404,
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
      if (result === undefined) {
        res.status(400).json({
          message: 'Invalid id, please use a valid user uuid',
          status: 'fail',
        });
      } else if (result.rows[0]) {
        const secret = `${result.rows[0].password} '-' ${result.updated_at}`;
        const payload = jwt.decode(token, secret);
        if (payload === null) {
          return res.status(400).json({
            message: 'Invalid token, please use a valid token',
            status: 'fail',
            code: 400,
          });
        } else if (result.rows[0].used_token === token) {
          res.status(409).json({
            message: 'This token link has already been used, try again with a new token link',
            status: 'fail',
            code: 409,
          });
        }
        const hashedPassword = bcrypt.hashSync(password, salt);
        const updateAt = new Date();
        const resetQuery = {
          text: 'UPDATE userlist SET password = $1, updated_at = $2, used_token = $4 WHERE id = $3 RETURNING *;',
          values: [hashedPassword, updateAt, payload.id, token],
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
              code: 200,
            });
          } else {
            res.status(404).json({
              message: 'User not found in the database',
              status: 'fail',
              code: 404,
            });
          }
        });
      } else {
        res.status(404).json({
          message: 'User not found in the database',
          status: 'fail',
          code: 404,
        });
      }
      return null;
    });
  }
  /**
   * @static - Method to update user role
   *
   * @param {String} req - Id of the user
   * @param {Object} res - Response object
   */
  static updateUserRole(req, res) {
    try {
      const { userId } = req.params;
      const updateAt = new Date();
      const query = {
        text: 'SELECT * FROM userlist WHERE id = $1;',
        values: [userId],
      };
      pool.query(query, (err, result) => {
        if (result === undefined) {
          res.status(400).json({
            message: 'Invalid id, please use a valid uuid',
            status: 'fail',
            code: 400,
          });
        } else if (result.rows[0].user_role === 'user') {
          const updateAdmin = {
            text: 'UPDATE userlist SET user_role= $1, updated_at = $2 WHERE id= $3 RETURNING username, email, user_role, firstname',
            values: ['admin', updateAt, userId],
          };
          pool.query(updateAdmin, (error, response) => {
            if (response.rows[0]) {
              res.status(200).json({
                data: response.rows[0],
                message: 'Users role successfully upgraded to admin',
                status: 'success',
                code: 200,
              });
            } else {
              res.status(408).json({
                message: 'Something went wrong, request timeout, try again later',
                status: 'fail',
                code: 408,
              });
            }
          });
        } else if (result.rows[0].user_role === 'admin') {
          const removeAdmin = {
            text: 'UPDATE userlist SET user_role= $1, updated_at = $2 WHERE id= $3 RETURNING username, email, user_role, firstname',
            values: ['user', updateAt, userId],
          };
          pool.query(removeAdmin, (error, response) => {
            if (response.rows[0]) {
              res.status(200).json({
                data: response.rows[0],
                message: 'User has been stripped of admin priviledges',
                status: 'success',
                code: 200,
              });
            } else {
              res.status(408).json({
                message: 'Something went wrong, request timeout, try again later',
                status: 'fail',
                code: 408,
              });
            }
          });
        } else {
          res.status(408).json({
            message: 'Something went wrong, request timeout, try again later',
            status: 'fail',
            code: 408,
          });
        }
      });
    } catch (err) {
      res.status(500).json({
        message: 'Oops something went wrong on my end here, the engineers will fix it soon',
        status: 'fail',
        code: 500,
      });
    }
  }
  /**
   * @static Method to delete a user
   *
   * @param {string} req - user Id
   * @param {object} res - response object
   */
  static deleteUser(req, res) {
    const { userId } = req.params;
    const query = {
      text: 'SELECT * FROM userlist WHERE id = $1',
      values: [userId],
    };
    pool.query(query, (err, response) => {
      if (response === undefined) {
        res.status(400).json({
          message: 'Invalid id, please use a valid uuid',
          status: 'fail',
          code: 400,
        });
      } else if (response.rows.length === 0) {
        res.status(404).json({
          message: 'User not found in the database',
          status: 'fail',
          code: 404,
        });
      } else if (response.rows[0].user_role === 'user') {
        const delUser = {
          text: 'DELETE FROM userlist WHERE id = $1 RETURNING *',
          values: [response.rows[0].id],
        };
        pool.query(delUser, (error, result) => {
          if (result.rows[0]) {
            res.status(200).json({
              data: result.rows[0],
              message: 'User successfully deleted',
              status: 'success',
              code: 200,
            });
          } else {
            res.status(408).json({
              message: 'Something went wrong, request timeout, try again later',
              status: 'fail',
              code: 408,
            });
          }
        });
      } else if (response.rows[0].user_role === 'admin') {
        res.status(405).json({
          message: 'You can\'t delete an admin, you have to remove the admin privileges first',
          status: 'fail',
          code: 405,
        });
      } else {
        res.status(408).json({
          message: 'Something went wrong, request timeout, try again later',
          status: 'fail',
          code: 408,
        });
      }
    });
  }
}
export default UserControllers;
