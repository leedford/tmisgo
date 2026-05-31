import { createStaticNavigation } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import UpdateProfileHome from '../screens/updateProfileHome/updateProfileHome';
import AddProfileDescription from '../screens/addProfileDescription/addProfileDescription';
import AddPictures from '../screens/addPictures/addPictures';
import AddVideo from '../screens/addVideo/addVideo';
import AddMinimumBookingFee from '../screens/addMinimumBookingFee/addMinimumBookingFee';




const ProfileStack=()=>{

    const RootStack = createNativeStackNavigator({
        initialRouteName:"UpdateProfileHome",
        screenOptions:{
          headerShown:false
        },
        screens: {
          UpdateProfileHome:UpdateProfileHome,
          AddProfileDescription:AddProfileDescription,
          AddPictures:AddPictures,
          AddVideo:AddVideo,
          AddMinimumBookingFee:AddMinimumBookingFee


        },
      });

    const Navigation = createStaticNavigation(RootStack);

    return (
        <Navigation/>
    )
}


export default ProfileStack