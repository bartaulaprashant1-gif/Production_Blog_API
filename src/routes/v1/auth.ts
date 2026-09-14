//Node modules
import { Router } from 'express';
import { body } from 'express-validator';

//Controllers
import register from '../../controllers/v1/auth/register';

//Middleware
import validationError from '../../middleware/validationError';

//Models
import User from '../../models/user';


const router = Router();

router.post(
  '/register',
  body('email')
    .trim()
    .notEmpty()
    .withMessage('Email is required')
    .isLength({ max: 50 })
    .withMessage('Email must be less than 50 characters')
    .isEmail()
    .withMessage('Invalid email address, try again')
    .custom(async (email) => {
      const userExists=await User.exists({email});
      if(userExists){
        throw new Error('User with this email already exists');
      }
    }),
  body('password')
    .trim()
    .notEmpty() 
    .withMessage('Password is required')
    .isLength({ max: 15, min: 8 })
    .withMessage('Password must be less than 15 and more than 8 characters'),
  body('role')
    .trim()
    .optional()
    .isString()
    .withMessage('Role must be a string')
    .isIn(['admin', 'user'])
    .withMessage('Role must be either admin or user'),
  validationError,
  register,
);

export default router;
