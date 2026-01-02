import { Router } from 'express';
import { getByUser } from '../controllers/setting.controller';
import { validateToken } from '../controllers/validate-token.controller';

const routerSetting = Router();

routerSetting.get('/getByUser', validateToken, getByUser);

export default routerSetting;
