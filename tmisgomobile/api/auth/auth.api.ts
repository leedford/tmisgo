import { API_URL } from "../../constants/api"
import axios from "axios"
import { ArtistType, OTPResponse, RegisterArtistReq, RegisterResponse } from "../../types/types"
import { getAuthToken } from "../../constants/authorization"

export const GetOTP=async(phone:string):Promise<OTPResponse>=>{
    try {

       
        const {data,status} = await axios.post(`${API_URL}/auth/get-otp`,
            {
                phoneNumber:phone
            },
            {
            headers:{
                "Content-Type":"application/json"
            }
        })

    if(status === 200){
        return {
            isSuccess:true,
            message:data.message
         }
    }else{
        return {
            isSuccess:false,
            message:data.message
         }
    }

        
    } catch (error) {
         //check if error is axios error
         console.log(JSON.stringify(error))
         const isAxiosErr = axios.isAxiosError(error)
         
         if(isAxiosErr){
            console.log(error.response?.data)
            return {
                isSuccess:false,
                message:error.response?.data.message
             }
         }else{
            return {
                isSuccess:false,
                message:"Something has gone wrong"
             }
         }
    }
}


export const VerifyOTP=async(otp:number):Promise<OTPResponse>=>{
    try {


        const {data,status} = await axios.post(`${API_URL}/auth/verify-otp`,
            {
                otp:otp
            },
            {
            headers:{
                "Content-Type":"application/json"
            }
        })

    
            if(status === 200){
                return {
                    isSuccess:true,
                    message:data.message
                }
            }else{
                return {
                    isSuccess:false,
                    message:data.message
                }
            }

        
    } catch (error:any) {
         
         //check if error is axios error
         const isAxiosErr = axios.isAxiosError(error)
         if(isAxiosErr){
            console.log(error.response?.data)
            return {
                isSuccess:false,
                message:error.response?.data.message
             }
         }else{
            return {
                isSuccess:false,
                message:"Something has gone wrong"
             }
         }
         
    }
}

export const RegisterArtist=async(payload:RegisterArtistReq):Promise<RegisterResponse>=>{
    try {


        const {data,status} = await axios.post(`${API_URL}/auth/register-artist`,
             payload,
            {
            headers:{
                "Content-Type":"application/json"
            }
        })

    
            if(status === 200){
                return {
                    isSuccess:true,
                    message:data.message,
                    payload:data.payload
                }
            }else{
                return {
                    isSuccess:false,
                    message:data.message,
                    payload:undefined
                }
            }

        
    } catch (error) {
       //check if error is axios error
       const isAxiosErr = axios.isAxiosError(error)
       if(isAxiosErr){
          console.log(error.response?.data)
          return {
              isSuccess:false,
              message:error.response?.data.message
           }
       }else{
          return {
              isSuccess:false,
              message:"Something has gone wrong"
           }
       }
    }
}



export const AddArtistCategory=async(categoryId:string):Promise<RegisterResponse>=>{
    try {

        const token = await getAuthToken()

        if(!token){
            return {
                isSuccess:false,
                message:"Authorization Error",
                payload:undefined
            }
        }


        const {data,status} = await axios.put(`${API_URL}/auth/add-category`,
             {
               categoryId
             },
            {
            headers:{
                "Content-Type":"application/json",
                "Authorization" : `Bearer ${token}`
            }
        })

    
            if(status === 200){
                return {
                    isSuccess:true,
                    message:data.message,
                    payload:data.payload
                }
            }else{
                return {
                    isSuccess:false,
                    message:data.message,
                    payload:undefined
                }
            }

        
    } catch (error) {
       //check if error is axios error
       const isAxiosErr = axios.isAxiosError(error)
       if(isAxiosErr){
          console.log(error.response?.data)
          return {
              isSuccess:false,
              message:error.response?.data.message,
              payload:undefined
           }
       }else{
          return {
              isSuccess:false,
              message:"Something has gone wrong",
              payload:undefined
           }
       }
    }
}




export const handleVerificationImageUploads=async(data:FormData):Promise<RegisterResponse>=>{
    try {
        
      
        const token = await getAuthToken()

        console.log(token,'-------> upload token')

        if(!token){
            return {
                isSuccess:false,
                message:"Authorization Error",
                payload:undefined
            }
        }

        
        const res = await axios.post(`${API_URL}/upload/image`,data,{
            headers:{
                Accept:"application/json",
                "Content-Type":"multipart/form-data",
                "Authorization" : `Bearer ${token}`
            }
        })


    
            if(res.status === 200){
                return {
                    isSuccess:true,
                    message:res.data.message,
                  
                }
            }else{
                return {
                    isSuccess:false,
                    message:res.data.message,
                   
                }
            }

        
    } catch (error:any) {
        console.log(error)
        if (error.response) {
            return {
                isSuccess:false,
                message:"errr",
            }
          } else if (error.request) {
            return {
                isSuccess:false,
                message:"errr",
            }
          } else {
  
            return {
                isSuccess:false,
                message:"errr",
            }
        
          }
          
    }
}





