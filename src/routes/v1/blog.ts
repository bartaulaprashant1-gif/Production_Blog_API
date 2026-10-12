import { Router } from 'express';
import { param, query, body } from 'express-validator';
import multer from 'multer';

import authenticate from '../../middleware/authenticate';
import validationError from '../../middleware/validationError';
import authorize from '../../middleware/authorize';
import uploadBlogBanner from '../../middleware/uploadBlogBanner';

import createBlog from '../../controllers/v1/blog/create_blog';
import getAllBlogs from '../../controllers/v1/blog/get_all_blogs';
import getBlogsByUser from '../../controllers/v1/blog/get_blogs_by_user';
import getBlogsBySlug from '../../controllers/v1/blog/get_blogs_by_slug';

const upload = multer();

const router = Router();

router.post(
  '/',
  authenticate,
  authorize(['admin']),
  upload.single('banner_image'),
  body('title')
    .trim()
    .notEmpty()
    .withMessage('Title is required')
    .isLength({ max: 180 })
    .withMessage('Title must be less than 180 characters'),
  body('content').trim().notEmpty().withMessage('Content is required'),
  body('status')
    .optional()
    .isIn(['draft', 'published'])
    .withMessage('Status must be in draft or published'),
  validationError,
  uploadBlogBanner('post'),
  createBlog,
);
router.get(
  '/',
  authenticate,
  authorize(['admin', 'user']),
  query('limit')
    .optional()
    .isInt({ min: 1, max: 50 })
    .withMessage('limit must be between 1 and 50'),
  query('offset')
    .optional()
    .isInt({ min: 0 })
    .withMessage('offset must be a positive number'),
  validationError,
  getAllBlogs,
);
router.get(
  '/user/:userId',
  authenticate,
  authorize(['admin', 'user']),
  param('userId').isMongoId().withMessage('Invalid user Id'),
  query('limit')
    .optional()
    .isInt({ min: 1, max: 50 })
    .withMessage('limit must be between 1 and 50'),
  query('offset')
    .optional()
    .isInt({ min: 0 })
    .withMessage('offset must be a positive number'),
  validationError,
  getBlogsByUser,
);
router.get(
  '/:slug',
  authenticate,
  authorize(['admin', 'user']),
  param('slug').notEmpty().withMessage('Slug is required'),
  validationError,
  getBlogsBySlug
);

export default router;
