import BodyText from "../../components/BodyText"
import CustomButton from "../../components/CustomBotton/CustomButton"
import HeadingText from "../../components/HeadingText"
import PhoneInput from "../../components/PhoneInput/PhoneInput"
import Spacer from "../../components/Spacer/Spacer"
import colors from "../../constants/Colors"
import { SafeAreaView, StyleSheet,ToastAndroid, View } from "react-native"
import * as yup from 'yup';
import { Formik } from 'formik';
import { useEffect, useState } from "react"
import { useNavigation } from "@react-navigation/native"
import { useSelector } from "react-redux"
import { RootState, useAppDispatch } from "../../redux/store"
import { _getOTP } from "../../redux/actions/auth.actions"
import { resetAuthState, setCallingCode, setMobileNumber } from "../../redux/feature/auth.feature"
import { screenNames } from "../../navigation/screenNames"
import { dimentions } from "../../constants/dimentions"





const GetOTPScreen=()=>{
   
    const navigation:any = useNavigation()
    const dispatch = useAppDispatch()
    const {loading,isError,isSuccess,message} = useSelector((state:RootState) => state.authSlice);
    const  [error,setError] = useState<string | null>(null)


     useEffect(()=>{
      console.log(isSuccess,'-------> is success')
      if(isSuccess){
        dispatch(resetAuthState())
          navigation.navigate(screenNames.VerifyOTP)
      }

      console.log(isError,message,'-------> get otp message')
     if(isError && message){
        ToastAndroid.show(message,4000)
        setTimeout(()=>{
          dispatch(resetAuthState())
        },4000)
     }
   },[isError,message,isSuccess])


    const handleGettingOTP=async(phone:string)=>{

       try {
        if(phone.length === 0 || phone.length > 10){
        setError("Invalid Number")
        return

        }
        
        dispatch(setMobileNumber(phone))
        dispatch(setCallingCode("+256"))
        //call get otp api
        dispatch(_getOTP({
          mobileNumber:phone,
          callingCode:"+256" // change this to come from country picker
        }))
         
       } catch (error) {
         console.log(error)
       }
    }
   
    

    let schema = yup.object().shape({
        phoneNumber: yup.string().required("Phone number is required").min(9,"Too short").max(9,"Number must be 9 digits long"),
    });

    return(
    <SafeAreaView style={{flex:1}}>
       <View style={styles.main}>
           <Spacer height={100}/>
           {/* <Logo/> */}
           <Spacer height={10}/>

           <HeadingText text="Sign up"/>
           <Spacer height={30}/>
           <BodyText text="Enter mobile number to continue" />
           <View style={{marginVertical:1,padding:4,width:"100%"}}>

            <Spacer/>
             <Formik
               onSubmit={(values,actions)=>{
                // setPhoneNumber(values.phoneNumber)
                // setCallingCode(values.code)
                handleGettingOTP(values.phoneNumber)
                actions.resetForm()
                 //
               }}
               initialValues={{phoneNumber:"",code:"+256"}}
               validationSchema={schema}
             >
                {({values,errors,setFieldValue,touched,handleSubmit})=>(
                    <View style={{flex:1}}>
                        <PhoneInput
                            onCountryCodeChange={(code)=>setFieldValue("code",code)}
                            value={values.phoneNumber}
                            onChangeText={(phoneNumber)=> setFieldValue("phoneNumber",phoneNumber)}
                            error={errors.phoneNumber && touched.phoneNumber ? errors.phoneNumber : ""}
             />
            
            <Spacer height={20}/>
            <CustomButton
               title="GET OTP"
               onPress={()=>{
                handleSubmit()
               }}
               loading={loading}
             />
             
            </View>
                )}
            </Formik>
           </View>

             
       </View>  
    </SafeAreaView>
    )
}

export default GetOTPScreen

const styles = StyleSheet.create({
    main:{
        width:"100%",
        height:dimentions.vh,
        justifyContent:"flex-start",
        alignItems:"center",
        backgroundColor:colors.white,
        paddingHorizontal:15,
    }
})