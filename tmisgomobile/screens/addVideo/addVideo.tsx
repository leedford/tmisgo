import { StyleSheet, ToastAndroid, View } from "react-native"
import SafeAreaContainer from "../../components/SafeAreaContainer/SafeAreaContainer"
import CustomAppBar from "../../components/CustomAppBar/CustomAppBar"
import Spacer from "../../components/Spacer/Spacer"
import colors from "../../constants/Colors"
import CustomButton from "../../components/CustomBotton/CustomButton"
import { useState } from "react"
import CustomTextInput from "../../components/CustomTextInput"
import { AddYoutubeLink } from "../../api/auth/auth.api"
import { useNavigation } from "@react-navigation/native"



const AddVideo=()=>{

   const navigation = useNavigation()
   const [link,setLink] = useState<string>("")
   const [loading,setLoading]=useState<boolean>(false)

   const handleAddingYoutubeLink=async()=>{
      try {

        setLoading(true)

        if(link.length === 0){
           ToastAndroid.show("Link is required",4000)
           return
        }

        const res = await AddYoutubeLink(link)
        
        setLoading(false)
        if(!res.isSuccess){
          ToastAndroid.show(res.message,4000)
          return
        }



        navigation.goBack()
        
      } catch (error) {
        console.log(error)
      }
   }
   

    return(
    <SafeAreaContainer>
       <View style={styles.main}>
           <CustomAppBar
              title="Add youtube link"
              description="Add a youtube link of your performance"
              canMoveBack={true}
            />

            <Spacer height={20}/>

            <CustomTextInput 
              placeholder="Enter link"
              onChangeText={(t)=> setLink(t)}
              value={link}
            />

           
            
            <Spacer height={20}/>

            <CustomButton
              title="Save"
              onPress={()=>  handleAddingYoutubeLink()}
              loading={loading}
            />
         </View>
    </SafeAreaContainer>
    )
}

export default AddVideo

const styles = StyleSheet.create({
    main:{
        width:"100%",
        height:"100%",
        justifyContent:"flex-start",
        alignItems:"center",
        backgroundColor:colors.white,
        paddingHorizontal:15,
    }
})