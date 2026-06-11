
import HeadingText from "../../components/HeadingText"
import colors from "../../constants/Colors"
import { StyleSheet, Text, View } from "react-native"
import Entypo from "@react-native-vector-icons/ionicons"
import CustomButton from "../../components/CustomBotton/CustomButton"
import { useNavigation } from "@react-navigation/native";
import { screenNames } from "../../navigation/screenNames"


const VerifyOnBoarding =()=>{


    const navigation:any = useNavigation()

    return(
        <View style={styles.main} >
        
                 <View>
                 <HeadingText text="Account Verification" textStyles={{textAlign:"center"}} />
                <View style={{width:"60%"}}>
                   <Text style={{textAlign:"center",color:colors.black,fontSize:16}}>
                       To prevent imposters and any form of fraud all artists are required to verify their accounts
                   </Text>
                </View>
                 </View>

                <View>
                <Entypo name="lock-closed" size={80} color="black" />
                </View>


                <CustomButton
                   title="Continue"
                   onPress={()=> navigation.navigate(screenNames.SelectDocumentType)}
                 />


         </View>
    )
}

export default VerifyOnBoarding

const styles = StyleSheet.create({
    main:{
    width:"100%",
    height:"100%",
    justifyContent:"space-between",
    alignItems:"center",
    backgroundColor:colors.white,
    paddingHorizontal:15,
    paddingVertical:60
    }
})