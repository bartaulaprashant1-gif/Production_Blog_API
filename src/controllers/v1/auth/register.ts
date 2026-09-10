import { logger } from '../../../lib/winston';
import config from '../../../config/index';
import { genUsername } from '../../../utils/index';
import { generateAccessToken, generateRefreshToken } from '../../../lib/jwt';

import User from '../../../models/user';

import type { Request, Response } from 'express';
import type { IUser } from '../../../models/user';
import Token from '../../../models/token';

type UserData = Pick<
  IUser,
  'email' | 'password' | 'role' | 'firstName' | 'lastName'
>;

const register = async (req: Request, res: Response): Promise<void> => {
  const { email, password, role, firstName, lastName } = req.body as UserData;
  try {
    const username = genUsername();
    const newUser = await User.create({
      username,
      email,
      password,
      role,
      firstName,
      lastName,
    });

    //Generate access and refresh token for new user
    const accessToken = generateAccessToken(newUser._id);
    const refreshToken = generateRefreshToken(newUser._id);

    //store refresh token in db
    await Token.create({token:refreshToken, userId:newUser._id});
    logger.info("refresh token created for user ", {
      userId: newUser._id,
      token:refreshToken
    })

    res.cookie('refreshToken', refreshToken, {
      httpOnly: true,
      secure: config.NODE_ENV === 'production',
      sameSite: 'strict',
    });

    res.status(201).json({
      user: {
        username: newUser.username,
        email: newUser.email,
        role: newUser.role,
        firstName: newUser.firstName,
        lastName: newUser.lastName,
      },
      accessToken:accessToken,
      message: 'User registered successfully',
      status: 'ok',
      version: '1.0.0',
      docs: 'https://docs.blog-api.codewithsadee.com',
      timestamp: new Date().toISOString(),
    });

    logger.info('User registered successfully', {
      username: newUser.username,
      email: newUser.email,
      role: newUser.role,
      firstName: newUser.firstName,
      lastName: newUser.lastName,
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

export default register;
