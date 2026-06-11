import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { screenNames } from './screenNames';
import HomeScreen from '../screens/home/homeScreen';
import ArtistDetailScreen from '../screens/artistDetailScreen/artistDetailScreen';
import SendBookingRequestScreen from '../screens/sendBookingRequestScreen/sendBookingRequestScreen';




const HomeStack =()=>{

      const Stack = createNativeStackNavigator()
      return (
         
        <Stack.Navigator
          initialRouteName={screenNames.HomeScreen}
          screenOptions={{headerShown:false}}
        >
                  <Stack.Screen name={screenNames.HomeScreen} component={HomeScreen} />
                  <Stack.Screen name={screenNames.ArtistDetailScreen} component={ArtistDetailScreen} />
                  <Stack.Screen name={screenNames.SendBookingRequestScreen} component={SendBookingRequestScreen} />

        </Stack.Navigator>
       
      )
}

export default HomeStack