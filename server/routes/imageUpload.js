import ImageController from '../controllers/ImageUploader';
import Authentication from '../helpers/Authentication';

const imageRoutes = (versionLink, app) => {
  app.put(
    `${versionLink}/users/profile/image`,
    Authentication.verifyToken,
    ImageController.uploadImage,
  );
  app.get(
    `${versionLink}/users/profile/image`,
    Authentication.verifyToken,
    ImageController.retrieveImage,
  );
};

export default imageRoutes;
