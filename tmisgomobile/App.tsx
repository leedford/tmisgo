

import React from 'react';

import {
  SafeAreaView
} from 'react-native-safe-area-context';
import { Provider} from 'react-redux';
import store from './redux/store';
import { NavigationContainer } from '@react-navigation/native';
import Main from './Main';








function App(): React.JSX.Element {

    
  

  return (
  
    <Provider store={store}>
     <NavigationContainer>
    <SafeAreaView style={{flex:1}}>
      <Main/>
    </SafeAreaView>
    </NavigationContainer>
    </Provider>
  )
}


export default App;
