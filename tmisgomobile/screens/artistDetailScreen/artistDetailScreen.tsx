import React from "react";
import { View, Text, StyleSheet, Image, ScrollView, ActivityIndicator, SafeAreaView } from "react-native";
import { useQuery } from "@apollo/client/react";
import { gql } from "@apollo/client";
import { useNavigation, useRoute } from "@react-navigation/native";
import Icon from "@react-native-vector-icons/ionicons"
import Spacer from "../../components/Spacer/Spacer";
import colors from "../../constants/Colors";
import HeadingText from "../../components/HeadingText";
import { dimentions } from "../../constants/dimentions";
import CustomButton from "../../components/CustomBotton/CustomButton";
import HorizontalScrollList from "../../components/HorizontalScrollList/HorizontalScrollList";
import BodyText from "../../components/BodyText";
import { screenNames } from "../../navigation/screenNames";

const GET_ARTIST_PROFILE_BY_ID = gql`
  query GetArtistProfileById($artistAccountId: ID!) {
    getArtistProfileById(artistAccountId: $artistAccountId) {
      profileImages
      stageName
      profileDescription
      legalLastName
      legalFirstName
      id
    }
  }
`;

const ArtistDetailScreen = () => {

  const navigation:any = useNavigation()
  const route = useRoute();
  // Expecting route.params.artistAccountId
  const { artistAccountId } = route.params as { artistAccountId: string };

  const { data, loading, error } = useQuery<{ getArtistProfileById: {
    profileImages: string[];
    stageName: string;
    profileDescription: string;
    legalLastName: string;
    legalFirstName: string;
    id: string;
  }}>(GET_ARTIST_PROFILE_BY_ID, {
    variables: { artistAccountId },
    fetchPolicy: "network-only"
  });

  if (loading) {
    return (
      <View style={styles.centered}><ActivityIndicator size={40} color={colors.black} /></View>
    );
  }
  if (error || !data?.getArtistProfileById) {
    return (
      <View style={styles.centered}><Text>Error loading artist profile.</Text></View>
    );
  }

  const artist = data.getArtistProfileById;

  return (
    <SafeAreaView style={{flex:1}}>
    <ScrollView style={{ flex: 1, backgroundColor: colors.white }}>
      <View style={styles.main}>
      <Spacer height={20} />

      <View style={{
        width:"100%",
        height:250,
        backgroundColor:colors.gray200,
        alignSelf:"center",
        borderRadius:12,
        overflow:"hidden",
        position:"relative",
      }}>

        {/* back arrow */}
         <View style={{
            width: 60,
            height: 60,
            borderRadius: 30,
            overflow: "hidden",
            marginRight: 10,
            backgroundColor: colors.white,
            position:"absolute",
            top:10,
            left:10,
            justifyContent:"center",
            alignItems:"center",
            zIndex:10,
          }}>

            <Icon name="arrow-back" size={30} color={colors.black} onPress={() => {
              navigation.goBack();
            }} />

          </View>



        <Image
          source={artist.profileImages && artist.profileImages.length > 0 ? { uri: artist.profileImages[0] } : require('../../assets/images/headerimg.png')}
          style={{ width: '100%', height: '100%'}}
          resizeMode="cover"
        />

      </View>

      <Spacer/>

      {/* avatar and stage name */}

      <View style={{flexDirection:"row", alignItems: "center",justifyContent:"flex-start"}}>

          <View style={{
            width: 60,
            height: 60,
            borderRadius: 30,
            overflow: "hidden",
            marginRight: 10,
            backgroundColor: colors.gray200,
            justifyContent:"center",
            alignItems:"center",
          }}>

            <Image
              source={artist.profileImages && artist.profileImages.length > 0 ? { uri: artist.profileImages[0] } : require('../../assets/images/headerimg.png')}
              style={{ 
                width: '100%',
                resizeMode: "contain",
                aspectRatio:15/16
            }}
              
            />

          </View>

          <HeadingText
            text={artist.stageName}
            textStyles={{ fontSize: 24, fontWeight: "bold", color: colors.black,}} 
          />

      </View>

      <Spacer height={20} />

      <HeadingText
        text="Bio"
        textStyles={{ fontSize: 20, fontWeight: "600", color: colors.black,}} 
      />

      <BodyText text={artist.profileDescription} />

      <Spacer height={20} />
      <HeadingText
        text="Gallery"
        textStyles={{ fontSize: 20, fontWeight: "600", color: colors.black,}} 
      />

      <HorizontalScrollList>
        {artist.profileImages && artist.profileImages.length > 0 ? (
          (artist.profileImages as string[]).map((img: string, idx: number) => (
            <Image
              key={idx}
              source={{ uri: img }}
              style={styles.profileImage}
              resizeMode="cover"
            />
          ))
        ) : (
          <Text style={{ color: colors.gray400 }}>No images</Text>
        )}
      </HorizontalScrollList>

      
      <Spacer height={20} />
         <CustomButton title="BOOK NOW" onPress={() => {
          navigation.navigate(screenNames.SendBookingRequestScreen as never, { artistAccountId: artist.id } as never);
         }} />
      <Spacer height={40} />
      </View>
    </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  main:{
     width:dimentions.vw,
     backgroundColor:colors.white,
     paddingHorizontal:10,
  },
  centered: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: colors.white,
  },
  imagesRow: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    gap: 10,
    paddingHorizontal: 10,
  },
  profileImage: {
    width: 120,
    height: 120,
    borderRadius: 12,
    marginRight: 10,
    backgroundColor: colors.gray100,
  },
  infoBox: {
    paddingHorizontal: 20,
    paddingVertical: 16,
    backgroundColor: colors.gray100,
    borderRadius: 12,
    marginHorizontal: 10,
  },
  name: {
    fontSize: 22,
    fontWeight: "bold",
    color: colors.black,
    textAlign: "center",
  },
  label: {
    fontSize: 14,
    color: colors.gray500,
    fontWeight: "600",
    marginTop: 8,
  },
  value: {
    fontSize: 16,
    color: colors.black,
    marginTop: 2,
  },
});

export default ArtistDetailScreen;

