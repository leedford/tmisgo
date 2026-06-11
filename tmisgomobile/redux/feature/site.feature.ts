import { createSlice } from "@reduxjs/toolkit";
import { _addNickname, _addUserInfo, _authenticateUserByToken, _getOTP, _updateUser, _verifyOTP } from "../actions/auth.actions";
import { Site} from "../../types/types";




interface IntialState {
    loading:boolean
    message:string|null
    isError:boolean
    isSuccess:boolean
    selectedSite:Site | null
}

const initialState:IntialState =  {
   loading:false,
   message:null,
   isError:false,
   isSuccess:false,
   selectedSite:null,

}


const siteSlice = createSlice({
    name:"site/slice",
    initialState:initialState,
    reducers:{
       setSelectedSite:(state,action)=>{
        state.selectedSite = action.payload
       },
    },
    extraReducers: builder => {

    }
})

export const {
    setSelectedSite
} = siteSlice.actions
export default siteSlice.reducer