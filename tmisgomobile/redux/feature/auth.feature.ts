import { createSlice } from "@reduxjs/toolkit";
import { _addNickname, _addUserInfo, _authenticateUserByToken, _getOTP, _updateUser, _verifyOTP } from "../actions/auth.actions";
import { asyncStoreData } from "../../utils/asyncStorageHelpers";
import { storageKeys } from "../../constants/storageKeys";
import { accounts } from "../../constants/accounts";
import { PhotoFile } from "react-native-vision-camera";
import { Site, User } from "../../types/types";




interface IntialState {
    loading:boolean
    message:string|null
    isError:boolean
    isSuccess:boolean
    authModalStatus:boolean
    mobileNumber:string 
    callingCode:string
    pin_id:string|null //termii otp pin id used for otp verification
    isInitializing:boolean
    isAuthenticated:boolean  
    activeAccount:string
    user:User | null
    token:String | null
    showAuthStack:boolean
    showRegisterArtistStack?:boolean
    isNewUser:boolean
    photo?:PhotoFile| undefined
    uploadSide?:string
    userMainNavigationInitialRoute?:string
    isFirstLaunch?:boolean

}

const initialState:IntialState =  {
   authModalStatus:false,
   loading:false,
   mobileNumber:"",
   callingCode:"",
   pin_id:null,
   message:null,
   isError:false,
   isSuccess:false,
   isInitializing:true,
   isAuthenticated:false,
   activeAccount:accounts.USER,
   user:null,
   token:null,
   showAuthStack:false,
   showRegisterArtistStack:false,
   isNewUser:false,
   photo:undefined,
   uploadSide:"front",
   userMainNavigationInitialRoute:undefined,
   isFirstLaunch:true
}


const authSlice = createSlice({
    name:"auth/slice",
    initialState:initialState,
    reducers:{

        setOnBoardingStatus:(state,action)=>{
            state.isFirstLaunch = action.payload
        },
        setMobileNumber:(state,action)=>{
            state.mobileNumber = action.payload
        },
        setCallingCode:(state,action)=>{
            state.callingCode = action.payload
        },
        resetAuthState:(state)=>{
            state.isError = false
            state.isSuccess = false
            state.loading = false
        },
        showAuthStack:(state,action)=>{
           state.showAuthStack = action.payload
        },
        showAuthModal:(state,action)=>{
           state.authModalStatus = action.payload
        },
       setIsInitializing:(state,action)=>{
           state.isInitializing = action.payload
       },
       setToken:(state,action)=>{
        state.token = action.payload
       },
    },
    extraReducers: builder => {

         /**
          * Get OTP
          */
          builder.addCase(_getOTP.pending, state => {
            state.loading = true;
          })
          builder.addCase(_getOTP.fulfilled, (state, action) => {
            state.loading = false;
            state.pin_id = action.payload.pin_id;
            state.isSuccess = true;
            // state.authStep = authSteps.VERIFY_OTP
          })

          builder.addCase(_getOTP.rejected, (state, action) => {
            state.loading = false;
            state.isError = true
            state.message = (action.payload as {message:string}).message 

          });

        /**
         * Verify OTP
         */

           builder.addCase(_verifyOTP.pending, state => {
            state.loading = true;
           })
           builder.addCase(_verifyOTP.fulfilled,(state, action) => {
            state.loading = false;
            state.callingCode = "";
            state.mobileNumber="";
            state.isSuccess = true;
            state.message = action.payload.message;
            state.isNewUser = action.payload.isNewUser;
            //persist jwt in local storage
            (async function(){
                await asyncStoreData({key:storageKeys.TOKEN,value:action.payload.token})
                state.token = action.payload.token
            })();

            //set is authenticated to true
            if(action.payload.isNewUser === false){
                state.isAuthenticated = true;
            }

            //set initial user info 
            state.user = action.payload.user


          })

          builder.addCase(_verifyOTP.rejected, (state, action) => {
            state.loading = false;
            state.isError = true
            state.message = (action.payload as {message:string}).message 
          });

         
             /**
         * Add User Info
         */

           builder.addCase(_addUserInfo.pending, state => {
            state.loading = true;
          })
          builder.addCase(_addUserInfo.fulfilled,(state, action) => {
            state.loading = false;
            state.isAuthenticated = true;
            state.isNewUser = false;
            state.user = action.payload.user
            state.isSuccess = true;
            state.message = action.payload.message
            
          })
          builder.addCase(_addUserInfo.rejected, (state, action) => {
            state.loading = false;
            state.isError = true
            state.message = (action.payload as {message:string}).message 

          });

           /**
         * Update User
         */

           builder.addCase(_updateUser.pending, state => {
            state.loading = true;
          })
          builder.addCase(_updateUser.fulfilled,(state, action) => {
            state.loading = false;
            state.isSuccess = true;
            state.user = action.payload.payload;
            state.message = action.payload.message 
          })
          builder.addCase(_updateUser.rejected, (state, action) => {
            
            state.loading = false;
            state.isError = true
            state.message = (action.payload as {message:string}).message 

          });

          /**
           * Authenticate user
           */
          builder.addCase(_authenticateUserByToken.pending, state => {
            state.loading = true;
          })
          builder.addCase(_authenticateUserByToken.fulfilled,(state, action) => {
            state.loading = false;
            state.isAuthenticated = true;
            state.isInitializing = false;
            //TODO: store user in global state
            state.user = action.payload.payload
          })
          builder.addCase(_authenticateUserByToken.rejected, (state, action) => {
            state.loading = false;
            state.isError = true
            state.message = (action.payload as {message:string}).message 
          });


    }
})

export const {
    setMobileNumber,
    setCallingCode,
    resetAuthState,
    setIsInitializing,
    setToken,
    showAuthStack,
    showAuthModal,
    setOnBoardingStatus
} = authSlice.actions
export default authSlice.reducer