/**
 * This file contains all the loggers
 */

import winston from "winston"
const {combine,timestamp,json,prettyPrint} = winston.format



const logger = winston.createLogger({
  level:"info",
  format:combine(
    json(),
    timestamp(),
    prettyPrint(),
  ),
  defaultMeta: { service:"server" },
  transports:[
    new winston.transports.Console()
  ]
})



export default logger


