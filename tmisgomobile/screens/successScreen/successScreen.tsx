import React from "react";
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  Dimensions
} from "react-native";

import { SafeAreaView } from "react-native-safe-area-context";
import { useNavigation } from "@react-navigation/native";
import colors from "../../constants/Colors";
import { screenNames } from "../../navigation/screenNames";

const { width } = Dimensions.get("window");

export const SuccessScreen = () => {
  const navigation: any = useNavigation();

  const handleGetStarted = () => {
    // Navigate cleanly to the application's core login or entry portal step
    navigation.reset({
      index: 0,
      routes: [{ name: screenNames.GetOTPScreen }],
    });
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.contentContainer}>
        
       
        <View style={styles.successBadgeOuter}>
          <View style={styles.successBadgeInner}>
            <Text style={styles.checkmarkIcon}>✓</Text>
          </View>
        </View>

        {/* Informational Text Hierarchy Block */}
        <Text style={styles.mainTitle}>Verification Submitted!</Text>
        
        <Text style={styles.subTitle}>
          Your academic profile and credentials have been successfully loaded into the TMISGO registry.
        </Text>

        {/* Helpful Info Context Card */}
        <View style={styles.infoCard}>
          <Text style={styles.infoCardTitle}>What happens next?</Text>
          <Text style={styles.infoCardBody}>
            The Ministry review panel will audit your uploaded document attachments. You will receive an SMS status alert once your educator identity validation is completed.
          </Text>
        </View>

      </View>

      {/* Sticky Bottom Action Action Trigger */}
      <View style={styles.footerContainer}>
        <TouchableOpacity 
          style={styles.primaryButton} 
          onPress={handleGetStarted}
          activeOpacity={0.8}
        >
          <Text style={styles.primaryButtonText}>Go to Login ➔</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F8FAFC",
    justifyContent: "space-between"
  },
  contentContainer: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 28,
    paddingTop: 40
  },
  successBadgeOuter: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: "#DCFCE7", 
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 32,
    elevation: 2,
    shadowColor: "#10B981",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 10,
  },
  successBadgeInner: {
    width: 72,
    height: 72,
    borderRadius: 36,
    backgroundColor: "#10B981",
    justifyContent: "center",
    alignItems: "center"
  },
  checkmarkIcon: {
    fontSize: 36,
    color: "#FFFFFF",
    fontWeight: "bold"
  },
  mainTitle: {
    fontSize: 24,
    fontWeight: "800",
    color: "#0F172A",
    marginBottom: 14,
    textAlign: "center"
  },
  subTitle: {
    fontSize: 14,
    color: colors.textGray,
    textAlign: "center",
    lineHeight: 22,
    paddingHorizontal: 10,
    marginBottom: 36
  },
  infoCard: {
    width: "100%",
    backgroundColor: "#FFFFFF",
    borderWidth: 1,
    borderColor: "#E2E8F0",
    borderRadius: 12,
    padding: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.04,
    shadowRadius: 4,
    elevation: 1
  },
  infoCardTitle: {
    fontSize: 15,
    fontWeight: "700",
    color: "#1E293B",
    marginBottom: 8
  },
  infoCardBody: {
    fontSize: 13,
    color: "#64748B",
    lineHeight: 20
  },
  footerContainer: {
    paddingHorizontal: 24,
    paddingBottom: 32,
    backgroundColor: "#F8FAFC"
  },
  primaryButton: {
    width: "100%",
    height: 52,
    backgroundColor: colors.primary,
    borderRadius: 8,
    justifyContent: "center",
    alignItems: "center"
  },
  primaryButtonText: {
    color: "#FFFFFF",
    fontSize: 15,
    fontWeight: "700"
  }
});