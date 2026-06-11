import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { screenNames } from './screenNames';
import UserProfileScreen from '../screens/userProfileScreen/userProfileScreen';




const UserProfileStack =()=>{

      const Stack = createNativeStackNavigator()
      
      return (
         
        <Stack.Navigator
          initialRouteName={screenNames.UserProfileScreen}
          screenOptions={{headerShown:false}}
        >
                  <Stack.Screen name={screenNames.UserProfileScreen} component={UserProfileScreen} />

        </Stack.Navigator>
       
      )
}

export default UserProfileStack