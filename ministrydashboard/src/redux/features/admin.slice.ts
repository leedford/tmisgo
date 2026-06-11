import { createSlice } from '@reduxjs/toolkit'
import { _getAdminByToken,_adminLogin } from '../actions/admin.actions';
import { keys } from '@/constants/localstorageKeys';
import { AdminType } from '@/types/types';



interface InitialStateType {
    loading:boolean
    isSuccess:boolean
    isError:boolean
    msg:string
    token:string | null
    name:string
    isAuthenticated:boolean
    admin:AdminType | null

}


const initialState:InitialStateType = {
    loading:false,
    isSuccess:false,
    isError:false,
    msg:"",
    token:null,
    isAuthenticated:false,
    admin:null,
    name:"admin"
}

const adminSlice = createSlice({
    name:"admin",
    initialState,
    reducers:{
        clearAdminLoginState: state => {
            state.isError = false;
            state.isSuccess = false;
            state.msg ="";
        },
        logoutAdmin: state => {

            localStorage.removeItem(keys.ADMIN_ACCESS_TOKEN_KEY)
            state.token = null;
            state.isAuthenticated = false
        },
    },
    extraReducers: builder =>{
        builder.addCase(_adminLogin.pending, state => {
            state.loading = true;
        });

        builder.addCase(_adminLogin.fulfilled, (state, action) => {
            state.loading = false;
            state.isError = action.payload.isError;
            state.isSuccess = !action.payload.isError;
            state.msg = action.payload.msg;
            state.token = !action.payload.isError && action.payload.payload;
            if(!action.payload.isError){
                //store token in local storage
             localStorage.setItem(keys.ADMIN_ACCESS_TOKEN_KEY,action.payload.payload)
            }
        });

        builder.addCase(_adminLogin.rejected, (state, action: any) => {
            state.loading = false;
            state.isError = action.payload.isError;
            state.isSuccess = !action.payload.isError;
            state.msg = action.payload.msg;
        });

        builder.addCase(_getAdminByToken.pending, state => {
            state.loading = true;
        });

        builder.addCase(_getAdminByToken.fulfilled, (state, action) => {
            state.loading = false;
            state.isError = action.payload.isError;
            if(!action.payload.isError){
                state.admin = action.payload.payload
                state.isAuthenticated = true
            }
           
        });

        builder.addCase(_getAdminByToken.rejected, (state, action: any) => {
            state.loading = false;
            state.isError = action.payload.isError;
            state.isSuccess = !action.payload.isError;
            state.msg = action.payload.msg;
        });

    }
})

export const {
    clearAdminLoginState,
    logoutAdmin
} = adminSlice.actions
export default adminSlice.reducer