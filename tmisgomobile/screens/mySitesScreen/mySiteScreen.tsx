import React, { useCallback, useEffect, useState } from 'react';
import { View, Text, FlatList, StyleSheet, TouchableOpacity, ActivityIndicator, ToastAndroid } from 'react-native';
import { gql} from '@apollo/client';
import { useQuery } from '@apollo/client/react';

import DashboardHeader from '../../components/DashboardHeader/DashboardHeader';
import ProjectCard from '../../components/ProjectCard/ProjectCard';
import CustomButton from '../../components/CustomBotton/CustomButton';
import colors from '../../constants/Colors';
import { Site } from '../../types/types';
import { useSelector } from 'react-redux';
import { RootState } from '../../redux/store';
import { useFocusEffect, useNavigation } from '@react-navigation/native';



const GET_MY_SITES = gql`
 query GetMySites($userId: ID!) {
  getMySites(userId: $userId) {
    _id
    name
    logoUrl
    status
    daysLeft
    progress
    notificationCount
  }
}
`;



type GetSiteData = {
  getMySites: Site[];
};

const MySitesScreen = () => {

  const {user} = useSelector((state:RootState)=>state.authSlice)
  const navigation = useNavigation()

  console.log(user,'_--------user')

  const { data, loading, error,refetch } = useQuery<GetSiteData>(GET_MY_SITES,{
    variables:{
      userId:user?._id
    }
  });

  const [sites,setSites] = useState<Site[]>([])

  useFocusEffect(
    useCallback(() => {
      // Refetch sites when screen is focused
      refetch();
    }, [refetch])
  );

  useEffect(()=>{
    if(data && data.getMySites){
      console.log(data.getMySites,"---------my sites")
      setSites(data.getMySites)
    }

    if(error){
      console.log(error,"--------errrrr")
      ToastAndroid.show("Something has gone wrong",4000)
    }
  },[data,error])


  if (loading) return <ActivityIndicator style={{flex: 1}} size="large" />;
  


  return (
    <View style={styles.container}>
      <DashboardHeader />
      
      {sites.length === 0 ? (
        // --- EMPTY STATE VIEW ---
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyTitle}>No Sites</Text>
          <Text style={styles.emptySub}>You have no sites at the moment</Text>
          <View style={{ width: '100%', marginTop: 20 }}>
            <CustomButton title="Add New" onPress={() => {
                   navigation.navigate('AddSiteScreen' as never)
            }} />
          </View>
        </View>
      ) : (
        // --- LIST VIEW ---
        <View style={{ flex: 1 }}>
          <View style={styles.listHeader}>
            <Text style={styles.title}>All Site</Text>
            <TouchableOpacity onPress={() => {
                   navigation.navigate('AddSiteScreen' as never)
            }}>
              <Text style={styles.addNewText}>Add New</Text>
            </TouchableOpacity>
          </View>
          
          <FlatList
            data={sites}
            keyExtractor={(item) => item.id}
            renderItem={({ item }) => <ProjectCard project={item} />}
            contentContainerStyle={{ paddingBottom: 40 }}
          />
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.white },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 40,
  },
  emptyTitle: { fontSize: 22, fontWeight: 'bold', color: colors.black },
  emptySub: { fontSize: 14, color: '#888', textAlign: 'center', marginTop: 8 },
  listHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    marginVertical: 20,
  },
  title: { fontSize: 22, fontWeight: 'bold', color: colors.black },
  addNewText: { fontSize: 14, color: '#333', fontWeight: '500' },
});

export default MySitesScreen;