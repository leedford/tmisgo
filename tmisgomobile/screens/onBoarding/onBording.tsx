


import CustomButton from "../../components/CustomBotton/CustomButton"
import Spacer from "../../components/Spacer/Spacer"
import colors from "../../constants/Colors"
import { View,Text, SafeAreaView, ImageBackground, StatusBar, Platform } from "react-native"
import { useNavigation } from "@react-navigation/native"

const OnBoarding=()=>{
  
   const navigation:any = useNavigation()

   const statusBarHeight = StatusBar.currentHeight
   const isAndroid = Platform.OS === "android"

    return(
        <SafeAreaView style={{flex:1}}>
          <View style={{flex:1}}>

            <ImageBackground 
              source={require("../../assets/images/onboardingbgone.png")} 
              resizeMode="cover"
              style={{flex:1,justifyContent:"space-between",paddingVertical:20,paddingHorizontal:15}}
            >

               <View style={{width:"100%",height:"auto"}}>

               <Spacer height={isAndroid?statusBarHeight:30}/>
               <Text style={{fontSize:60,fontWeight:"600",color:colors.white}}>
                    Manage Your Bookings On The Go
                </Text>
               </View>


                <CustomButton
                   title="Get Started"
                   onPress={()=> navigation.replace("GetOTP")}
                   customStyles={{backgroundColor:colors.white}}
                   textStyles={{color:colors.black}}
                />

            </ImageBackground>

          </View>
        </SafeAreaView>
    )
}


export default OnBoarding