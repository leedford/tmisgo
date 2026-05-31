import { SafeAreaView, View } from 'react-native';
import HeadingText from '../../components/HeadingText';
import Layout from '../../components/Layout/Layout';
import { StyleSheet } from 'react-native';
import colors from '../../constants/Colors';
import Spacer from '../../components/Spacer/Spacer';
import { RootState, useAppDispatch } from '../../redux/store';
import {
  setUserMainNavigationInitialRoute,
  showAuthModal,
  showRegisterArtistStack,
  switchToArtistAccount,
} from '../../redux/feature/auth.feature';
import ListItem from '../../components/UserProfileListItem/UserProfileListItem';

import Icon from '@react-native-vector-icons/ionicons';
import { useSelector } from 'react-redux';
import { screenNames } from '../../navigation/screenNames';


const UserProfileScreen = () => {

  const dispatch = useAppDispatch();

  const { user } = useSelector((state: RootState) => state.authSlice);

  return (

    <SafeAreaView style={{ flex: 1, backgroundColor: colors.white }}>

      <Layout>
        <View style={styles.main}>
          <View style={{ width: '100%', alignItems: 'flex-start' }}>
            
            <HeadingText text="Profile" />

            <Spacer height={100} />

            {user && user.artistAccount ? (
              <ListItem
                onPress={() => {
                   dispatch(switchToArtistAccount())
                }}
                icon={<Icon name="swap-vertical" size={30} />}
                title="Switch to artist account"
                text="Manage all your bookings on the go"
                style={{
                  backgroundColor: colors.white,
                  borderColor: colors.gray200,
                }}
              />
            ) : (
              <ListItem
                onPress={() => {
                  if(!user){
                    dispatch(setUserMainNavigationInitialRoute(screenNames.ProfileTab))
                    dispatch(showAuthModal(true))
                  }

                  if(user){
                    dispatch(showRegisterArtistStack(true))
                  }
                }}
                icon={<Icon name="person-add-sharp" size={30} />}
                title="Create an artist account"
                text="This is for Musicians, DJs, comedians, MCs and more"
                style={{
                  backgroundColor: colors.white,
                  borderColor: colors.gray200,
                }}
              />
            )}

            <Spacer />
          </View>
        </View>
      </Layout>
    </SafeAreaView>
  );
};

export default UserProfileScreen;

const styles = StyleSheet.create({
  main: {
    width: '100%',
    height: '100%',
    justifyContent: 'flex-start',
    alignItems: 'center',
    backgroundColor: colors.white,
    paddingHorizontal: 15,
    position: 'relative',
  },
});
