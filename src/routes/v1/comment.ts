import { Router } from 'express';
import { body, param } from 'express-validator';

import authenticate from '../../middleware/authenticate';
import authorize from '../../middleware/authorize';
import validationError from '../../middleware/validationError';

import createComment from '../../controllers/v1/comment/create_comment';
import getCommentsByBlog from '../../controllers/v1/comment/get_comment_by_blog';
import deleteComment from '../../controllers/v1/comment/delete_comment';

const router = Router();

router.post(
  '/blog/:blogId',
  authenticate,
  authorize(['admin', 'user']),
  param('blogId').isMongoId().withMessage('Invalid blog Id'),
  body('content').trim().isEmpty().withMessage('Comment is required'),
  validationError,
  createComment,
);
router.get(
  '/blog/:blogId',
  authenticate,
  authorize(['admin', 'user']),
  param('blogId').isMongoId().withMessage('Invalid blog Id'),
  validationError,
  getCommentsByBlog,
);
router.delete(
  '/:commentId',
  authenticate,
  authorize(['admin']),
  param('commentId').isMongoId().withMessage('Invalid comment Id'),
  validationError,
  deleteComment,
);

export default router;
