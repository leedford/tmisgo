import dotenv from 'dotenv';
dotenv.config();

import httpServer from "./server"


const PORT:any = process.env.PORT || 8282

httpServer.listen(PORT,'0.0.0.0',()=>{
    console.log(`sever running on port ${PORT}`)
})

