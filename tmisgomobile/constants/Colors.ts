/**
 * Below are the colors that are used in the app. The colors are defined in the light and dark mode.
 * There are many other ways to style your app. For example, [Nativewind](https://www.nativewind.dev/), [Tamagui](https://tamagui.dev/), [unistyles](https://reactnativeunistyles.vercel.app), etc.
 */

const tintColorLight = '#0a7ea4';
const tintColorDark = '#fff';

const colors = {
  light: {
    text: '#11181C',
    background: '#fff',
    tint: tintColorLight,
    icon: '#687076',
    tabIconDefault: '#687076',
    tabIconSelected: tintColorLight,
  },
  dark: {
    text: '#ECEDEE',
    background: '#151718',
    tint: tintColorDark,
    icon: '#9BA1A6',
    tabIconDefault: '#9BA1A6',
    tabIconSelected: tintColorDark,
  },
    primary:"#000000",
    black:"#000000",
    white:"#ffffff",
    textDark:"#292828",
    textGray:"#5C5C5C",
    gray500: '#505050',
    gray400: '#626468',
    gray300: '#AEB1B6',
    gray200: '#D9D9D9',
    gray100: '#EEEEEC',
    gray50:"#F8F8F8",
    success:"#11AF22",
    danger:"red"
};


export default colors;