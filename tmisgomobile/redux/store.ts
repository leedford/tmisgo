import {configureStore} from '@reduxjs/toolkit';
import {useDispatch} from 'react-redux';
import  authSlice from './feature/auth.feature';
import siteSlice from "./feature/site.feature"


const store = configureStore({
  reducer: {
    authSlice,
    siteSlice
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch; //ts
export const useAppDispatch: () => AppDispatch = useDispatch;
export default store;
