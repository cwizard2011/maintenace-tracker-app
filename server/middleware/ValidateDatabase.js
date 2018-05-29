import validate from 'uuid-validate';
import winston from 'winston';
import pool from '../models/database';

/**
*@description: controller for verifying users requests in the database
*
* @class: Checks all requests
*/
class ValidateDatabase {
  /**
   * @static Method for validating username and email
   *
   * @param {object} req - request object
   * @param {object} res -  response object
   * @param {function} done - callback function to call the next middleware
   */
  static checkUser(req, res, done) {
    const {
      username,
      email,
    } = req.body;
    const newQuery = {
      text: 'SELECT * FROM userlist WHERE username = $1 OR email = $2',
      values: [username, email],
    };
    pool.query(newQuery, (err, result) => {
      if (result.rows[0]) {
        return res.status(409).json({
          message: 'User already exist, please sign in with your username and password',
          status: 'fail',
        });
      }
      return done();
    });
  }
  /**
   * @static: Method for verifying if a request already exist in the database for
   * a user before creating a new one
   *
   * @param {object} req - request object
   * @param {object} res - response object
   * @param {function} done - callback function to call on the next middleware
   */
  static checkRequest(req, res, done) {
    const { title } = req.body;
    const newQuery = {
      text: 'SELECT * FROM requests WHERE title = $1 AND user_id = $2',
      values: [title, req.decode.id],
    };
    pool.query(newQuery, (err, result) => {
      if (err) {
        return winston.log('error', err);
      }
      if (result.rows[0]) {
        return res.status(409).json({
          message: 'This request has already been logged, Please log a new request',
          status: 'fail',
        });
      }
      return done();
    });
  }
  /**
   * @static: Method for checking the database if the user Id exist
   *
   * @param {object} req -request object
   * @param {object} res - response object
   * @param {function} done - callback function to call on the next middleware
   */
  static checkUserId(req, res, done) {
    const newQuery = {
      text: 'SELECT * FROM userlist WHERE id = $1',
      values: [req.decode.id],
    };
    if (req.decode.user_role === 'admin') {
      return res.status(403).json({
        message: 'Administrators are not allowed to create request',
        status: 'fail',
      });
    }
    pool.query(newQuery, (err, result) => {
      if (err) {
        return winston.log('error', err);
      }
      if (result.rows === null) {
        return res.status(401).json({
          message: 'You can\'t post and get request, please signup',
          status: 'fail',
        });
      }
      return done();
    });
    return null;
  }
  /**
   *@static: Method for checking if a request belong to a user before update
   *
   * @param {object} req request object
   * @param {object} res response object
   * @param {function} done callback function
   */
  static checkUserRequest(req, res, done) {
    const { requestId } = req.params;
    if (validate(requestId) === false) {
      winston.log('error', 'Invalid Id, please provide a valid uuid');
      return res.status(400).json({
        message: 'Invalid Id, please provide a valid uuid',
        status: 'error',
      });
    }
    const newQuery = {
      text: 'SELECT * FROM requests WHERE request_id = $1 AND user_id = $2 ',
      values: [requestId, req.decode.id],
    };
    pool.query(newQuery, (err, result) => {
      if (err) {
        return winston.log('error', err);
      }
      if (result.rows.length === 0) {
        return res.status(401).json({
          message: 'You can\'t edit a request that is not yours',
          status: 'fail',
        });
      }
      return done();
    });
    return null;
  }
  /**
   * @static: Method for checking the status of the request
   *
   * @param {object} req request object
   * @param {object} res response object
   * @param {function} done callback function
   */
  static checkRequestStatus(req, res, done) {
    const { requestId } = req.params;
    if (validate(requestId) === false) {
      winston.log('error', 'Invalid Id, please provide a valid uuid');
      return res.status(400).json({
        message: 'Invalid Id, please provide a valid uuid',
        status: 'error',
      });
    }
    const newQuery = {
      text: 'SELECT * FROM requests WHERE request_id = $1 AND currentStatus = $2',
      values: [requestId, 'pending'],
    };
    pool.query(newQuery, (err, result) => {
      if (err) {
        return winston.log('error', err);
      }
      if (result.rows.length === 0 && req.decode.user_role === 'admin') {
        return res.status(403).json({
          message: 'The status of this request has been changed, you can\'t approve or disapprove again, please check the status',
          status: 'fail',
        });
      }
      if (result.rows.length === 0) {
        return res.status(403).json({
          message: 'Admin has already looked into this request, Please check the current status of the request',
          status: 'fail',
        });
      }
      return done();
    });
    return null;
  }
  /**
   * @static: Method for checking if the supplied id exist in the database
   *
   * @param {object} req -request object
   * @param {object} res -response object
   * @param {function} done callback function
   */
  static checkRequestId(req, res, done) {
    const { requestId } = req.params;
    if (validate(requestId) === false) {
      winston.log('error', 'Invalid Id, please provide a valid uuid');
      return res.status(400).json({
        message: 'Invalid Id, please provide a valid uuid',
        status: 'error',
      });
    }
    const newQuery = {
      text: 'SELECT * FROM requests WHERE request_id = $1',
      values: [requestId],
    };
    pool.query(newQuery, (err, result) => {
      if (err) {
        return winston.log('error', err);
      }
      if (result === undefined) {
        return res.status(404).json({
          message: 'This request is not found in the database',
          status: 'fail',
        });
      }
      return done();
    });
    return null;
  }
  /**
   * @static: Method for checking the approved request before resolving
   *
   * @param {object} req request object
   * @param {object} res response object
   * @param {function} done callback function
   */
  static checkApproved(req, res, done) {
    const { requestId } = req.params;
    if (validate(requestId) === false) {
      winston.log('error', 'Invalid Id, please provide a valid uuid');
      return res.status(400).json({
        message: 'Invalid Id, please provide a valid uuid',
        status: 'error',
      });
    }
    const newQuery = {
      text: 'SELECT * FROM requests WHERE request_id = $1 AND currentStatus = $2',
      values: [requestId, 'approved'],
    };
    pool.query(newQuery, (err, result) => {
      if (err) {
        return winston.log('error', err);
      }
      if (result.rows.length === 0) {
        return res.status(403).json({
          message: 'This request has not been approved, Please check the current status of the request',
          status: 'fail',
        });
      }
      return done();
    });
    return null;
  }
}

export default ValidateDatabase;
