import React, { useEffect, useState } from "react";
import { 
  StyleSheet, 
  Text, 
  View, 
  TextInput, 
  ScrollView, 
  ToastAndroid 
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import {gql } from "@apollo/client";
import { useLazyQuery } from "@apollo/client/react";
import { useNavigation } from "@react-navigation/native";
import colors from "../../constants/Colors";
import CustomButton from "../../components/CustomBotton/CustomButton";
import { screenNames } from "../../navigation/screenNames";
import CustomAppBar from "../../components/CustomAppBar/CustomAppBar";

// TypeScript types for GraphQL query
type VerifyNINVariables = {
  nin: string;
};

type VerifyNINResponse = {
  verifyNIN: {
    nin: string;
    fullName: string;
    dateOfBirth: string;
    gender: string;
    districtOfOrigin: string;
  };
};

// GraphQL query matching our unified backend architecture
const VERIFY_NIN = gql`
  query VerifyNIN($nin: String!) {
    verifyNIN(nin: $nin) {
      nin
      fullName
      dateOfBirth
      gender
      districtOfOrigin
    }
  }
`;

export const NinVerificationScreen = () => {
  const navigation: any = useNavigation();
  const [nin, setNin] = useState("");
  const [errorMsg, setErrorMsg] = useState("");

  const [runVerify, { loading,data,error }] = useLazyQuery<VerifyNINResponse, VerifyNINVariables>(VERIFY_NIN);

  useEffect(()=>{
    if (data && data.verifyNIN) {
      // Handle successful verification
      navigation.navigate(screenNames.PersonalDetails, { profile: data.verifyNIN });
    }

    if (error) {
      const serverMessage = error.message || "Verification failed. Check your network link.";
      setErrorMsg(serverMessage);
      ToastAndroid.show(serverMessage, 3000);
    }
  }, [data, error]);

  const handleVerify = () => {
    setErrorMsg("");
    const sanitized = nin.trim().toUpperCase();

    if (!sanitized) {
      setErrorMsg("National ID Number is required");
      return;
    }
    // Ugandan National Identification Numbers follow a strict 14-character standard string length
    if (sanitized.length !== 14) {
      setErrorMsg("NIN must be exactly 14 characters");
      return;
    }

    runVerify({ variables: { nin: sanitized } });
  };

  return (
    <SafeAreaView style={styles.container}>

     <CustomAppBar
       title="Verify Identity"
       canMoveBack={true}

     />

      <ScrollView contentContainerStyle={styles.scrollContainer} keyboardShouldPersistTaps="handled">
        
        {/* Step Indicator Module */}
        <View style={styles.progressWrapper}>
          <View style={styles.progressHeader}>
            <Text style={styles.stepText}>Step 1 of 4</Text>
            <Text style={styles.stepLabel}>NIN Verification</Text>
          </View>
          <View style={styles.progressBarTrack}>
            <View style={[styles.progressBarFill, { width: "25%" }]} />
          </View>
        </View>

        
        <View style={styles.formBlock}>
          <Text style={styles.inputLabel}>Enter National ID Number (NIN)</Text>
          <View style={[styles.inputContainer, errorMsg ? styles.inputErrorBorder : styles.inputNormalBorder]}>
            <Text style={styles.prefixText}>UG</Text>
            <TextInput
              style={styles.textInput}
              value={nin}
              onChangeText={(val) => {
                setNin(val);
                if (errorMsg) setErrorMsg("");
              }}
              placeholder="CM000000000XXX"
              placeholderTextColor={colors.gray400}
              autoCapitalize="characters"
              autoCorrect={false}
              maxLength={14}
            />
          </View>
          {errorMsg ? <Text style={styles.errorText}>{errorMsg}</Text> : null}
        </View>

        {/* Informational Legal Card */}
        <View style={styles.infoCard}>
          <View style={styles.infoBadge}>
            <Text style={styles.infoBadgeText}>i</Text>
          </View>
          <Text style={styles.infoCardText}>
            Your NIN is required to ensure the security of your TMISGO account and verify your identity.
          </Text>
        </View>

        {/* Primary Operational Execution Button Component */}
        <View style={styles.buttonWrapper}>
          <CustomButton 
            title="Verify Identity" 
            loading={loading} 
            onPress={handleVerify} 
            customStyles={styles.actionButton}
          />
        </View>

      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { 
    flex: 1, 
    backgroundColor: colors.background 
  },
  appHeader: {
    width: "100%",
    paddingHorizontal: 20,
    paddingVertical: 16,
    backgroundColor: "#F0F5FA",
    borderBottomWidth: 1,
    borderColor: colors.gray200,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between"
  },
  headerTitleGroup: {
    flexDirection: "row",
    alignItems: "center"
  },
  institutionalIcon: {
    fontSize: 16,
    marginRight: 8,
    color: colors.primary
  },
  appHeaderTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: colors.primary
  },
  scrollContainer: { 
    flexGrow: 1, 
    paddingHorizontal: 20, 
    paddingTop: 24,
    paddingBottom: 20
  },
  progressWrapper: { 
    marginBottom: 36 
  },
  progressHeader: { 
    flexDirection: "row", 
    justifyContent: "space-between", 
    marginBottom: 10 
  },
  stepText: { 
    fontSize: 13, 
    fontWeight: "700", 
    color: colors.primary 
  },
  stepLabel: { 
    fontSize: 13, 
    fontWeight: "600", 
    color: colors.textGray 
  },
  progressBarTrack: { 
    width: "100%", 
    height: 5, 
    backgroundColor: colors.gray200, 
    borderRadius: 2.5 
  },
  progressBarFill: { 
    height: "100%", 
    backgroundColor: colors.primary, 
    borderRadius: 2.5 
  },
  headerBlock: { 
    marginBottom: 32 
  },
  titleText: { 
    fontSize: 24, 
    fontWeight: "700", 
    color: colors.textDark, 
    marginBottom: 10 
  },
  bodyText: { 
    fontSize: 14, 
    color: colors.textGray, 
    lineHeight: 22 
  },
  formBlock: { 
    marginBottom: 24 
  },
  inputLabel: { 
    fontSize: 13, 
    fontWeight: "700", 
    color: colors.textDark, 
    marginBottom: 8 
  },
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    width: "100%",
    height: 52,
    borderRadius: 6,
    backgroundColor: colors.surface,
    paddingHorizontal: 14
  },
  inputNormalBorder: { 
    borderWidth: 1, 
    borderColor: colors.gray300 
  },
  inputErrorBorder: { 
    borderWidth: 1, 
    borderColor: colors.danger 
  },
  prefixText: {
    fontSize: 15,
    fontWeight: "700",
    color: "#5C5C5C",
    marginRight: 8
  },
  textInput: { 
    flex: 1,
    height: "100%",
    fontSize: 15, 
    color: colors.textDark,
    fontWeight: "500"
  },
  helperText: {
    fontSize: 11,
    color: colors.textGray,
    marginTop: 6,
    fontWeight: "500"
  },
  errorText: { 
    fontSize: 12, 
    fontWeight: "500", 
    color: colors.danger, 
    marginTop: 6 
  },
  infoCard: { 
    flexDirection: "row", 
    backgroundColor: "#F4F7FC", 
    borderWidth: 1, 
    borderColor: "#E5ECF6", 
    padding: 14, 
    borderRadius: 8, 
    alignItems: "flex-start", 
    marginBottom: 32 
  },
  infoBadge: { 
    width: 18, 
    height: 18, 
    borderRadius: 9, 
    backgroundColor: colors.primary, 
    justifyContent: "center", 
    alignItems: "center", 
    marginRight: 10,
    marginTop: 2
  },
  infoBadgeText: { 
    color: colors.white, 
    fontSize: 11, 
    fontWeight: "700" 
  },
  infoCardText: { 
    flex: 1, 
    fontSize: 13, 
    color: colors.textGray, 
    lineHeight: 18,
    fontWeight: "500"
  },
  buttonWrapper: {
    width: "100%",
    marginBottom: 40
  },
  actionButton: {
    backgroundColor: colors.primary,
    borderRadius: 6,
    height: 52
  },
  footer: { 
    marginTop: "auto", 
    alignItems: "center" 
  },
  footerAuthority: { 
    fontSize: 12, 
    fontWeight: "600", 
    color: colors.textGray,
    marginBottom: 6
  },
  supportRow: {
    flexDirection: "row",
    alignItems: "center"
  },
  supportIcon: {
    fontSize: 11,
    color: colors.textGray,
    marginRight: 4
  },
  footerSupport: { 
    fontSize: 11, 
    fontWeight: "500", 
    color: colors.textGray 
  }
});