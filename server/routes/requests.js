import Requests from '../controllers/Requests';
import Validator from '../middleware/request';

const requestRoutes = (version, app) => {
  app.get(`${version}/users/requests`, Requests.getAllRequest);
  app.get(`${version}/users/requests/:requestId`, Validator.checkReqId, Requests.getRequestById);
};

export default requestRoutes;
