

import {Dimensions, StatusBar} from 'react-native';


const windowWidth = Dimensions.get('window').width;
const windowHeight = Dimensions.get('window').height;
const statusBarHeight = StatusBar.currentHeight;
const barHeight = statusBarHeight ? statusBarHeight : 0


export const dimentions = {
    vw:windowWidth,
    vh:windowHeight-barHeight
}