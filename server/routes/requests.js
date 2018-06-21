import Requests from '../controllers/Requests';
import Validators from '../middleware/Validation';
import Authentication from '../helpers/Authentication';
import ValidateDatabase from '../middleware/ValidateDatabase';

const requestRoutes = (versionLink, app) => {
  app.get(
    `${versionLink}/users/requests`,
    Authentication.verifyToken,
    ValidateDatabase.checkUserId,
    Requests.getAllRequest,
  );
  app.get(
    `${versionLink}/users/requests/:requestId`,
    Authentication.verifyToken,
    ValidateDatabase.checkUserId,
    Requests.getRequestById,
  );
  app.post(
    `${versionLink}/users/requests`,
    Authentication.verifyToken,
    Validators.checkBody,
    ValidateDatabase.checkUserId,
    ValidateDatabase.checkRequest,
    Requests.createRequest,
  );
  app.put(
    `${versionLink}/users/requests/:requestId`,
    Authentication.verifyToken,
    Validators.editReqBody,
    ValidateDatabase.checkUserRequest,
    ValidateDatabase.checkRequestStatus,
    Requests.editRequest,
  );
  app.delete(
    `${versionLink}/users/requests/:requestId`,
    Authentication.verifyToken,
    ValidateDatabase.checkUserRequest,
    ValidateDatabase.checkRequestStatus,
    Requests.deleteRequest,
  );
};

export default requestRoutes;
