import React from 'react';
import { Image, StyleSheet, View } from 'react-native';
import { ThemedView } from '../../components/ThemedView';
import HeadingText from '../../components/HeadingText';
import BodyText from '../../components/BodyText';
import Spacer from '../../components/Spacer/Spacer';

// Mock user data for demonstration
const user = {
  id: '1',
  nickName: 'artbukuser',
  profilePicture: 'https://placehold.co/100x100',
  firstName: 'Jane',
  lastName: 'Doe',
  mobileNumber: '+1234567890',
  country: { name: 'Kenya', code: 'KE' },
};

const ProfileDetailsScreen = () => {
  return (
    <View style={styles.container}>
      <Spacer height={32} />
      <Image
        source={{ uri: user.profilePicture }}
        style={styles.avatar}
        resizeMode="cover"
      />
      <Spacer height={24} />
      <HeadingText text={user.nickName} />
      <Spacer height={8} />
      <BodyText text={`${user.firstName} ${user.lastName}`} />
      <Spacer height={8} />
      <BodyText text={`Mobile: ${user.mobileNumber}`} />
      <Spacer height={8} />
      <BodyText text={`Country: ${user.country.name}`} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    padding: 24,
  },
  avatar: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: '#eee',
  },
});

export default ProfileDetailsScreen;
