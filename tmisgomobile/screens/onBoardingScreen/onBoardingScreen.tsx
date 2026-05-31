import React from "react";
import { StyleSheet, Text, View,Image, ScrollView, Dimensions } from "react-native";
import colors from "../../constants/Colors";
import CustomButton from "../../components/CustomBotton/CustomButton";
import { SafeAreaView } from "react-native-safe-area-context";
import { useNavigation } from "@react-navigation/native";
import Logo from "../../components/Logo/Logo";
import { screenNames } from "../../navigation/screenNames";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useAppDispatch } from "../../redux/store";
import { setOnBoardingStatus } from "../../redux/feature/auth.feature";

const { width } = Dimensions.get("window");

export const OnboardingScreen = () => {

  const navigation:any = useNavigation();
  const dispatch  = useAppDispatch();

  const handleAdvanceWorkspace = async () => {
    try {
      // 1. Persist to storage so the splash screen guard remembers this choice
      await AsyncStorage.setItem("@viewedOnboarding", "true");
      
      // 2. Clear Redux status flag immediately. 
      // NavHost instantly detects this change and swaps out Onboarding for AuthStack!
      dispatch(setOnBoardingStatus(false));
    } catch (error) {
      console.error("Failed to save onboarding configuration state:", error);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContainer} showsVerticalScrollIndicator={false}>
        
        {/* Top Header - App Title and Small Icon Emblem */}
        <View style={styles.headerContainer}>
          <View style={styles.iconWrapper}>
            <Logo/>
          </View>
          <Text style={styles.headerTitle}>TMISGO</Text>
        </View>

         {/* Informational Text Context */}
        <View style={styles.textContainer}>
          <Text style={styles.subParagraph}>
            Empowering educators through seamless digital management.
          </Text>
        </View>


        {/* Central Hero Graphic Area */}
        <View style={styles.heroContainer}>
          <Image 
            source={require("../../assets/onboarding_hero.jpg")} 
            style={styles.heroImage}
            resizeMode="cover"
          />
        </View>

       
        {/* Authentication Interactive CTA Controls */}
        <View style={styles.actionContainer}>
          <CustomButton 
            title="Get started  ➔" 
            onPress={handleAdvanceWorkspace}
            customStyles={styles.loginButton}
          />
          {/* <CustomButton 
            title="Register" 
             onPress={handleAdvanceWorkspace}
            customStyles={styles.registerButton}
            textStyles={styles.registerButtonText}
          /> */}
        </View>

        {/* Government Authority Verification Footer */}
        <View style={styles.footerContainer}>
          <Text style={styles.systemSubtext}>Ministry of Education and Sports (MoES) Uganda</Text>
        </View>

      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  scrollContainer: {
    flexGrow: 1,
    alignItems: "center",
    paddingBottom: 24,
  },
  headerContainer: {
    alignItems: "center",
    marginTop: 20,
    marginBottom: 24,
  },
  iconWrapper: {
    padding: 6,
    backgroundColor: colors.white,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: colors.gray100,
    elevation: 2,
    shadowColor: colors.black,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    marginBottom: 12,
  },
  flagPlaceholder: {
    width: 44,
    height: 44,
    borderRadius: 6,
    backgroundColor: colors.black,
    justifyContent: "center",
    alignItems: "center",
    overflow: "hidden",
  },
  innerFlagCircle: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: colors.primary, // Fallback color token trace matching layout profile
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: "700",
    color: colors.primary,
    letterSpacing: 0.3,
  },
  heroContainer: {
    width: width - 32,
    height: 290,
    borderRadius: 12,
    overflow: "hidden",
    backgroundColor: colors.primaryLight,
    marginBottom: 32,
  },
  heroImage: {
    width: "100%",
    height: "100%",
  },
  textContainer: {
    alignItems: "center",
    paddingHorizontal: 28,
    marginBottom: 36,
  },
  mainHeading: {
    fontSize: 24,
    fontWeight: "700",
    color: colors.textDark,
    textAlign: "center",
    marginBottom: 16,
  },
  subParagraph: {
    fontSize: 15,
    color: colors.textGray,
    textAlign: "center",
    lineHeight: 24,
  },
  actionContainer: {
    width: "100%",
    paddingHorizontal: 20,
    marginBottom: 40,
  },
  loginButton: {
    backgroundColor: colors.primary,
    height: 52,
    borderRadius: 8,
    marginBottom: 12,
  },
  registerButton: {
    backgroundColor: colors.gray50,
    height: 52,
    borderRadius: 8,
    borderWidth: 1.5,
    borderColor: colors.black,
  },
  registerButtonText: {
    color: colors.textDark,
    fontWeight: "600",
  },
  footerContainer: {
    width: "100%",
    backgroundColor: "#F4F6FA", // Specific subtle blue/grey tint block context background
    paddingVertical: 20,
    alignItems: "center",
    marginTop: "auto",
  },
  badgeLineRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 6,
  },
  accentLine: {
    width: 14,
    height: 1.5,
    backgroundColor: colors.primary,
  },
  badgeLabel: {
    fontSize: 11,
    fontWeight: "700",
    color: colors.textGray,
    marginHorizontal: 8,
    letterSpacing: 0.5,
  },
  authorityText: {
    fontSize: 13,
    fontWeight: "700",
    color: colors.textDark,
    textAlign: "center",
    marginBottom: 2,
  },
  systemSubtext: {
    fontSize: 12,
    color: colors.textGray,
    textAlign: "center",
  },
});