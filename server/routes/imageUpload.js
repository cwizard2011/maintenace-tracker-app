import ImageController from '../controllers/ImageUploader';
import Authentication from '../helpers/Authentication';

const imageRoutes = (versionLink, app) => {
  app.put(
    `${versionLink}/users/profile/image`,
    Authentication.verifyToken,
    ImageController.uploadImage,
  );
};

export default imageRoutes;
