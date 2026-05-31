import { Platform, SafeAreaView, StatusBar, View } from "react-native"
import colors from "../../constants/Colors"
import { dimentions } from "../../constants/dimentions"


interface Props {
    children:React.ReactNode
}

const Layout=({children}:Props)=>{

    const isAndroid = Platform.OS === 'android'
    const statusBarHeight = StatusBar.currentHeight 

    return(
       <SafeAreaView style={{flex:1}}>
        <View style = {{
            width:dimentions.vw,
            height:"100%",
            alignItems:"center",
            backgroundColor:colors.white,
            paddingTop: isAndroid?statusBarHeight:0 
            }}
             >
           {children}
        </View>  
       </SafeAreaView>
    )
}

export default Layout