
import HeadingText from "../../components/HeadingText"
import colors from "../../constants/Colors"
import { StyleSheet, Text, View } from "react-native"
import Ionicons from "@react-native-vector-icons/ionicons"
import CustomButton from "../../components/CustomBotton/CustomButton"
import { useNavigation } from "@react-navigation/native";
import { screenNames } from "../../navigation/screenNames"


const VerifyCongratulation =()=>{


    const navigation:any = useNavigation()

    return(
        <View style={styles.main} >
                 <View>
                 
               
                 </View>
                <View style={{justifyContent:"center",alignItems:"center"}}>
                <Ionicons name="checkmark-circle" size={80} color="black" />
                <HeadingText text="Congratulations" textStyles={{textAlign:"center"}} />
                <View style={{width:"60%"}}>
                   <Text style={{textAlign:"center",color:colors.black,fontSize:16}}>
                     Your account will be verified within 24 hours in a mean time you can continue setting it up
                   </Text>
                </View>
                </View>

                <CustomButton
                   title="Continue"
                   onPress={()=>{
                      navigation.replace(screenNames.UpdateProfileHome)
                   }}
                 />


         </View>
    )
}

export default VerifyCongratulation

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