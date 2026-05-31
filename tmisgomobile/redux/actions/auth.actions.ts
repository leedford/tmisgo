import { createAsyncThunk} from "@reduxjs/toolkit";
import { AppDispatch } from "../store";
import axios from "axios";
import { API_URL } from "../../constants/api";
import { asyncGetData } from "../../utils/asyncStorageHelpers";
import { storageKeys } from "../../constants/storageKeys";



export const _getOTP = createAsyncThunk<
  any,
  {mobileNumber: string,callingCode:string},
  {dispatch: AppDispatch}
>('get/otp', async function (payload,thunkAPI): Promise<any> {
  try {

    console.log(payload)
  
    let {data} = await axios.post(`${API_URL}/auth/get-otp`,payload,{
        headers:{
            "Content-Type":"application/json"
        }
    });


    console.log(data,'-------> otp data')
    return data;


  } catch (error:any) {
    console.log(JSON.stringify(error))
    if (error.response){
      const __msg  = error.response.data.message ? error.response.data.message : "Something has gone wrong!"
      return thunkAPI.rejectWithValue({message:__msg})
  }
  else if(error.request){
      return thunkAPI.rejectWithValue({message:"Something has gone wrong"})
  }
  else{
    return thunkAPI.rejectWithValue({message:"Something has gone wrong"})
  }

  }
});



export const _verifyOTP = createAsyncThunk<
  any,
  {
    mobileNumber: string,
    callingCode:string,
    pin_id:string,
    pin:string,
    lat:number | undefined,
    long:number | undefined,
    ip:string,
    timeZone:string,
    deviceId:string,
    fingurePrint: string,
    manufacturer:string,
    brand:string,
    isEmulator:boolean,
    installOdavoltVersion:string,
    updatedOdavoltVersion:string,
    isIOS:boolean,
    isAndroid:boolean,
    carrier:string,
    isTablet:boolean
  },
  {dispatch: AppDispatch}
>('verify/otp', async function (payload,thunkAPI): Promise<any> {
  try {
   
    let {data} = await axios.post(`${API_URL}/auth/verify-otp`,payload,{
        headers:{
            "Content-Type":"application/json"
        }
    });

    return data;
  } catch (error:any) {
    let errorMessage = "Something has gone wrong";
    if (error.response && error.response.data && error.response.data.message) {
      errorMessage = error.response.data.message;
    } else if (error.response) {
      errorMessage = "Server error";
    } else if (error.request) {
      errorMessage = "Network error";
    } else if (error.message) {
      errorMessage = error.message;
    }
    console.error("_verifyOTP error:", error);
    return thunkAPI.rejectWithValue({message: errorMessage});
  }
});



export const _authenticateUserByToken = createAsyncThunk<
  any,
  {token:string},
  {dispatch: AppDispatch}
>('authenticate/by/token', async function ({token},thunkAPI): Promise<any> {
  try {
   
    let {data} = await axios.post(`${API_URL}/auth/authenticate`,{},{
        headers:{
            "Content-Type":"application/json",
            Authorization:`Bearer ${token}`
        }
    });

    return data;


  } catch (error:any) {

    console.log(JSON.stringify(error))
    if (error.response){
      return thunkAPI.rejectWithValue({message:error.response.data.message})
  }
  else if(error.request){
      return thunkAPI.rejectWithValue({message:"Something has gone wrong"})
  }

  }
});



export const _addNickname = createAsyncThunk<
  any,
  {nickName:string},
  {dispatch: AppDispatch}
>('add/nickname', async function (payload,thunkAPI): Promise<any> {
  try {
    
    const token = await asyncGetData(storageKeys.TOKEN)
    if (!token){
      return thunkAPI.rejectWithValue({message:"Something has gone wrong"})
    }
    let {data} = await axios.post(`${API_URL}/auth/add/nickname`,payload,{
        headers:{
            "Content-Type":"application/json",
             Authorization:`Bearer ${token}`
        }
    });

    return data;


  } catch (error:any) {
    if (error.response){
      return thunkAPI.rejectWithValue({message:error.response.data.message})
    }
  else if(error.request){
      return thunkAPI.rejectWithValue({message:"Something has gone wrong"})
  }

  }
});



export const _addUserInfo = createAsyncThunk<
  any,
  {  
     email:string, 
     legalFirstName:string, 
     legalLastName:string,
     userId:string
    },
  {dispatch: AppDispatch}
>('add/user/info', async function (payload,thunkAPI): Promise<any> {
  try {
    
    const token = await asyncGetData(storageKeys.TOKEN)
    if (!token){
      return thunkAPI.rejectWithValue({message:"Something has gone wrong"})
    }
    let {data} = await axios.put(`${API_URL}/auth/update/user`,payload,{
        headers:{
            "Content-Type":"application/json",
             Authorization:`Bearer ${token}`
        }
    });

    return data;


  } catch (error:any) {
    if (error.response){
      return thunkAPI.rejectWithValue({message:error.response.data.message})
    }
  else if(error.request){
      return thunkAPI.rejectWithValue({message:"Something has gone wrong"})
  }

  }
});





export const _updateUser = createAsyncThunk<
  any,
  {
    nickName:string,
    firstName:string | null,
    lastName:string | null,
    profilePicture:string | null
  },
  {dispatch: AppDispatch}
>('update/user', async function (payload,thunkAPI): Promise<any> {
  try {
    
    const token = await asyncGetData(storageKeys.TOKEN)
    if (!token){
      return thunkAPI.rejectWithValue({message:"Something has gone wrong"})
    }
    let {data} = await axios.post(`${API_URL}/auth/update/user`,payload,{
        headers:{
            "Content-Type":"application/json",
             Authorization:`Bearer ${token}`
        }
    });

 
    return data;


  } catch (error:any) {
  
    if (error.response){
      
      return thunkAPI.rejectWithValue({message:error.response.data.message ? error.response.data.message :"Something has gone wrong!"})
    }
  else if(error.request){
      return thunkAPI.rejectWithValue({message:"Something has gone wrong"})
  }

  }
});