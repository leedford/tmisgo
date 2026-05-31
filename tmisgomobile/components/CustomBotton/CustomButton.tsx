import colors from "../../constants/Colors"
import { ActivityIndicator,StyleSheet, Text, TouchableOpacity, View } from "react-native"

interface Props {
   title:string
   loading?:boolean
   onPress:()=> void
   customStyles?:any
   textStyles?:any
}


const CustomButton=({title,onPress,customStyles,textStyles,loading}:Props)=>{


    return(

        <TouchableOpacity
         onPress={onPress}
         style={[styles.main,customStyles]}
        >
           { loading ? <ActivityIndicator color={colors.white}/> : <Text style={[styles.text,textStyles]}>
                {title}
            </Text>}
        </TouchableOpacity>
    )
}

export default CustomButton


const styles = StyleSheet.create({
  main:{
    width:"100%",
    height:50,
    backgroundColor:colors.black,
    justifyContent:"center",
    alignItems:"center",
    borderRadius:6,
    marginVertical:2,
  },
  text:{
     fontSize:20,
     fontWeight:"500",
     color:colors.white,
     textAlign:"center"
  }
})