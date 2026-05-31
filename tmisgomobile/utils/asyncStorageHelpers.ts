import AsyncStorage from '@react-native-async-storage/async-storage';

/*
* This is used to store objects only
*/
export const asyncStoreData = async ({key,value}:{key:string,value:string | number }) => {
    try {
      const jsonValue = JSON.stringify({
        Key:key,
        value:value
      });
      await AsyncStorage.setItem(key, jsonValue);
    } catch (e) {
      // saving error
    }
};

/*
* This is used to retrieve objects only
*/

export const asyncGetData = async (key:string):Promise<{Key:string,value:string|number }| null>=> {
    try {
      const jsonValue = await AsyncStorage.getItem(key);
      console.log(jsonValue,'-------> json value from async get data')
      return jsonValue != null ? JSON.parse(jsonValue) : null;

    } catch (e) {
      // error reading value
      return null
    }
  };