import mongoose from "mongoose";

import config from "../config/index";
import type { ConnectOptions } from "mongoose";


const clientOptions:ConnectOptions={
    dbName:'blog-db',
    appName:'Production_blog_api',
    serverApi:{
        version:'1',
        strict:true,
        deprecationErrors:true
    }
}

export const connectToDatabase= async(): Promise<void> =>{
    if(!config.MONGO_URI){
        throw new Error('Mongo URI is not defined in the configuration')
    }

    try {
        await mongoose.connect(config.MONGO_URI, clientOptions);
        console.log('Connected successfully to database', {
            uri: config.MONGO_URI,
            options: clientOptions
        })
    } catch (error) {
        if(error instanceof Error){
            throw error;
        }
        console.log('Error connecting to database', error) 
    }
}

//Disconnect from mongoDB database using mongoose 
export const disconnectFromDatabase=async():Promise<void>=>{
    try {
        await mongoose.disconnect();
        console.log('Disconnected from database', {
            uri: config.MONGO_URI,
            options: clientOptions
        })
    } catch (error) {
        if(error instanceof Error){
            throw new Error(error.message);
        }
        console.log('Error disconnecting from database', error)
    }
}