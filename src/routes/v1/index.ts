import {Router} from 'express';

const router=Router();

//Routes 
import authRoutes from './auth';
import userRoutes from './user';

router.get('/', (req, res)=>{
    res.status(400).json({
        message: "Api is live",
        status:'ok',
        version:'1.0.0',
        docs:"https://docs.blog-api.codewithsadee.com",
        timestamp: new Date().toISOString()
    })
} )
router.use('/auth', authRoutes);
router.use('/users', userRoutes);

export default router;