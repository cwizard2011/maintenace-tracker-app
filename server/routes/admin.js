import RequestController from '../controllers/Admin';
import Authentication from '../helpers/Auth';
import ValidateDatabase from '../middleware/ValidateDatabase';
import isAdmin from '../middleware/isAdmin';

const adminRoutes = (versionLink, app) => {
  app.get(
    `${versionLink}/requests`,
    Authentication.verifyToken,
    isAdmin,
    RequestController.getAllRequest,
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
};

export default adminRoutes;
