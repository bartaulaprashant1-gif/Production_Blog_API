/**
 * @copyright 2026 Prashant Bartaula
 * @license Apache-2.0
 */

/**
 * node modules
 */
import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import compression from 'compression';
import helmet from 'helmet';

/**
 *  Custom modules
*/
import config from './config/index';
import limiter from './lib/express_rate_limits';

/**
 * Types
 */
import type {CorsOptions} from 'cors'

/**
 * Router
 */
import v1Routes from './routes/v1/index'


const app = express();

//Configure cors options
const corsOptions:CorsOptions={
    origin(origin, callback){
        if(config.NODE_ENV==='development' || !origin || config.WHITELIST_ORIGINS.includes(origin)){
            callback(null , true);
        }else{
            //Reject request from non whitelisted origins
            callback(new Error(`Cors Error: ${origin} is not allowed by CORS`), false)
        }
    },
}   

//apply cors middleware
app.use(cors(corsOptions))

//enable JSON request body parsing 
app.use(express.json());

//Enable URL-encoded request body parsing with extended mode 
//'extended:true' allows rich objects and arrays via querystring library 
app.use(express.urlencoded({extended:true}))

app.use(cookieParser());

//enable response compression to reduce payload size and improve performance 
app.use(compression({
    threshold: 1024, //only compress reponse larger than 1KB 
}))

//use helmet to enhance security by setting various http headers 
app.use(helmet());

//apply rate limiting middleware to prevent excessive requests and enhance security
app.use(limiter);


//Immediately invoke async function expression to start the server.

 try{
    app.use('/api/v1', v1Routes);
     
     app.listen(config.PORT, () => {
       console.log(`Server is running on: http://localhost:${config.PORT}`);
     });
 }catch(err){
    console.log('Failed to start the server', err);

    if(config.NODE_ENV==='production'){
        process.exit(1);
    }
 }


 const handleServerShutdown= async() =>{
    try{
        console.log(`Server shutdown`)
        process.exit(0)
    }catch(err){
        console.log('Failed to shutdown the server', err);
        process.exit(1);
    }
 }


 process.on("SIGTERM", handleServerShutdown);
 process.on("SIGINT", handleServerShutdown);