import React, { useState, useEffect } from 'react';
import { View, ScrollView, Text, StyleSheet, Image } from 'react-native';
import { gql } from '@apollo/client';

import Layout from '../../components/Layout/Layout';
import SectionHeader from '../../components/SectionHeader/SectionHeader';
import CategoryCard from '../../components/CategoryCard/CategoryCard';
import HorizontalScrollList from '../../components/HorizontalScrollList/HorizontalScrollList';
import { CategoryType, ArtistType } from '../../types/types';
// import { mockCategories, mockPopularArtists } from '../../data/mockData';
import colors from '../../constants/Colors';
import { useQuery } from '@apollo/client/react';
import { useFocusEffect } from '@react-navigation/native';
import HomeCategorySection from '../../components/HomeCategorySection/HomeCategorySection';
import { dimentions } from '../../constants/dimentions';


export const mockCategories: CategoryType[] = [
  {
    id: '1',
    name: 'UGC',
    iconUri: 'https://via.placeholder.com/30',
  },
  {
    id: '2',
    name: 'NINEST',
    iconUri: 'https://via.placeholder.com/30',
  },
  {
    id: '3',
    name: 'AZAMI',
    iconUri: 'https://via.placeholder.com/30',
  },
  {
    id: '4',
    name: 'Musicians',
    iconUri: 'https://via.placeholder.com/30',
  },
];

export const mockPopularArtists: any = [
  {
    id: '1',
    legalFirstName: 'Elijah Kitaka',
    profileImages: ['https://via.placeholder.com/140'],
    isVerified: true,
    stageName: 'Elijah K',
    legalLastName: 'Kitaka',
    email: 'elijah.kitak@example.com',    
    phoneNumber: '1234567890',
    hasSubmittedDocuments: true,
    hasUpdatedProfile: true,
    isSuspended: false,
    verificationImages: [],
    profileVideoUrl: '',
    profileDescription: 'A popular musician known for his soulful tunes.',
    minimumBookingFee: 500,
  },
  {
    id: '2',
    legalFirstName: 'Mustar',
    legalLastName: 'Chiko',
    stageName: 'Mustar and Chiko',
    email: 'mustar.chiko@example.com',
    phoneNumber: '1234567890',
    hasSubmittedDocuments: true,
    hasUpdatedProfile: true,
    isSuspended: false,
    verificationImages: [],
    profileVideoUrl: '',
    profileDescription: 'A popular music group known for their energetic performances.',
    minimumBookingFee: 1000,                                              
    profileImages: ['https://via.placeholder.com/140'],
    isVerified: true,     

  },

];

export const GET_CATEGORIES = gql`
  query GetCategories {
    getCategories {
      id
      name
      iconUri
    }
  }
`;

const HomeScreen = () => {
  const { data, loading,refetch} = useQuery<any>(GET_CATEGORIES,{
    fetchPolicy: 'no-cache',
  });
  const [categories, setCategories] = useState<CategoryType[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>('');



  useEffect(() => {
    // Use mock data for now, replace with actual data when available
    if (data && data.getCategories) {
      console.log('Fetched categories:', data.getCategories);
      setCategories(data.getCategories);
    }
    
    // Select first category by default
    if (categories.length > 0) {
      setSelectedCategory(categories[0].id);
    }
  }, [data]);

  const handleCategoryPress = (categoryId: string) => {
    setSelectedCategory(categoryId);
  };

  const handleViewAllCategories = () => {
    // Navigate to categories screen
    console.log('View all categories');
  };

  const handleViewAllPopular = () => {
    // Navigate to popular artists screen
    console.log('View all popular artists');
  };

  const handleArtistPress = (artistId: string) => {
    // Navigate to artist profile
    console.log('Artist pressed:', artistId);
  };

  if (loading) {
    return (
      <Layout>
        <View style={styles.centered}>
          <Text>Loading...</Text>
        </View>
      </Layout>
    );
  }

  return (
    <Layout>
      <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
        {/* header image */}
        <View style={{ width: '100%', height: 200, backgroundColor: colors.gray200, borderRadius: 12, marginBottom: 16 }} >
          <Image
            source={require('../../assets/images/headerimg.png')}
            style={{ width: '100%', height: '100%', borderRadius: 12 }}
            resizeMode="cover"
          />
        </View>
        {/* Categories Section */}
        <SectionHeader
          title="Categories"
          showViewAll={true}
          onViewAllPress={handleViewAllCategories}
        />
        
        <HorizontalScrollList>
          {categories.map((category) => (
            <CategoryCard
              key={category.id}
              name={category.name}
              iconUri={category.iconUri}
              isSelected={selectedCategory === category.id}
              onPress={() => handleCategoryPress(category.id)}
            />
          ))}
        </HorizontalScrollList>
     
         
        {
          categories.map((category) => {

            return (
              <HomeCategorySection key={category.id} category={category} />
            )
          })
        }
         
      </ScrollView>
    </Layout>
  );
};

const styles = StyleSheet.create({
  container: {
    width:dimentions.vw,
    height:dimentions.vh,
    paddingHorizontal: 10,
    backgroundColor: colors.white,
  },
  centered: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default HomeScreen;