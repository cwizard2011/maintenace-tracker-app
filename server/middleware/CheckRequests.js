import dotenv from 'dotenv';
import { Client } from 'pg';

dotenv.config();
const connectionString = process.env.DATABASE_URL;

/**
* Checks the database for existing requests
*
* @class: Checks all requests
*/
class CheckRequests {
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
    const query = {
      text: 'SELECT * FROM userlist WHERE username = $1 OR email = $2',
      values: [username, email],
    };
    const client = new Client(connectionString);
    client.connect();
    client.query(query, (error, result) => {
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
}


export default CheckRequests;
