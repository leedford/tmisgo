import { TouchableOpacity, View } from "react-native"
import HeadingText from "../HeadingText"
import Ionicons from "@react-native-vector-icons/ionicons"
import { useNavigation } from "@react-navigation/native"



interface Props {
    title:string
    description?:string
    canMoveBack?:boolean
}
const CustomAppBar=({
    title,
    description,
    canMoveBack = true
}:Props)=>{

    const navigation = useNavigation()


    return(
        <View style={{width:"100%",height:70,flexDirection:"row",alignItems:"center",paddingTop:20}}>
           { canMoveBack && <TouchableOpacity 
             onPress={()=>navigation.goBack()}
             style={{width:50,height:50,justifyContent:"center",alignItems:"center"}}>
           <Ionicons name="arrow-back-outline" size={20} color="black" />

           </TouchableOpacity>}
           <View style={{width:"auto",paddingHorizontal:10}}>
             <HeadingText text={title}/>
             {/* <BodyText text={description ? description : ""} /> */}
           </View>
        </View>
    )
}

export default CustomAppBar