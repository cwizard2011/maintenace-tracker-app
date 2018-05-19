import Requests from '../controllers/Requests';
import Validator from '../middleware/Validation';

const requestRoutes = (versionLink, app) => {
  app.get(`${versionLink}/users/requests`, Requests.getAllRequest);
  app.get(`${versionLink}/users/requests/:requestId`, Validator.checkReqId, Requests.getRequestById);
  app.post(`${versionLink}/users/requests`, Validator.checkBody, Validator.checkIds, Validator.checkStatus, Requests.createRequest);
  app.put(`${versionLink}/users/requests/:requestId`, Validator.checkBody, Validator.checkIds, Validator.checkStatus, Requests.editRequest);
};

export default requestRoutes;
