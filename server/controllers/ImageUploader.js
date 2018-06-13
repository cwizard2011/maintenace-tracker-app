import imageUpload from '../helpers/fileUploader';
import pool from '../models/database';

/**
 * @class ImageController
 */
class ImageController {
  /**
   * Uploads a profile photo
   *
   * @static
   *
   * @param {Object} req - request object
   * @param {Object} res - response object
   *
   *
   *
   * @returns {void}
   */
  static async uploadImage(req, res) {
    try {
      if (!req.files) {
        res.status(400).json({
          message: 'No image was attached, please attach an image',
          status: 'fail',
        });
      } else {
        const updatedAt = new Date();
        const { image } = req.files;

        const { url } = await imageUpload(image);

        const query = {
          text: 'UPDATE userlist SET profile_img = $1, updated_at = $3 WHERE id = $2 RETURNING username, firstname, lastname, user_role, email, profile_img, created_at, updated_at',
          values: [url, req.decode.id, updatedAt],
        };
        pool.query(query, (err, result) => {
          const {
            firstname, email,
          } = result.rows[0];
          const updatedOn = result.rows[0].updated_at;
          const profileImage = result.rows[0].profile_img;
          return res.status(200).json({
            data: {
              firstname, email, profileImage, updatedOn,
            },
            message: 'Image uploaded successfully',
            status: 'success',
          });
        });
      }
    } catch (error) {
      if (error.http_code === 400) {
        res.status(400).json({
          error: error.message,
        });
      } else {
        res.sendStatus(500);
      }
    }
  }
  /**
   * Retrieve uploaded image
   *
   * @static
   *
   * @param {Object} req - request object
   * @param {Object} res - response object
   *
   *
   *
   * @returns {void}
   */
  static retrieveImage(req, res) {
    const query = {
      text: 'SELECT profile_img FROM userlist WHERE id = $1;',
      values: [req.decode.id],
    };
    pool.query(query, (err, response) => {
      if (response.rows[0].profile_img === null) {
        return res.status(200).json({
          message: 'Please upload a profile image',
          status: 'success',
        });
      }
      return res.status(200).json({
        data: response.rows[0],
        message: 'Profile image successfully retrieved',
        status: 'success',
      });
    });
  }
}

export default ImageController;
