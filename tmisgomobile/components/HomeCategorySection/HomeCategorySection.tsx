import { View } from "react-native"
import { ArtistType, CategoryType } from "../../types/types"
import SectionHeader from "../SectionHeader/SectionHeader"
import Spacer from "../Spacer/Spacer"
import HorizontalScrollList from "../HorizontalScrollList/HorizontalScrollList"
import ArtistCard from "../ArtistCard/ArtistCard"
import { useQuery } from "@apollo/client/react";
import { gql } from "@apollo/client";
import { useNavigation } from "@react-navigation/native"
import { screenNames } from "../../navigation/screenNames"

interface Props {
    category: CategoryType
}

const GET_ARTISTS_IN_CATEGORY = gql`
  query GetArtistsInCategory($categoryId: ID!) {
    getArtistsInCategory(categoryId: $categoryId) {
      verificationImages
      stageName
      profileImages
      id
    }
  }
`;

const HomeCategorySection = ({category}:Props) => {

   const navigation:any =  useNavigation()
  // Fetch artists in this category
  const { data, loading, error } = useQuery<{ getArtistsInCategory: ArtistType[] }>(GET_ARTISTS_IN_CATEGORY, {
    variables: { categoryId: category.id },
    fetchPolicy: "no-cache"
  });


  const artists = data?.getArtistsInCategory || [];

    return (
        <View>

        <SectionHeader
          title={category.name}
          showViewAll={true}
          onViewAllPress={()=>{}}
        />

        <Spacer />

        <HorizontalScrollList>
          {artists.map((artist) => (
            <ArtistCard
              key={artist.id}
              stageName={artist.stageName}
              category={category.name}
              imageUri={artist.profileImages[0] || ''}
              isVerified={artist.isVerified}
              onPress={() => {
                navigation.navigate(screenNames.ArtistDetailScreen, { artistAccountId: artist.id })
              }}
            />
          ))}
        </HorizontalScrollList>

        </View>
    )
}

export default HomeCategorySection