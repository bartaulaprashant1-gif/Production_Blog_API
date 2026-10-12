import {logger} from "../lib/winston";
import uploadToCloudinary from "../lib/cloudinary";

import {Request, Response, NextFunction} from "express";
import type {UploadApiErrorResponse} from "cloudinary";

import {IBlog} from "../models/blog";

import Blog from "../models/blog";

const MAX_FILE_SIZE=2*1024*1024//2mb

const uploadBlogBanner=(method:'post' | 'put')=>{
    return async(req:Request, res:Response, next:NextFunction)=>{
        if(method==='put' && !req.file){
            next()
            return
        }
        if(!req.file){
            res.status(400).json({
                code:'ValidationError',
                message:'Blog banner is required'
            })
            return
        }
        if(req.file.size > MAX_FILE_SIZE){
            res.status(400).json({
                code:'ValidationError',
                message:'Blog banner size must be less than 2mb'
            })
            return
        }

        try {
            // const {blogId}=req.params;
            // const blog=await Blog.findById(blogId).select('banner.publicId').exec()

            const data=await uploadToCloudinary(
                req.file.buffer, 
                // blog?.banner.publicId.replace('blog-api/', '')
            )

            if(!data){
                res.status(500).json({
                    code:'ServerError',
                    message:'Internal Server error',
                })
                logger.error('Error while uploading blog banner to cloudinary', {
                    // blogId,
                    // publicId:blog?.banner.publicId
                })
                return
            }

            const newBanner={
                publicId:data.public_id,
                url:data.secure_url,
                width:data.width,
                height:data.height
            }

            logger.info('Blog banner uploaded to cloudinary', {
                // blogId, 
                banner:newBanner
            })

            req.body.banner=newBanner
            next()
            
        } catch (err:UploadApiErrorResponse | any) {
            res.status(err.http_code).json({
                code: err.http_code < 500 ? 'ValidationError': err.name,
                message: err.message
            })

            logger.error('Error while uploading blog banner to cloudinary',err)
        }
    }
}

export default uploadBlogBanner
