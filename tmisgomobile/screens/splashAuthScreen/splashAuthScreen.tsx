import { ActivityIndicator, StyleSheet, TouchableOpacity, View } from "react-native"
import { dimentions } from "../../constants/dimentions"
import colors from "../../constants/Colors"
import { useEffect, useState } from "react"
import { asyncGetData } from "../../utils/asyncStorageHelpers"
import { RootState,useAppDispatch } from "../../redux/store"
import { storageKeys } from "../../constants/storageKeys"
import { _authenticateUserByToken } from "../../redux/actions/auth.actions"
import { useSelector } from "react-redux"
import { setIsInitializing } from "../../redux/feature/auth.feature"
import { useNetInfo } from "@react-native-community/netinfo"
import Icon from "@react-native-vector-icons/ionicons"
import BodyText from "../../components/BodyText"





const SplashAuthScreen =()=>{
    

    console.log("===========SPlash Called ==================")
    const dispatch = useAppDispatch()
 

    const {isError,loading} = useSelector((state:RootState)=> state.authSlice)
    
    const {isConnected,isInternetReachable} = useNetInfo()
    
    const [errorType,setErrorType] = useState<"SERVER" | "NETWORK" | null >(null)
   


     useEffect(()=>{
      
        async function init(){
            try {
            /**
           * check if user is authenticated as the splash screen is loading
           */
           const token = await asyncGetData(storageKeys.TOKEN)
         

          if(token && isInternetReachable === true){
            //TODO: test if it awaits this action
            await authenticateUser()
            
           }
           else if (token && isInternetReachable === false){
 
            //this is network error
            setErrorType("NETWORK")
           }
           else if ( token === null && isInternetReachable === false){
               //this is network error
            setErrorType("NETWORK")
           }
           else if(token === null && isInternetReachable === true){

              //check for app version
               setTimeout(()=>{
                dispatch(setIsInitializing(false))
               },4000)
           }
                
            } catch (error) {
                console.log(error,"----------server errrrrr")
                setErrorType("SERVER")
               
                
            }
        }
        init()


        //catch server errors
        if(isError){
           setErrorType("SERVER")
           
        }


     },[isConnected,isInternetReachable,isError])


     const authenticateUser=async()=>{
       const _token = await asyncGetData(storageKeys.TOKEN)
       console.log(_token,'======= token on authenticate user splash screen=========')
      _token && await dispatch(_authenticateUserByToken({token:_token.value as string}))
     }


    return(
      <View style={styles.main}>
          
           { loading ? <ActivityIndicator size={40} color={colors.primary}/>:  
              <View style={{width:"100%",justifyContent:"center",alignItems:"center"}}>
                
                     { errorType !== null && <TouchableOpacity 
                        onPress={()=>{
                          authenticateUser().then(()=>{})
                        }}
                     >
                       <Icon name="arrow-redo" size={40} color={colors.primary}/>
                      </TouchableOpacity>}
                    
                     {
                       errorType === "SERVER" ?  <BodyText text="Something has gone wrong please try a gain !"/>
                                            : errorType === "NETWORK" ?<BodyText text="NETWORK ERROR !"/>
                                                  : <ActivityIndicator size={40} color={colors.primary}/>

                     }
              </View>
           } 
      </View>
    )
}

export default SplashAuthScreen

const styles = StyleSheet.create({
    main:{
        flex:1,
        justifyContent:"center",
        alignItems:"center",
        backgroundColor:colors.primary
    }
})