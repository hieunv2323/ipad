import { Router } from 'express';
import { RegistrationController } from '../controllers/registration.controller';

const router = Router();

router.post('/registrations', RegistrationController.register);
router.get('/registrations', RegistrationController.list);
router.post('/registrations/login', RegistrationController.login);

export default router;
