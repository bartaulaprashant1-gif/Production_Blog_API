import { logger } from '../../../lib/winston';

import type { Request, Response } from 'express';

import Like from '../../../models/like';
import Blog from '../../../models/blog';


const unlikeBlog = async (req: Request, res: Response): Promise<void> => {
  const { blogId }=req.params;
  const {userId}=req.body;
  try {
   const existingLike=await Like.findOne({blogId, userId}).lean().exec();   
   if(!existingLike){
    res.status(400).json({
      code: 'BadRequest',
      message: 'You have not liked this blog',
    })
    return; 
   }

   await Like.deleteOne({_id:existingLike._id});

   const blog=await Blog.findById(blogId).select('likesCount').exec();
   if(!blog){
    res.status(404).json({
      code: 'NotFound',
      message: 'Blog not found',
    })
    return;
   }

   blog.likesCount--;
   await blog.save();
   logger.info('Blog unliked', {
    blogId:blog._id,
    userId,
    likesCount:blog.likesCount
   });
   res.sendStatus(204);

  } catch (error) {
    res.status(500).json({
      code: 'ServerError',
      message: 'Internal Server error',
      error: error,
    });

    logger.error('Error while unliking  blog', error);
  }
};

export default unlikeBlog;
