import { Client } from 'pg';
import dotenv from 'dotenv';
import winston from 'winston';
import requests from '../db/data';

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
        message: 'This request does not belong to you',
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
    try {
      const {
        title,
        details,
        status,
      } = req.body;
      const requestId = parseInt(req.params.requestId, 10);
      const existingRequest = requests.filter(edit => edit.requestId === requestId)[0];
      if (!existingRequest) {
        res.status(404).json({
          data: {},
          message: 'This request does not exist in the database',
          status: 'fail',
        });
      } else {
        existingRequest.title = title;
        existingRequest.details = details;
        existingRequest.status = status;
        res.status(200).json({
          data: {
            existingRequest,
          },
          message: 'Request edited',
          status: 'success',
        });
      }
    } catch (error) {
      res.status(500).json({
        data: {},
        message: 'Oops! my bad, error from the server',
        status: 'error',
      });
    }
  }
}

export default Requests;
