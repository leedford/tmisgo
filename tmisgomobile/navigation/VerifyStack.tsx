import { createStaticNavigation } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import VerifyOnBoarding from '../screens/verifyOnBoarding/verifyOnBoarding';
import CaptureDocument from '../screens/captureDocument/captureDocument';
import UploadFront from '../screens/uploadFront/uploadFront';
import SelectDocumentType from '../screens/selectDocumentType/selectDocumentType';
import VerifyCongratulation from '../screens/verifyCongratulation/verifyCongratulation';




const VerifyStack=()=>{

    const RootStack = createNativeStackNavigator({
        initialRouteName:"VerifyOnBoarding",
        screenOptions:{
          headerShown:false
        },
        screens: {
          VerifyOnBoarding:VerifyOnBoarding,
          SelectDocumentType:SelectDocumentType,
          UploadFront:UploadFront,
          VerifyCongratulation:VerifyCongratulation,
          CaptureDocument:CaptureDocument,
          
          
         
        },
      });

    const Navigation = createStaticNavigation(RootStack);

    return (
        <Navigation/>
    )
}


export default VerifyStack