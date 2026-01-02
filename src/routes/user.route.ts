import { Router } from 'express';
import { addUser, login } from '../controllers/user.controller';
import { authorize } from '../controllers/validate-token.controller';

const router = Router();

router.post('/', addUser);
router.post('/login', login);
router.get('/authorize', authorize);

export default router;
