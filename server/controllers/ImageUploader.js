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
          error: 'No image was uploaded',
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
}

export default ImageController;
