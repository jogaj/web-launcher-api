import { Router } from 'express';
import multer from 'multer';
import {
	add,
	get,
	getAll,
	remove,
	update,
} from '../controllers/application.controller';
import { validateToken } from '../controllers/validate-token.controller';

const routerApplication = Router();

const upload = multer({
	storage: multer.memoryStorage(),
	limits: { fileSize: 20 * 1024 * 1024 },
}); // 20MB limit

routerApplication.get('/all', validateToken, getAll);
routerApplication.delete('/delete/:id', validateToken, remove);
routerApplication.post('/add', validateToken, upload.single('image'), add);
routerApplication.put(
	'/update/:id',
	validateToken,
	upload.single('image'),
	update,
);
routerApplication.get('/get/:id', validateToken, get);

export default routerApplication;
