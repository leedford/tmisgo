import { View,Pressable } from "react-native"
import colors from "../../constants/Colors"
import HeadingText from "../HeadingText"
import BodyText from "../BodyText"
import Icon from '@react-native-vector-icons/ionicons';


  const UserProfileListItem=({icon,title,text,onPress,style}:{title:string,text:string,icon:React.ReactNode,onPress:()=>void,style?:any})=>{

    const Symbol = ()=>icon

    return (
        <Pressable 
        onPress={onPress}
        style={{width:"100%",minHeight:60,backgroundColor:colors.white,borderWidth:1,borderColor:colors.gray200,borderRadius:8,flexDirection:"row",padding:4,...style}}>
        {/* icon */}
        <View style={{width:40,height:60,justifyContent:"center",alignItems:"center"}}>
            <Symbol />
        </View>

        {/* title */}
        <View style={{flex:1,justifyContent:"center"}}>
           <HeadingText textStyles={{fontSize:18,width:"100%"}} text={title} />
           { text.length > 0 && <BodyText text={text} textStyles={{fontSize:12,width:"100%"}} /> }
        </View>

        {/* icon */}
        <View style={{width:30,height:60,justifyContent:"center",alignItems:"center"}}>
           <Icon name="chevron-forward-outline" size={20} color={colors.textGray}/>
        </View>
      </Pressable>
    )
   }

   export default UserProfileListItem