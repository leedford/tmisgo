import { StyleSheet, ToastAndroid, View } from "react-native"
import SafeAreaContainer from "../../components/SafeAreaContainer/SafeAreaContainer"
import CustomAppBar from "../../components/CustomAppBar/CustomAppBar"
import Spacer from "../../components/Spacer/Spacer"
import colors from "../../constants/Colors"
import CustomButton from "../../components/CustomBotton/CustomButton"
import TextArea from "../../components/TextArea/TextArea"
import { useEffect, useState } from "react"
import { useNavigation } from "@react-navigation/native"
import { dimentions } from "../../constants/dimentions"
import BodyText from "../../components/BodyText"
import { gql } from "@apollo/client"
import { useMutation } from "@apollo/client/react"
import { useSelector } from "react-redux"


const ADD_PROFILE_DESCRIPTION = gql`
mutation UpdateArtistProfile($artistAccountId: ID!, $profileDescription: String, $profileImages: [String!], $profileVideoUrl: String, $minimumBookingFee: Int) {
  updateArtistProfile(artistAccountId: $artistAccountId, profileDescription: $profileDescription, profileImages: $profileImages, profileVideoUrl: $profileVideoUrl, minimumBookingFee: $minimumBookingFee) {
    id
  }
}
`

const AddProfileDescription=()=>{

   const { artistAccountId } = useSelector((state:any)=> state.authSlice)

   const navigation = useNavigation()
   const [description,setDescription] = useState<string>("")


   const [updateArtistProfile,{loading,error,data}] =  useMutation<any>(ADD_PROFILE_DESCRIPTION)

   useEffect(()=>{
      if(error){
          ToastAndroid.show("Something has gone wrong",4000)
      }

      if(data && data.updateArtistProfile){
          ToastAndroid.show("Profile description added successfully",4000)
          navigation.goBack()
      }
   },[error,data,navigation])


   const handleAddingDescription=async()=>{
    try {

      if(description.length === 0){
          ToastAndroid.show("Description is required",4000)
          return
      }
      
      updateArtistProfile({
        variables:{
          artistAccountId:artistAccountId, //get artist account id from redux store
          profileDescription:description
        }
      })

      
    } catch (error) {
      ToastAndroid.show("Something has gone wrong",4000)
      
    }
}

    return(
        <SafeAreaContainer>
       <View style={styles.main}>
           <CustomAppBar
              title="Profile Description"
              description=""
              canMoveBack={true}
            />

            <Spacer height={20}/>

            <BodyText text="Add a description to your profile to let potential clients know more about you and your services." />

            <Spacer height={20}/>

            <TextArea 
              placeholder="Enter description"
              onChangeText={(text)=> setDescription(text)}
              value={description}
            />
            
            <Spacer height={20}/>

            <CustomButton
              title="Save"
              onPress={()=>{
                handleAddingDescription()
              }}
              loading={loading}
            />
         </View>
        </SafeAreaContainer>
    )
}

export default AddProfileDescription

const styles = StyleSheet.create({
    main:{
        width:dimentions.vw,
        height:"100%",
        justifyContent:"flex-start",
        alignItems:"center",
        backgroundColor:colors.white,
        paddingHorizontal:15,
    }
})