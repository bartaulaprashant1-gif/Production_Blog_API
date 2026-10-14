import { logger } from '../../../lib/winston';

import type { Request, Response } from 'express';

import Like from '../../../models/like';
import Blog from '../../../models/blog';


const likeBlog = async (req: Request, res: Response): Promise<void> => {
  const { blogId }=req.params;
  const {userId}=req.body;
  try {
    const blog=await Blog.findById(blogId).select('likesCount').exec();
    
    if(!blog){
      res.status(404).json({
        code: 'NotFound',
        message: 'Blog not found',
      })
      return;
    }
    const existingLike=await Like.findOne({blogId, userId}).lean().exec();
    if(existingLike){
      res.status(400).json({
        code: 'BadRequest',
        message: 'You have already liked this blog',
      })
      return; 
    }
    if(typeof blogId!=='string' || typeof userId!=='string'){
      res.status(400).json({
        code: 'BadRequest',
        message: 'Invalid blogId or userId',
      })
      return;
    }

    await Like.create({ blogId , userId })
    blog.likesCount++;
    await blog.save();

    logger.info('blog liked successfully', {
      userId, blogId:blog._id, likesCount:blog.likesCount
    })
    res.status(200).json({
      likesCount:blog.likesCount
    })

  } catch (error) {
    res.status(500).json({
      code: 'ServerError',
      message: 'Internal Server error',
      error: error,
    });

    logger.error('Error while liking blog', error);
  }
};

export default likeBlog;
