import {Router} from 'express';

const router=Router();

router.use('/', (req, res)=>{
    res.status(400).json({
        message: "Api is live",
        status:'ok',
        version:'1.0.0',
        docs:"https://docs.blog-api.codewithsadee.com",
        timestamp: new Date().toISOString()
    })
} )

export default router;