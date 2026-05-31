import { StyleSheet, ToastAndroid, View } from "react-native"
import SafeAreaContainer from "../../components/SafeAreaContainer/SafeAreaContainer"
import CustomAppBar from "../../components/CustomAppBar/CustomAppBar"
import Spacer from "../../components/Spacer/Spacer"
import colors from "../../constants/Colors"
import CustomButton from "../../components/CustomBotton/CustomButton"
import { useState } from "react"
import CustomTextInput from "../../components/CustomTextInput"
import { useNavigation } from "@react-navigation/native"
import { gql } from "@apollo/client"
import { useMutation } from "@apollo/client/react"
import BodyText from "../../components/BodyText"
import { useSelector } from "react-redux"
import { RootState } from "../../redux/store"

const UPDATE_MIN_BOOKING_FEE = gql`
mutation UpdateArtistProfile($artistAccountId: ID!, $minimumBookingFee: Int) {
  updateArtistProfile(artistAccountId: $artistAccountId, minimumBookingFee: $minimumBookingFee) {
    id
  }
}
`

const AddMinimumBookingFee=()=>{

  const { artistAccountId } = useSelector((state:RootState) => state.authSlice)
  const navigation = useNavigation()
  const [minBookingFee,setMinBookingFee] = useState<string>("")
  const [updateArtistProfile, { loading, error, data }] = useMutation<any>(UPDATE_MIN_BOOKING_FEE)


  const handleAddingBookingFee=async()=>{
    try {
      if(minBookingFee.length === 0){
        ToastAndroid.show("Minimum booking fee is required",4000)
        return
      }
      await updateArtistProfile({
        variables: {
          artistAccountId,
          minimumBookingFee: parseInt(minBookingFee, 10)
        }
      })
    } catch (error) {
      console.log(error)
    }
  }

  if (error) {
    ToastAndroid.show("Something has gone wrong", 4000)
  }
  if (data && data.updateArtistProfile) {
    ToastAndroid.show("Minimum booking fee added successfully", 4000)
    setTimeout(() => {
      navigation.goBack()
    }, 2000)
  }

  return(
    <SafeAreaContainer>
      <View style={styles.main}>
        <CustomAppBar
          title="Minimum Booking Fee"
          description=""
          canMoveBack={true}
        />
        <Spacer height={20}/>

        <BodyText text="Set your minimum booking fee. This is the least amount you are willing to accept for a booking." textStyles={{textAlign:"center"}}/>
        <Spacer height={20}/>
        <CustomTextInput
          placeholder="Enter minimum booking fee"
          onChangeText={(t)=> setMinBookingFee(t)}
          value={minBookingFee}
          keyboardType="numeric"
        />
        <Spacer height={20}/>
        <CustomButton
          title="Save"
          onPress={handleAddingBookingFee}
          loading={loading}
        />
      </View>
    </SafeAreaContainer>
  )
}

export default AddMinimumBookingFee

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