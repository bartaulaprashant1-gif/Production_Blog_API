import winston from 'winston';

import config from '../config/index';


const {combine, timestamp, json, errors, align , printf, colorize}=winston.format;

//define transport arrays to hold different logging transports
const transports:winston.transport[]=[];

//If the application is not running in production, add a console transport 
if(config.NODE_ENV!=="production"){
    transports.push(
        new winston.transports.Console({
            format: combine(
                colorize({all:true}), //colorize the output
                timestamp({format: 'YYYY-MM-DD HH:mm:ss'}), //add timestamp to the output
                align(),
                printf(({timestamp, level, message, ...meta})=>{
                    const metaStr=Object.keys(meta).length ? `\n${JSON.stringify(meta)}` : '';

                    return `${timestamp} [${level.toUpperCase()}] : ${message}${metaStr}`;
                })
            )
        })
    )
}

//create a logger instance using winston 
const logger= winston.createLogger({
    level:config.LOG_LEVEL || 'info',
    format: combine(timestamp(), errors({stack: true}), json()), //use json format for log messages
    transports,
    silent: config.NODE_ENV==='test' //disable loggin in test environment

})

export {logger};