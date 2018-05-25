import dotenv from 'dotenv';
import { Client } from 'pg';

dotenv.config();
const connectionString = process.env.DATABASE_URL;

/**
* Checks the database for existing requests
*
* @class: Checks all requests
*/
class ValidateDatabase {
  /**
   * Checks if a User exists in the database
   *
   * @static method for validating username and email
   *
   * @param {object} req - Request object
   * @param {object} res -  Response object
   *
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
    const client = new Client(connectionString);
    client.connect();
    client.query(newQuery, (error, result) => {
      client.end();
      if (result.rows[0]) {
        return res.status(409).json({
          message: 'User already exist, pls sign in with your username and password',
          status: 'fail',
        });
      }
      return done();
    });
  }
  static checkRequest(req, res, done) {
    const { title } = req.body;
    const newQuery = {
      text: 'SELECT * FROM requests WHERE title = $1 AND user_id = $2',
      values: [title, req.decode.id],
    };
    const client = new Client(connectionString);
    client.connect();
    client.query(newQuery, (err, result) => {
      client.end();
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
   * Checks the database if the user Id exist
   *
   * @param {*} req -request object
   * @param {*} res - response object
   * @param {*} done - callback function to call on the next middleware
   *
   */
  static checkUserId(req, res, done) {
    const newQuery = {
      text: 'SELECT * FROM userlist WHERE id = $1',
      values: [req.decode.id],
    };
    const client = new Client(connectionString);
    client.connect();
    client.query(newQuery, (err, result) => {
      client.end();
      if (result.rows[0].length === 0) {
        return res.status(401).json({
          message: 'You can\'t post and get request, please signup',
          status: 'fail',
        });
      }
      return done();
    });
  }
  /**
   *Check if a request belong to a user before update

   * @param {object} req request object
   * @param {object} res response object
   * @param {function} done callback function
   */
  static checkUserRequest(req, res, done) {
    const { requestId } = req.params;

    const newQuery = {
      text: 'SELECT * FROM requests WHERE id = $1 AND user_id = $2 ',
      values: [requestId, req.decode.id],
    };
    const client = new Client(connectionString);
    client.connect();
    client.query(newQuery, (err, result) => {
      client.end();
      if (result.rows.length === 0) {
        return res.status(401).json({
          message: 'You can\'t edit a request that is not yours',
          status: 'fail',
        });
      }
      return done();
    });
  }
  /**
   * Check the status of the request
   *
   * @param {object} req request object
   * @param {object} res response object
   * @param {function} done callback function
   */
  static checkRequestStatus(req, res, done) {
    const { requestId } = req.params;
    const newQuery = {
      text: 'SELECT * FROM requests WHERE id = $1 AND currentStatus = $2',
      values: [requestId, 'new'],
    };
    const client = new Client(connectionString);
    client.connect();
    client.query(newQuery, (err, result) => {
      client.end();
      if (result.rows.length === 0) {
        return res.status(403).json({
          message: 'Admin has already looked into this request, Please check the current status of the request',
          status: 'fail',
        });
      }
      return done();
    });
  }
  /**
   * Checks if the supplied id exist in the database
   *
   * @static
   *
   * @param {object} req -request object
   * @param {object} res -response object
   * @param {function} done callback function
   */
  static checkRequestId(req, res, done) {
    const { requestId } = req.params;
    const newQuery = {
      text: 'SELECT * FROM requests WHERE id = $1',
      values: [requestId],
    };
    const client = new Client(connectionString);
    client.connect();
    client.query(newQuery, (err, result) => {
      client.end();
      if (result === undefined) {
        return res.status(404).json({
          message: 'This request is not found in the database',
          status: 'fail',
        });
      }
      return done();
    });
  }
  /**
   * Check the approved request before resolving
   *
   * @param {object} req request object
   * @param {object} res response object
   * @param {function} done callback function
   */
  static checkApproved(req, res, done) {
    const { requestId } = req.params;
    const newQuery = {
      text: 'SELECT * FROM requests WHERE id = $1 AND currentStatus = $2',
      values: [requestId, 'approved'],
    };
    const client = new Client(connectionString);
    client.connect();
    client.query(newQuery, (err, result) => {
      client.end();
      if (result.rows.length === 0) {
        return res.status(403).json({
          message: 'This request has not been approved, Pls check the current status of the request',
          status: 'fail',
        });
      }
      return done();
    });
  }
}


export default ValidateDatabase;