export const handleAddPhotoUpload=async(data:FormData):Promise<{isSuccess:boolean,message:string,payload:string[]| undefined}>=>{
    try {
        
      
        const token = await getAuthToken()

        if(!token){
            return {
                isSuccess:false,
                message:"Authorization Error",
                payload:undefined
            }
        }

        
        const res = await axios.put(`${API_URL}/profile/add/picture`,data,{
            headers:{
                Accept:"application/json",
                "Content-Type":"multipart/form-data",
                "Authorization" : `Bearer ${token}`
            }
        })


    
            if(res.status === 200){
                return {
                    isSuccess:true,
                    message:res.data.message,
                    payload:res.data.payload
                  
                }
            }else{
                return {
                    isSuccess:false,
                    message:res.data.message,
                    payload:res.data.payload
                   
                }
            }

        
    } catch (error:any) {

        console.log(JSON.stringify(error))
        if (error.response) {
            return {
                isSuccess:false,
                message:"Failed to upload image",
                payload:undefined
            }
          } else if (error.request) {
            return {
                isSuccess:false,
                message:"Failed to upload image",
                payload:undefined
            }
          } else {
  
            return {
                isSuccess:false,
                message:"Failed to upload image",
                payload:undefined
            }
        
          }
          
    }
}


export const AddDescription=async(description:string):Promise<RegisterResponse>=>{
    try {

      
        const token = await getAuthToken()

        if(!token){
            return {
                isSuccess:false,
                message:"Authorization Error",
                payload:undefined
            }
        }


        const {data,status} = await axios.put(`${API_URL}/profile/description`,
             {
               description
             },
            {
            headers:{
                "Content-Type":"application/json",
                "Authorization" : `Bearer ${token}`
            }
        })

    
            if(status === 200){
                return {
                    isSuccess:true,
                    message:data.message,
                    payload:data.payload
                }
            }else{
                return {
                    isSuccess:false,
                    message:data.message,
                    payload:undefined
                }
            }

        
    } catch (error) {
       //check if error is axios error
       const isAxiosErr = axios.isAxiosError(error)
       if(isAxiosErr){
          console.log(error.response?.data)
          return {
              isSuccess:false,
              message:error.response?.data.message
           }
       }else{
          return {
              isSuccess:false,
              message:"Something has gone wrong"
           }
       }
    }
}



export const AddMinBookingFee=async(minBookingFee:string):Promise<RegisterResponse>=>{
    try {

      
        const token = await getAuthToken()

        if(!token){
            return {
                isSuccess:false,
                message:"Authorization Error",
                payload:undefined
            }
        }


        const {data,status} = await axios.put(`${API_URL}/profile/bookingfee`,
             {
                minBookingFee
             },
            {
            headers:{
                "Content-Type":"application/json",
                "Authorization" : `Bearer ${token}`
            }
        })

    
            if(status === 200){
                return {
                    isSuccess:true,
                    message:data.message,
                    payload:data.payload
                }
            }else{
                return {
                    isSuccess:false,
                    message:data.message,
                    payload:undefined
                }
            }

        
    } catch (error) {
       //check if error is axios error
       const isAxiosErr = axios.isAxiosError(error)
       if(isAxiosErr){
          return {
              isSuccess:false,
              message:error.response?.data.message
           }
       }else{
          return {
              isSuccess:false,
              message:"Something has gone wrong"
           }
       }
    }
}



export const AddYoutubeLink=async(youtubeLink:string):Promise<RegisterResponse>=>{
    try {

      
        const token = await getAuthToken()

        if(!token){
            return {
                isSuccess:false,
                message:"Authorization Error",
                payload:undefined
            }
        }


        const {data,status} = await axios.put(`${API_URL}/profile/add/youtubelink`,
             {
                youtubeLink
             },
            {
            headers:{
                "Content-Type":"application/json",
                "Authorization" : `Bearer ${token}`
            }
        })

    
            if(status === 200){
                return {
                    isSuccess:true,
                    message:data.message,
                    payload:data.payload
                }
            }else{
                return {
                    isSuccess:false,
                    message:data.message,
                    payload:undefined
                }
            }

        
    } catch (error) {
       //check if error is axios error
       const isAxiosErr = axios.isAxiosError(error)
       if(isAxiosErr){
          console.log(error.response?.data)
          return {
              isSuccess:false,
              message:error.response?.data.message
           }
       }else{
          return {
              isSuccess:false,
              message:"Something has gone wrong"
           }
       }
    }
}





export const getArtistByToken=async():Promise<{isSuccess:boolean,message:string,payload?:ArtistType}>=>{
    try {

        const token = await getAuthToken()
        const {data,status} = await axios.get(`${API_URL}/auth/get/artist`,
            {
                headers:{
                    "Content-Type":"application/json",
                    "Authorization" : `Bearer ${token}`
                }
            } 
        )

    
            if(status === 200){
                return {
                    isSuccess:true,
                    message:data.message,
                    payload:data.payload
                }
            }else{
                return {
                    isSuccess:false,
                    message:data.message,
                    payload:undefined
                }
            }

        
    } catch (error) {
       //check if error is axios error
       const isAxiosErr = axios.isAxiosError(error)
       if(isAxiosErr){
          return {
              isSuccess:false,
              message:error.response?.data.message
           }
       }else{
          return {
              isSuccess:false,
              message:"Something has gone wrong"
           }
       }
    }
}
