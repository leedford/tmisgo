import { asyncGetData } from "../utils/asyncStorageHelpers"
import { storageKeys } from "../constants/storageKeys";

export const getAuthToken=async()=>{
    const token = await asyncGetData(storageKeys.TOKEN)
    return token?.value


}