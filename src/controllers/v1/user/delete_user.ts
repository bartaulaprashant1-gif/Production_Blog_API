import {logger} from "../../../lib/winston";

import User from "../../../models/user";

import type { Request, Response } from 'express';

const deleteCurrentUser = async (req: Request, res: Response): Promise<void> => {
    const userId = req.userId;
    try {
        await User.deleteOne({_id: userId});

        logger.info('A user accout has been deleted', {
            userId
        })
        res.sendStatus(204);
    } catch (error) {
        res.status(500).json({
            code: 'ServerError',
            message: 'Internal Server error',
            error: error,
        });

        logger.error('Error while deleting user', error);
    }
};

export default deleteCurrentUser;