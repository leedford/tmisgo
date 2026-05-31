
import { useNavigation } from "@react-navigation/native"
import CustomAppBar from "../../components/CustomAppBar/CustomAppBar"
import SafeAreaContainer from "../../components/SafeAreaContainer/SafeAreaContainer"
import Spacer from "../../components/Spacer/Spacer"
import colors from "../../constants/Colors"
import { Text, TouchableOpacity, View,StyleSheet } from "react-native"
import { screenNames } from "../../navigation/screenNames"

interface ListItemProps {
    onPress:()=> void
    text:string
}

const SelectDocumentType=()=>{

    const navigation:any = useNavigation()

    const ListItem=({onPress,text}:ListItemProps)=>{

        return(
            <TouchableOpacity
            onPress={onPress}
            style={styles.list_item}>
                <View>
            
                  
                  <Text style={{fontWeight:500,fontSize:16,color:colors.black}}>
                  {text}
                  </Text>    
                
                </View>

                <View style={{}}>

                </View>
            </TouchableOpacity>
        )
    }


    return (
       <SafeAreaContainer>
          <View style={styles.main}>
            <CustomAppBar
              title="Document type"
              description="Select the type of document to use for verifying your account"
              canMoveBack={false}
            />

            <Spacer height={80}/>
            

            <ListItem
               text="National ID"
               onPress={()=> navigation.navigate(screenNames.CaptureDocument)}
             />

          </View>
       </SafeAreaContainer>
    )
}

export default SelectDocumentType

const styles = StyleSheet.create({
    main:{
        width:"100%",
        height:"auto",
        paddingHorizontal:15
    },
    list_item:{
        width:"100%",
        height:50,
        borderRadius:6,
        borderWidth:1,
        borderColor:colors.black,
        justifyContent:"center",
        alignItems:"flex-start",
        paddingHorizontal:15
    
    }
})