import {logger} from "../../../lib/winston";
import config from "../../../config/index";
import Token from "../../../models/token";

import type {Request, Response} from "express";



const logout = async (req: Request, res: Response): Promise<void> => {
  try {
    const refreshToken=req.cookies.refreshToken as string;

    if(refreshToken){
      await Token.deleteOne({token:refreshToken});
      logger.info('refresh token deleted for user ', {
        userId: req.userId,
        token: refreshToken
      })
    }

    res.clearCookie('refreshToken', {
      httpOnly: true,
      secure: config.NODE_ENV === 'production',
      sameSite: 'strict',
    })
    res.sendStatus(204);

    logger.info('User logged out successfully', {
      userId: req.userId
    })
  } catch (error) {
    res.status(500).json({
      code: 'Server Error',
      message: 'Internal Server error',
      error: error,
    });
    logger.error('Error during logout', error);
  }
};

export default logout;