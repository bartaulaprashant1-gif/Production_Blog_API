import { generateAccessToken, generateRefreshToken } from '../../../lib/jwt';
import { logger } from '../../../lib/winston';
import config from '../../../config/index';

import User from '../../../models/user';
import Token from '../../../models/token';

import type { Request, Response } from 'express';
import { IUser } from '../../../models/user';

type UserData = Pick<IUser, 'email' | 'password'>;

const login = async (req: Request, res: Response): Promise<void> => {
  try {
    const { email, password } = req.body as UserData;
    const user = await User.findOne({ email })
      .select('username email password role firstName lastName')
      .lean()
      .exec();

    if (!user) {
      res.status(404).json({
        code: 'Not Found',
        message: 'User not found',
      });
      return;
    }
    //Generate access and refresh token for new user
    const accessToken = generateAccessToken(user._id);
    const refreshToken = generateRefreshToken(user._id);

    //store refresh token in db
    await Token.create({ token: refreshToken, userId: user._id });
    logger.info('refresh token created for user ', {
      userId: user._id,
      token: refreshToken,
    });

    res.cookie('refreshToken', refreshToken, {
      httpOnly: true,
      secure: config.NODE_ENV === 'production',
      sameSite: 'strict',
    });

    res.status(201).json({
      user: {
        username: user.username,
        email: user.email,
        role: user.role,
        firstName: user.firstName,
        lastName: user.lastName,
      },
      accessToken: accessToken,
    });

    logger.info('User logged in successfully', {
      username: user.username,
      email: user.email,
      role: user.role,
      firstName: user.firstName,
      lastName: user.lastName,
    });
  } catch (error) {
    res.status(500).json({
      code: 'Server Error',
      message: 'Internal Server error',
      error: error,
    });
    logger.error('Error during user registration', error);
  }
};

export default login;
