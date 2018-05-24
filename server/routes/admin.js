import RequestController from '../controllers/Admin';
import Authentication from '../helpers/Auth';
import isAdmin from '../middleware/isAdmin';

const adminRoutes = (versionLink, app) => {
  app.get(
    `${versionLink}/requests`,
    Authentication.verifyToken,
    isAdmin,
    RequestController.getAllRequest,
  );
};

export default adminRoutes;
