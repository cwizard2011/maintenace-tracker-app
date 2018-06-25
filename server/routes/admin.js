import RequestController from '../controllers/Admin';
import Authentication from '../helpers/Authentication';
import ValidateDatabase from '../middleware/ValidateDatabase';
import Validator from '../middleware/Validation';
import isAdmin from '../middleware/isAdmin';
import UserControllers from '../controllers/User';

const adminRoutes = (versionLink, app) => {
  app.get(
    `${versionLink}/requests`,
    Authentication.verifyToken,
    isAdmin,
    Validator.checkQueries,
    RequestController.getAllRequest,
  );
  app.get(
    `${versionLink}/users`,
    Authentication.verifyToken,
    isAdmin,
    RequestController.getUsers,
  );
  app.put(
    `${versionLink}/requests/:requestId/approve`,
    Authentication.verifyToken,
    isAdmin,
    ValidateDatabase.checkRequestId,
    ValidateDatabase.checkRequestStatus,
    RequestController.approveRequest,
  );
  app.put(
    `${versionLink}/requests/:requestId/disapprove`,
    Authentication.verifyToken,
    isAdmin,
    ValidateDatabase.checkRequestId,
    ValidateDatabase.checkRequestStatus,
    RequestController.rejectRequest,
  );
  app.put(
    `${versionLink}/requests/:requestId/resolve`,
    Authentication.verifyToken,
    isAdmin,
    ValidateDatabase.checkRequestId,
    ValidateDatabase.checkApproved,
    RequestController.resolveRequest,
  );
  app.put(
    `${versionLink}/requests/:requestId/reset`,
    Authentication.verifyToken,
    isAdmin,
    ValidateDatabase.checkRequestId,
    ValidateDatabase.checkPending,
    RequestController.resetRequest,
  );
  app.put(
    `${versionLink}/user/role/:userId/update`,
    Authentication.verifyToken,
    isAdmin,
    UserControllers.updateUserRole,
  );
};

export default adminRoutes;
