import dotenv from 'dotenv';
dotenv.config();

import httpServer from "./server"
import logger from './loggers/loggers';


const PORT:any = process.env.PORT || 8282

httpServer.listen(PORT,'0.0.0.0',()=>{
    logger.info(`server running on port ${PORT}`)
})

