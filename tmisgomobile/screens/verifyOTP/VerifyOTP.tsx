
import BodyText from '../../components/BodyText';
import CustomButton from '../../components/CustomBotton/CustomButton';
import HeadingText from '../../components/HeadingText';
import SafeAreaContainer from '../../components/SafeAreaContainer/SafeAreaContainer';
import Spacer from '../../components/Spacer/Spacer';
import colors from '../../constants/Colors';
import React, { useEffect, useState} from 'react';
import { View,StyleSheet,ToastAndroid,Platform} from 'react-native';
import OTPTextView from 'react-native-otp-textinput';
import { useNavigation } from '@react-navigation/native';
import { useSelector } from 'react-redux';
import { RootState, useAppDispatch } from '../../redux/store';
import { _authenticateUserByToken, _verifyOTP } from '../../redux/actions/auth.actions';
import DeviceInfo from 'react-native-device-info';
import getLocationInfoByIP from '../getLocationInfoByIp/getLocationInfoByIp';
import { resetAuthState, showAuthStack } from '../../redux/feature/auth.feature';
import { screenNames } from '../../navigation/screenNames';
import { getAuthToken } from '../../constants/authorization';



const VerifyOTPScreen = () => {
  
  const navigation:any = useNavigation()

  const dispatch = useAppDispatch()

  const {pin_id,mobileNumber,callingCode,isError,message,loading,isSuccess,isNewUser} = useSelector((state:RootState)=> state.authSlice)
    

   const [otp,setOtp] = useState<string>("")
   const [lat,setLat]= useState<number | undefined>(undefined)
   const [long,setLong]= useState<number | undefined>(undefined)
   const [ip,setIp] = useState<string>("")
   const [timeZone,setTimeZone] = useState<string>("")

     //get location info by IP and device Info
    useEffect(()=>{

      async function init(){

        const {info,isError} = await getLocationInfoByIP()

        if(!info) return
        if(isError) return
      
        //set IP
        info && setIp(info.ip)

        //set Lat & Long
        const latlong = info.loc.split(",")

        setLat(parseFloat(latlong[0]))
        setLong(parseFloat(latlong[1]))

        //set time zone
        setTimeZone(info.timezone)
      }

      init()
    },[])




    useEffect(()=>{

         if(isSuccess){
            if(isNewUser){
              setTimeout(()=>{
                dispatch(resetAuthState())
                navigation.navigate(screenNames.AddUserInfoScreen)
              },4000)
             }else{
           setTimeout(async()=>{
              dispatch(resetAuthState())
              navigation.replace(screenNames.AuthSuccessScreen)
           },4000)
          }
        }

        if(isError && message){
           ToastAndroid.show(message,4000)
           setTimeout(()=>{
             dispatch(resetAuthState())
           },4000)
        }

    },[isError,message,isNewUser,isSuccess])


  const handleVerifyOtp = async() => {
      if(otp.length < 5){
         ToastAndroid.show("OTP is required",4000)
         return
      }

      if(!pin_id){
         ToastAndroid.show("Error 420R",4000)
         return
      }

      console.log(callingCode,"calling code")

      //dispatch
      dispatch(_verifyOTP({
         pin_id,
         mobileNumber,
         callingCode:"256",
         pin:otp,
         lat:lat,
         long:long,
         ip:ip,
         timeZone:timeZone,
         deviceId:await DeviceInfo.getUniqueId(),
         fingurePrint:await DeviceInfo.getFingerprint(),
         manufacturer:DeviceInfo.getManufacturerSync(),
         brand:DeviceInfo.getBrand(),
         isEmulator:await DeviceInfo.isEmulator(),
         installOdavoltVersion:DeviceInfo.getVersion(),
         updatedOdavoltVersion:DeviceInfo.getVersion(),
         isIOS:Platform.OS === "ios",
         isAndroid:Platform.OS === "android",
         carrier:DeviceInfo.getCarrierSync(),
         isTablet:DeviceInfo.isTablet()
      
      }))

     }
    

  return (

    <SafeAreaContainer>
    <View style={styles.main}>
    <Spacer height={40}/>
    <HeadingText text="Verify your phone number"/>
    <BodyText text="Enter your OTP code here"/>

    <Spacer height={40}/>

        <OTPTextView
            containerStyle={styles.textInputContainer}
            textInputStyle={styles.roundedTextInput}
            inputCount={5}
            inputCellLength={1}
            tintColor={colors.black}
            handleTextChange={(value)=> setOtp(value)}
          />

        <Spacer height={40}/>

              <CustomButton
                title="VERIFY"
                loading={loading}
                onPress={()=>{
                  handleVerifyOtp()
                }}
              />

      </View>
      </SafeAreaContainer>

  );
};


export default VerifyOTPScreen


const styles = StyleSheet.create({
  main:{
    width:"100%",
    height:"100%",
    justifyContent:"flex-start",
    alignItems:"center",
    backgroundColor:colors.white,
    paddingHorizontal:15,
},
  otpContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap:20,
  },
  otpSquare: {
    width: 60,
    height: 60,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
    justifyContent: 'center',
    alignItems: 'center',
   
  },
  otpInput: {
    width: '100%',
    textAlign: 'center',
   
  },
  textInputContainer: {
    marginBottom: 20,
  },
  roundedTextInput: {
    borderRadius: 10,
    borderWidth: 4,
     height:60,
     width:60,
  },
});

