import { API_URL } from "@/config/api";
import { AppDispatch } from "../store"
import { createAsyncThunk } from "@reduxjs/toolkit"
import  axios from "axios"


export const _adminLogin = createAsyncThunk<
  any,
  { email: string; password: string },
  { dispatch: AppDispatch }
>("login/admin", async function (payload) {
  try {
    let { data } = await axios.post(`${API_URL}/ministry/admin/login`, payload)
    return data
  } catch (error) {
    console.log(error)
    return {
      isError: true,
      msg: "Error ! try again",
    }
  }
})

export const _getAdminByToken = createAsyncThunk<
  any,
  { token: string },
  { dispatch: AppDispatch }
>("get/admin", async function (payload) {
  try {
      let { data } = await axios.post(`${API_URL}/ministry/admin/authenticate`, payload)
    return data
  } catch (error) {
    console.log(error)
    return {
      isError: true,
      msg: "Error ! try again",
    }
  }
})
