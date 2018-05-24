import Requests from '../controllers/Requests';
import Validator from '../middleware/Validation';
import Authentication from '../helpers/Auth';
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
    Validator.checkBody,
    ValidateDatabase.checkUserId,
    ValidateDatabase.checkRequest,
    Requests.createRequest,
  );
  app.put(
    `${versionLink}/users/requests/:requestId`,
    Authentication.verifyToken,
    Validator.checkBody,
    ValidateDatabase.checkUserId,
    Requests.editRequest,
  );
};

export default requestRoutes;
