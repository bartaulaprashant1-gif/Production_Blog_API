//Node modules 
import {Router} from 'express';

//Controllers 
import register from '../../controllers/v1/auth/register';

//Middleware 


//Models


const router = Router();

router.post('/register', register)


export default router;