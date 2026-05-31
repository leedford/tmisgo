import { useSelector } from "react-redux"
import { RootState, useAppDispatch } from "../redux/store"
import { gql } from "@apollo/client"
import { useQuery } from "@apollo/client/react"
import UpdateAppScreen from "../screens/updateAppScreen/updateAppScreen"
import { useEffect, useState } from "react"
import AuthStack from "./AuthStack"
import AsyncStorage from "@react-native-async-storage/async-storage"
import OnboardingScreen from "../screens/onBoardingScreen/onBoardingScreen"
import { setOnBoardingStatus } from "../redux/feature/auth.feature"
import SitesStack from "./SitesStack"
import SiteMainNavigation from "./siteMainNavigation"



const GET_VERSION = gql`
  query GetVersion {
    getVersion {
      currentVersion
      newVersion
      downloadUri
    }
  }
`;



const NavHost=()=>{
    
    const APP_VERSION = 6.0

    const {data} = useQuery<any>(GET_VERSION);

    const dispatch = useAppDispatch()

    const {showAuthStack,isFirstLaunch,isAuthenticated} = useSelector((state:RootState)=> state.authSlice)
    const {selectedSite} = useSelector((state:RootState)=> state.siteSlice)

    const [newVersion,setNewVersion] = useState<number>(0)
    const [uri,setUri] = useState<string>("")


    useEffect(() => {
      checkFirstLaunch();
    }, []);



  const checkFirstLaunch = async () => {
    try {
      const hasViewedOnboarding = await AsyncStorage.getItem('@viewedOnboarding');

      dispatch(setOnBoardingStatus(hasViewedOnboarding === 'true'));

    } catch (error) {
      console.error('Error checking onboarding status:', error);
      dispatch(setOnBoardingStatus(true)); // Default to show onboarding on error
    }
  };

    /**
     * Get current in app version from async storage
     * [add one if not found]
     */


    useEffect(()=>{
      if(data && data.getVersion){
         setNewVersion(data.getVersion.newVersion)
         setUri(data.getVersion.downloadUri)
      }
    },[data])

  
    

     if(isFirstLaunch){
        return <OnboardingScreen/>    
     }


     if(isAuthenticated && !showAuthStack && !selectedSite){
        return <SitesStack/>
     }

     if(isAuthenticated && !showAuthStack && selectedSite){
        return <SiteMainNavigation/>
     }


    if (newVersion > APP_VERSION) {
         return <UpdateAppScreen uri={uri}/>
    }

   

    return (
        // <UserMainNavigation/> 
        <AuthStack/>
        // <SitesStack/>

        // <AuthSuccessScreen/>
        // <AddUserInfoScreen/>
    )
}

export default NavHost