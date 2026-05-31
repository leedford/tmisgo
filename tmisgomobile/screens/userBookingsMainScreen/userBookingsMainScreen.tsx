import React from "react";
import { View, Text, StyleSheet, ActivityIndicator, FlatList, Image, SafeAreaView } from "react-native";
import { useQuery } from "@apollo/client/react";
import { gql } from "@apollo/client";
import { useSelector } from "react-redux";
import { RootState } from "../../redux/store";
import CustomAppBar from "../../components/CustomAppBar/CustomAppBar";
import Spacer from "../../components/Spacer/Spacer";
import colors from "../../constants/Colors";
import HeadingText from "../../components/HeadingText";
import BodyText from "../../components/BodyText";
import CustomButton from "../../components/CustomBotton/CustomButton";
import Icon from "@react-native-vector-icons/ionicons";

const GET_USER_BOOKING_REQUESTS = gql`
  query GetUserBookingRequests($userId: ID!) {
    getUserBookingRequests(userId: $userId) {
      status
      id
      artistAccountId
      defaultMessage
      artistAccount {
        stageName
        profileImages
        id
      }
    }
  }
`;

const UserBookingsMainScreen = () => {

  const { user } = useSelector((state: RootState) => state.authSlice);
  const userId = user?.id;

  const { data, loading, error, refetch } = useQuery<{ getUserBookingRequests: Array<{
    status: string;
    id: string;
    artistAccountId: string;
    defaultMessage: string;
    artistAccount: {
      stageName: string;
      profileImages: string[];
      id: string;
    };
  }> }>(GET_USER_BOOKING_REQUESTS, {
    variables: { userId },
    skip: !userId,
    fetchPolicy: "network-only"
  });

  const bookings = data?.getUserBookingRequests || [];

  console.log(error,'---------user bookings error>>>>')

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: colors.white }}>
      <CustomAppBar
        canMoveBack={false}
        title="My Bookings"
        description="View and manage your recent bookings"
      />
      <Spacer height={10} />
      {loading ? (
        <View style={styles.centered}><ActivityIndicator size={40} color={colors.black} /></View>
      ): bookings.length === 0 ? (
        <View style={styles.centered}>
          <Icon name="alert" size={60} color={colors.gray300} style={{ marginBottom: 20 }} />
          <HeadingText text="No Bookings Yet" textStyles={{ color: colors.gray500, fontSize: 22 }} />
          <BodyText text="You haven't made any bookings yet. Start exploring and book your favorite artists!" textStyles={{ color: colors.gray400, textAlign: 'center', marginTop: 10 }} />
          <Spacer height={20} />
          <CustomButton title="Explore Artists" onPress={refetch} />
        </View>
      ) : (
        <FlatList
          data={bookings}
          keyExtractor={item => item.id}
          contentContainerStyle={{ padding: 16 }}
          renderItem={({ item }) => (
            <View style={styles.card}>
              <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                <Image
                  source={item.artistAccount.profileImages && item.artistAccount.profileImages.length > 0 ? { uri: item.artistAccount.profileImages[0] } : require('../../assets/images/headerimg.png')}
                  style={styles.artistImg}
                />
                <View style={{ marginLeft: 16, flex: 1 }}>
                  <Text style={styles.stageName}>{item.artistAccount.stageName}</Text>
                  <Text style={styles.status}>{item.status.toUpperCase()}</Text>
                  <Text style={styles.date}>{item.defaultMessage}</Text>
                </View>
              </View>
            </View>
          )}
        />
      )}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  centered: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 24,
  },
  card: {
    backgroundColor: colors.gray100,
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    shadowColor: colors.black,
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  artistImg: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: colors.gray200,
  },
  stageName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: colors.black,
  },
  status: {
    fontSize: 14,
    color: colors.primary,
    fontWeight: '600',
    marginTop: 2,
  },
  date: {
    fontSize: 12,
    color: colors.gray400,
    marginTop: 2,
  },
  emptyImg: {
    width: 120,
    height: 120,
    marginBottom: 20,
    borderRadius: 16,
    alignSelf: 'center',
  },
});

export default UserBookingsMainScreen;
