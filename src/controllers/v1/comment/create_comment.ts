import DOMPurify from 'dompurify';
import { JSDOM } from 'jsdom';

import { logger } from '../../../lib/winston';

import type { Request, Response } from 'express';
import type {IComment} from "../../../models/comment"

import Blog from '../../../models/blog';
import Comment from '../../../models/comment';

type CommentData=Pick<IComment,'content'>

const window=new JSDOM('').window
const purify=DOMPurify(window)

const createComment = async (req: Request, res: Response): Promise<void> => {
  const {content}=req.body as CommentData
  const {blogId} = req.params;
  
  const userId= req.userId;

  try {
    const blog=await Blog.findById(blogId).select('_id commentsCount').exec();

    if(!blog){
      res.status(404).json({
        code: 'NotFound',
        message: 'Blog not found',
      })
      return;
    }

    const cleanContent=purify.sanitize(content);
    if(typeof blogId!=='string' || typeof userId!=='string'){
      res.status(400).json({
        code: 'BadRequest',
        message: 'Invalid blogId or userId',
      })
      return;
    }

    const newComment=await Comment.create({
      blogId,
      userId,
      content: cleanContent
    })

    logger.info('new comment created', newComment)
    blog.commentsCount++;
    await blog.save()

    logger.info('Blog comments counts updated', {
      blogId:blog._id,
      commentsCount:blog.commentsCount
    })

    res.status(201).json({
      comment:newComment
    })

  } catch (error) {
    res.status(500).json({
      code: 'ServerError',
      message: 'Internal Server error',
      error: error,
    });

    logger.error('Error during commenting in blog', error);
  }
};

export default createComment;
