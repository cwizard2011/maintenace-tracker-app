import cloudinary from 'cloudinary';
import fs from 'fs';
import del from 'del';

import '../../config/cloudinaryConfig';

/**
 * Uploads image to Cloudinary
 *
 * @param {Object} image - File to be upload
 *
 * @returns {Object} - uploaded file information
 */
const imageUpload = async (image) => {
  const uploadDir = 'server/uploads';

  if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir);
  }

  await image.mv(`${uploadDir}/${image.name}`);

  const uploadedImage = await cloudinary
    .v2.uploader.upload(`${uploadDir}/${image.name}`);

  await del(['server/uploads/**']);

  return uploadedImage;
};

export default imageUpload;
