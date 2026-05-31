

import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { screenNames } from './screenNames';
import MySitesScreen from '../screens/mySitesScreen/mySiteScreen';
import LinkDeviceScreen from '../screens/linkDevice/linkDevice';
import AddSiteScreen from '../screens/addSiteScreen/addSiteScreen';





const SitesStack =()=>{

      const Stack = createNativeStackNavigator()
      return (
         
        <Stack.Navigator
          initialRouteName={screenNames.MySitesScreen}
          screenOptions={{headerShown:false}}
        >
                  <Stack.Screen name={screenNames.MySitesScreen} component={MySitesScreen} />
                  <Stack.Screen name={screenNames.LinkDeviceScreen} component={LinkDeviceScreen} />
                  <Stack.Screen name={screenNames.AddSiteScreen} component={AddSiteScreen} />
        </Stack.Navigator>

      )
}

export default SitesStack




