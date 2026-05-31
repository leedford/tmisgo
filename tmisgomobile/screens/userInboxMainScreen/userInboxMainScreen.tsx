import React from "react";
import { View, Text, StyleSheet, ActivityIndicator, FlatList, Image, SafeAreaView, TouchableOpacity } from "react-native";
import { useQuery } from "@apollo/client/react";
import { gql } from "@apollo/client";
import { useSelector } from "react-redux";
import { RootState } from "../../redux/store";
import CustomAppBar from "../../components/CustomAppBar/CustomAppBar";
import Spacer from "../../components/Spacer/Spacer";
import colors from "../../constants/Colors";
import HeadingText from "../../components/HeadingText";
import BodyText from "../../components/BodyText";
import Icon from "@react-native-vector-icons/ionicons";

const GET_USER_CONVERSATIONS = gql`
  query GetUserConversations($userId: ID!) {
    getUserConversations(userId: $userId) {
      id
      lastMessage
      updatedAt
      artistAccount {
        id
        stageName
        profileImages
      }
    }
  }
`;

const UserInboxMainScreen = () => {
  const { user } = useSelector((state: RootState) => state.authSlice);
  const userId = user?.id;

  const { data, loading, error, refetch } = useQuery<{ getUserConversations: Array<{
    id: string;
    lastMessage: string;
    updatedAt: string;
    artistAccount: {
      id: string;
      stageName: string;
      profileImages: string[];
    };
  }> }>(GET_USER_CONVERSATIONS, {
    variables: { userId },
    skip: !userId,
    fetchPolicy: "network-only"
  });

  const conversations = data?.getUserConversations || [];

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: colors.white }}>
      <CustomAppBar
        canMoveBack={false}
        title="Inbox"
        description="Your conversations with artists"
      />
      <Spacer height={10} />
      {loading ? (
        <View style={styles.centered}><ActivityIndicator size={40} color={colors.black} /></View>
      )  : conversations.length === 0 ? (
        <View style={styles.centered}>
          <Icon name="chatbubble-ellipses-outline" size={60} color={colors.gray300} style={{ marginBottom: 20 }} />
          <HeadingText text="No Conversations Yet" textStyles={{ color: colors.gray500, fontSize: 22 }} />
          <BodyText text="You haven't started any conversations with artists yet. Book an artist to start chatting!" textStyles={{ color: colors.gray400, textAlign: 'center', marginTop: 10 }} />
          <Spacer height={20} />
        </View>
      ) : (
        <FlatList
          data={conversations}
          keyExtractor={item => item.id}
          contentContainerStyle={{ padding: 16 }}
          renderItem={({ item }) => (
            <TouchableOpacity style={styles.card} activeOpacity={0.8} onPress={() => { /* navigate to chat screen */ }}>
              <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                <Image
                  source={item.artistAccount.profileImages && item.artistAccount.profileImages.length > 0 ? { uri: item.artistAccount.profileImages[0] } : require('../../assets/images/headerimg.png')}
                  style={styles.artistImg}
                />
                <View style={{ marginLeft: 16, flex: 1 }}>
                  <Text style={styles.stageName}>{item.artistAccount.stageName}</Text>
                  <Text style={styles.lastMessage} numberOfLines={1}>{item.lastMessage || 'No messages yet.'}</Text>
                </View>
                <Text style={styles.date}>{new Date(item.updatedAt).toLocaleDateString()}</Text>
              </View>
            </TouchableOpacity>
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
  lastMessage: {
    fontSize: 14,
    color: colors.gray500,
    marginTop: 2,
    maxWidth: 180,
  },
  date: {
    fontSize: 12,
    color: colors.gray400,
    marginLeft: 8,
    minWidth: 70,
    textAlign: 'right',
  },
});

export default UserInboxMainScreen;
