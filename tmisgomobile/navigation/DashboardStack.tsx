import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { screenNames } from './screenNames';
import DashboardScreen from '../screens/dashboard/dashboardScreen';





const DashboardStack =()=>{

      const Stack = createNativeStackNavigator()
      
      return (
         
        <Stack.Navigator
          initialRouteName={screenNames.DasboardScreen}
          screenOptions={{headerShown:false}}
        >
                  <Stack.Screen name={screenNames.DasboardScreen} component={DashboardScreen} />

        </Stack.Navigator>
       
      )
}

export default DashboardStack