import { logger } from '../../../lib/winston';

import User from '../../../models/user';
import Blog from '../../../models/blog';

import type { Request, Response } from 'express';

import config from '../../../config/index';

interface QueryType {
    status?:'draft' | 'published'
}

const getBlogsBySlug = async (req: Request, res: Response): Promise<void> => {
  try {
    const userId=req.params.userId
    const currentUserId=req.userId

    const limit=parseInt(req.query.limit as string) || config.defaultResLimit;

    const offset=parseInt(req.query.offset as string) || config.defaultResOffset
    
    const currentUser=await User.findById(currentUserId).select('role').lean().exec();
    const query:QueryType={};
    //show only published post to a normal user
    if(currentUser?.role==='user'){
        query.status='published'
    }
    
    const total =await Blog.countDocuments({author:userId, ...query})
    const blogs=await Blog.find({author:userId, ...query}).select('-banner.publicId -__v').populate('author', '-createdAt -updatedAt -__v').limit(limit).skip(offset).sort({createdAt:-1}).lean().exec();

    res.status(200).json({
      limit,
      offset,
      total,
      blogs,
    });

  } catch (error) {
    res.status(500).json({
      code: 'ServerError',
      message: 'Internal Server error',
      error: error,
    });

    logger.error('Error while fetching blogs from the user', error);
  }
};

export default getBlogsBySlug;
