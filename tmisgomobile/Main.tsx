import { useSelector } from 'react-redux';
import { RootState, useAppDispatch } from './redux/store';
import SplashAuthScreen from './screens/splashAuthScreen/splashAuthScreen';
import NavHost from './navigation/NavHost';
import { useEffect } from 'react';
import { asyncGetData } from './utils/asyncStorageHelpers';
import { storageKeys } from './constants/storageKeys';
import { _authenticateUserByToken } from './redux/actions/auth.actions';

import { ApolloClient, InMemoryCache, HttpLink } from '@apollo/client';
import { ApolloProvider } from '@apollo/client/react';
import { GQL_URL } from './constants/api';
import { setToken } from './redux/feature/auth.feature';
import AuthModal from './components/AuthModal/AuthModal';


const Main = () => {
  const { isInitializing,token } = useSelector(
    (state: RootState) => state.authSlice,
  );
  const dispatch = useAppDispatch();

  // On mount, check for token and set it, then authenticate user if token exists
  useEffect(() => {
    async function init() {
      const storedToken = await asyncGetData(storageKeys.TOKEN);
      if (storedToken) {
        dispatch(setToken(storedToken.value));
        dispatch(_authenticateUserByToken({ token: storedToken.value as string }));
      } else {
        dispatch(setToken(null));
      }
    }
    if (!isInitializing) init();
  }, [isInitializing, dispatch]);

  // Initialize Apollo Client
  const client = new ApolloClient({
    link: new HttpLink({
      uri: GQL_URL,
      headers: {
        authorization: token ? `Bearer ${token}` : '',
      },
    }),
    cache: new InMemoryCache(),
  });

  return (
    <ApolloProvider client={client}>
      {isInitializing ? <SplashAuthScreen /> : <NavHost />}
      <AuthModal />
    </ApolloProvider>
  );
};

export default Main;
