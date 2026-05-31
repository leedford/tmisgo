
import HeadingText from "../../components/HeadingText"
import colors from "../../constants/Colors"
import { StyleSheet, Text, View } from "react-native"
import IonIcons from "@react-native-vector-icons/ionicons"
import { useNavigation } from "@react-navigation/native";
import CustomButton from "../../components/CustomBotton/CustomButton";
import BodyText from "../../components/BodyText";
import { useAppDispatch } from "../../redux/store";
import { showRegisterArtistStack } from "../../redux/feature/auth.feature";
import Spacer from "../../components/Spacer/Spacer";


const UpdateProfileCongratulations =()=>{


    const dispatch = useAppDispatch()

    return(
        <View style={styles.main} >
    

                <View style={{justifyContent:"center",alignItems:"center"}}>
                <IonIcons name="checkmark-circle" size={80} color="black" />
                <HeadingText text="Congratulations" textStyles={{textAlign:"center"}} />
                <View style={{width:"60%"}}>
                  
                   <BodyText text="You have successfully updated your profile" textStyles={{textAlign:"center"}}/>
                   <Spacer/>
                <BodyText text="Give us upto 24 hours to review your changes." textStyles={{textAlign:"center"}}/>

                </View>
                </View>

                <CustomButton onPress={() => dispatch(showRegisterArtistStack(false))} title="Go Back"/>
                

         </View>
    )
}

export default UpdateProfileCongratulations

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