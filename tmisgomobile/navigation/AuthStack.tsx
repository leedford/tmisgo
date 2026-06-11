import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { screenNames } from './screenNames';
import GetOTPScreen from '../screens/getOTP/getOTP';
import VerifyOTPScreen from '../screens/verifyOTP/VerifyOTP';
import AddUserInfoScreen from '../screens/addUserInfo/addUserInfoScreen';
import AuthSuccessScreen from '../screens/authSuccessScreen/authSuccessScreen';
import { NinVerificationScreen } from '../screens/ninVerification/ninVerification';
import PersonalDetailsScreen from '../screens/personalDetails/personalDetails';
import { DocumentUploadScreen } from '../screens/documentUpload/documentUpload';
import { SetPinScreen } from '../screens/setPinScreen/setPinScreen';
import { SuccessScreen } from '../screens/successScreen/successScreen';




const AuthStack =()=>{

      const Stack = createNativeStackNavigator()
      return (
         
        <Stack.Navigator
          initialRouteName={screenNames.GetOTPScreen}
          screenOptions={{headerShown:false}}
        >
                  <Stack.Screen name={screenNames.GetOTPScreen} component={GetOTPScreen} />
                  <Stack.Screen name={screenNames.VerifyOTP} component={VerifyOTPScreen} />
                  <Stack.Screen name={screenNames.AddUserInfoScreen} component={AddUserInfoScreen} />
                  <Stack.Screen name={screenNames.AuthSuccessScreen} component={AuthSuccessScreen} />
                  <Stack.Screen name={screenNames.NinVerification} component={NinVerificationScreen} />
                  <Stack.Screen name={screenNames.PersonalDetails} component={PersonalDetailsScreen} />
                  <Stack.Screen name={screenNames.DocumentUpload} component={DocumentUploadScreen} />
                  <Stack.Screen name={screenNames.SetPinScreen} component={SetPinScreen} />
                  <Stack.Screen name={screenNames.SuccessScreen} component={SuccessScreen} />

        </Stack.Navigator>

      )
}

export default AuthStack




