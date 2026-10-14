import { Router } from 'express';
import { body, param } from 'express-validator';

import authenticate from '../../middleware/authenticate';
import authorize from '../../middleware/authorize';
import validationError from '../../middleware/validationError';

import likeBlog from '../../controllers/v1/like/like_blog';
import unlikeBlog from '../../controllers/v1/like/unlike_blog';

const router = Router();

router.post(
  '/blog/:blogId',
  authenticate,
  authorize(['admin', 'user']),
  param('blogId').isMongoId().withMessage('Invalid blog Id'),
  body('userId')
    .notEmpty()
    .withMessage('User Id is required')
    .isMongoId()
    .withMessage('Invalid user Id'),
  validationError,
  likeBlog,
);
router.delete(
  '/blog/:blogId',
  authenticate,
  authorize(['admin', 'user']),
  param('blogId').isMongoId().withMessage('Invalid blog Id'),
  body('userId')
    .notEmpty()
    .withMessage('User Id is required')
    .isMongoId()
    .withMessage('Invalid user Id'),
  validationError,
  unlikeBlog,
);
export default router;
