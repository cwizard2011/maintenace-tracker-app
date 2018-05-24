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
  static checkUserId(req, res, done) {
    const newQuery = {
      text: 'SELECT * FROM userlist WHERE id = $1',
      values: [req.decode.id],
    };
    const client = new Client(connectionString);
    client.connect();
    client.query(newQuery, (err, result) => {
      client.end();
      if (result === undefined) {
        return res.status(401).json({
          message: 'You can\'t post and get request, please login',
          status: 'fail',
        });
      }
      return done();
    });
  }
}


export default ValidateDatabase;
