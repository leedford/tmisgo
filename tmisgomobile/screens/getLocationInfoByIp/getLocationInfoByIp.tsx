/***
 * This Method gets a users public IP address by making a request to
 * ipify.org
 */

import axios from "axios";
import { IPinfoDataType } from "../../types/types";
const IPINFO_TOKEN = "68da361b919aa5"

const getLocationInfoByIP=async():Promise<{info:IPinfoDataType | undefined,isError:boolean}>=>{
    try {

      const result =  await axios.get('https://api.ipify.org?format=json')


      const {data} =  await axios.get(`https://ipinfo.io/${result.data.ip}?token=${IPINFO_TOKEN}`)

      const info:IPinfoDataType = data
      return {
            info,
            isError:false
           }  
        
    } catch (error) {
        console.log(error)
        return {
         info:undefined,
         isError:true
        }

    }

}

export default getLocationInfoByIP