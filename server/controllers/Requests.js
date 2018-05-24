import { Client } from 'pg';
import dotenv from 'dotenv';
import winston from 'winston';

dotenv.config();

const connectionString = process.env.DATABASE_URL;

/**
 * Contoller for users request
 *
 * @class a request controller
 *
 */
class Requests {
  /**
   * Method to get all requests
   *
   * @static method to get All Requests
   *
   * @param {Object} req - request object
   * @param {Object} res - response object
   *
   * @returns {Object} return object as response
   *
  */

  static getAllRequest(req, res) {
    const client = new Client(connectionString);
    client.connect();
    const query = {
      text: 'SELECT * FROM requests WHERE user_id = $1',
      values: [req.decode.id],
    };
    client.query(query, (err, result) => {
      client.end();
      if (err) {
        return winston.log(err.stack);
      } else if (result.rows.length > 0) {
        return res.status(200).json({
          data: result.rows,
          message: 'Requests found',
          status: 'success',
        });
      }
      return res.status(404).json({
        message: 'No request for this user',
        status: 'fail',
      });
    });
  }
  /**
   * Get request by Id
   *
   * @static method to get requests by Id
   *
   * @param {Object} req - request object
   * @param {Object} res - response object
   *
   * @returns {Object} return object as response
   *
  */
  static getRequestById(req, res) {
    const { requestId } = req.params;
    const client = new Client(connectionString);
    client.connect();
    const query = {
      text: 'SELECT * FROM requests WHERE id = $1 AND user_id = $2',
      values: [requestId, req.decode.id],
    };
    client.query(query, (err, result) => {
      client.end();
      if (err) {
        return winston.log(err.stack);
      } else if (result.rows[0]) {
        return res.status(200).json({
          data: result.rows,
          message: 'Requests found',
          status: 'success',
        });
      }
      return res.status(404).json({
        message: 'you can\'t get a request that does not belong to you',
        status: 'fail',
      });
    });
  }
  static createRequest(req, res) {
    const client = new Client(connectionString);
    client.connect();
    const { title, details } = req.body;
    const query = {
      text: 'INSERT INTO requests(title, details, user_id) VALUES ($1, $2, $3) RETURNING *',
      values: [title, details, req.decode.id],
    };
    client.query(query, (err, response) => {
      client.end();
      if (err) {
        return res.status(500).json({
          data: { err },
          message: 'Request not created',
          status: 'error',
        });
      } return res.status(201).json({
        data: {
          request: {
            id: response.rows[0].id,
            userId: req.decode.id,
            status: response.rows[0].currentStatus,
            title,
            details,
          },
        },
        message: 'Request created successfully',
        status: 'success',
      });
    });
  }
  /**
   *Edit requests by Id
   *
   * @static editRequest method
   *
   * @param {Object} req - request object
   * @param {Object} res - response object
   *
   * @returns {Object} res
   *
  */
  static editRequest(req, res) {
    const client = new Client(connectionString);
    client.connect();
    const { requestId } = req.params;
    const { title, details } = req.body;
    const query = {
      text: 'UPDATE requests SET title = $1, details = $2 WHERE id = $3 AND user_id = $4',
      values: [title, details, requestId, req.decode.id],
    };
    client.query(query, (err, result) => {
      client.end();
      if (err) {
        return winston.log(err.stack);
      } else if (result) {
        return res.status(200).json({
          message: 'Update successful',
          status: 'success',
        });
      }
      return res.status(404).json({
        message: 'Request not found in the database',
        status: 'fail',
      });
    });
  }
}

export default Requests;
