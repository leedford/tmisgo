import { Image, SafeAreaView, StyleSheet, View } from "react-native"


const Logo=()=>{

    return(
        <View>
          <Image
             source={require("../../assets/images/artbuklogoblack.png")}
             style={{width:60,height:60,objectFit:"contain"}}
           />
        </View>
      
    )
}

export default Logo

const styles = StyleSheet.create({
     main:{
        width:60,
        height:60,
        justifyContent:"center",
        alignItems:"center"
     }
})