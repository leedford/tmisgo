import React from "react";
import { ActivityIndicator, ScrollView, Text, ToastAndroid, TouchableOpacity, View } from "react-native"
import SafeAreaContainer from "../../components/SafeAreaContainer/SafeAreaContainer"
import { dimentions } from "../../constants/dimentions"
import colors from "../../constants/Colors"
import HeadingText from "../../components/HeadingText"
import BodyText from "../../components/BodyText"
import Spacer from "../../components/Spacer/Spacer"
import IonIcons from "@react-native-vector-icons/ionicons"
import { useNavigation, useFocusEffect } from "@react-navigation/native"
import { ArtistType } from "../../types/types"
import CustomButton from "../../components/CustomBotton/CustomButton"
import { gql } from "@apollo/client"
import { useQuery } from "@apollo/client/react"
import { useSelector } from "react-redux";
import { RootState } from "../../redux/store";
import { useEffect, useState } from "react"

interface StepType {
    title:string
    description:string
    navigateTo:string
    isDone:boolean
}


const GET_ARTIST_ACCOUNT = gql`
 query GetArtistAccountById($artistAccountId: ID!) {
  getArtistAccountById(artistAccountId: $artistAccountId) {
    stageName
    profileVideoUrl
    profileImages
    profileDescription
    minimumBookingFee
    legalLastName
    legalFirstName
    email
    categoryId
  }
}
`



const UpdateProfileHome=()=>{
    const navigation:any = useNavigation()
    const { artistAccountId } = useSelector((state:RootState) => state.authSlice)

    const { loading, error, data, refetch } = useQuery<{ getArtistAccountById: ArtistType }>(GET_ARTIST_ACCOUNT, {
      variables: { artistAccountId },
      fetchPolicy: "network-only"
    })

    const [artist,setArtist] = useState<ArtistType | null>(null)

    useEffect(() => {
        if (data && data.getArtistAccountById) {
            console.log(data.getArtistAccountById,'-------------dataaaaaaaa>>>>>')
            setArtist(data.getArtistAccountById)
        }

        if(error){
            ToastAndroid.show("Error loading artist profile", 4000)
        }

    }, [data,error])

    useFocusEffect(
      React.useCallback(() => {
        refetch();
      }, [refetch])
    );

    if (loading) {
        return (
            <SafeAreaContainer>
                <View style={{width:"100%",height:dimentions.vh,justifyContent:"center",alignItems:"center",paddingHorizontal:15}}>
                    <ActivityIndicator size={40} color={colors.black} />
                </View>
            </SafeAreaContainer>
        )
    }

    if (error) {
        ToastAndroid.show("Error loading artist profile", 4000)
        return null
    }

    const ProfileStepCard=({title,description,navigateTo,isDone}:StepType)=>{

        return(
            <TouchableOpacity 
            onPress={()=>{
               navigation.navigate(navigateTo)
            }}
            style={{width:"100%",minHeight:86,borderWidth:1,borderColor:colors.gray500,borderRadius:10,padding:14, flexDirection:"row",justifyContent:"space-between",alignItems:"flex-start"}}>
               <View style={{flex:1}}>
               <HeadingText
                 text={title}
                 textStyles={{fontSize:24}}
                />

                <BodyText
                   text={description}
                   textStyles={{color:colors.gray400}}
                 />
               </View>
               {/* icon */}
               <View style={{width:40,height:"auto"}}>   
                 {
                   isDone ?  <IonIcons name="checkmark-circle" size={30} color={colors.black} />:
                   <IonIcons  name="arrow-forward" size={30} color={colors.black}/>   
                 }
               </View>
            </TouchableOpacity>
        )
    }

    return (
        <SafeAreaContainer>
            <View style={{width:"100%",height:dimentions.vh,justifyContent:"flex-start",alignItems:"center",paddingHorizontal:15}}>

                {/* top card */}
                <View style={{width:"100%", height:200, backgroundColor:colors.black,borderRadius:10,padding:10,justifyContent:"space-between"}}>
                     
                     <View>
                     <HeadingText
                       text="Hi"
                       textStyles={{color:colors.white}}
                     />

                    <HeadingText
                       text={artist ? artist.legalLastName : ""}
                       textStyles={{color:"#767676",fontSize:24}}
                     />

                     </View>
                     <View>
                        <BodyText
                          text="Complete the steps below To make your profile outstanding"
                          textStyles={{color:colors.white}}
                        />
                     </View>
                       
                   
                </View>

                {/*  */}
                <Spacer height={40}/>
                
                
                <ScrollView showsVerticalScrollIndicator={false}  >
                <View style={{gap:20}}>
                 
                 {/* description */}
                 <ProfileStepCard 
                      title="Add your profile description"
                      description="A short but precise description to let your fans know a bit a bout your career"
                      navigateTo="AddProfileDescription"
                      isDone={artist && artist.profileDescription ? true : false}

                                 
                  />

                  {/* photos */}
                  <ProfileStepCard 
                      title="Add pictures"
                      description="Add pictures of your self or your perfomance"
                      navigateTo="AddPictures"
                      isDone={artist && artist.profileImages.length > 0 ? true : false}            
                  />

                  {/* add video link */}
                  {/* <ProfileStepCard 
                      title="Add a youtube video"
                      description="Add a video of you performing; it should not be more that 2 minutes"
                      navigateTo="AddVideo"
                      isDone={artist && artist.profileVideoUrl ? true : false}            
                  /> */}

                  {/*  */}
                  <ProfileStepCard 
                      title="Add a minimum booking fee"
                      description="This will help us bring to you only bookings that matter"
                      navigateTo="AddMinimumBookingFee"
                      isDone={artist && artist.minimumBookingFee ? true : false}            
                  />
                 
                </View>

                <Spacer height={40}/>

                <CustomButton
                  title="Done"
                  onPress={()=>{

                    if(artist && artist.minimumBookingFee && artist.profileImages.length > 0 && artist.profileDescription){
            
                      navigation.navigate("UpdateProfileCongratulations")
                    }
                    else{
                      ToastAndroid.show("Please Complete the other steps",4000)
                      return
                    }

                  }}
                 />

            </ScrollView>

            <Spacer height={20}/>

            </View>
        </SafeAreaContainer>
    )

}

export default UpdateProfileHome