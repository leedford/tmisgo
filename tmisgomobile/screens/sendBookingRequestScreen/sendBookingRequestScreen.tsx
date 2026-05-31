import React, { useEffect, useState } from "react";
import { View, Text, StyleSheet, ScrollView, SafeAreaView, ToastAndroid } from "react-native";
import CustomAppBar from "../../components/CustomAppBar/CustomAppBar";
import Spacer from "../../components/Spacer/Spacer";
import CustomButton from "../../components/CustomBotton/CustomButton";
import colors from "../../constants/Colors";
import { useNavigation, useRoute } from "@react-navigation/native";
import { useMutation } from "@apollo/client/react";
import { gql } from "@apollo/client";
import { useSelector } from "react-redux";
import { RootState } from "../../redux/store";

const SEND_BOOKING_REQUEST = gql`
  mutation SendBookingRequest($userId: ID!, $artistAccountId: ID!, $defaultMessage: String) {
    sendBookingRequest(userId: $userId, artistAccountId: $artistAccountId, defaultMessage: $defaultMessage) {
      id
      status
    }
  }
`;

const terms = [
  "A booking request will be sent to the artist.",
  "Once accepted, you will be able to chat directly with the artist for a limited time.",
  "Please be respectful and communicate only about the booking.",
  "Payment and further arrangements will be handled after the artist accepts your request."
];

const SendBookingRequestScreen = () => {
  const navigation = useNavigation();

  const { user } = useSelector((state: RootState) => state.authSlice);
  const route = useRoute();
  // Expecting artistAccountId in route.params
  const { artistAccountId } = route.params as { artistAccountId: string };
  const [sendBookingRequest,{loading,data,error,reset}] = useMutation<{ sendBookingRequest: { id: string; status: string } }>(SEND_BOOKING_REQUEST);


  useEffect(() => {
    if (data && data.sendBookingRequest) {
      ToastAndroid.show("Booking request sent successfully!", 4000);
      setTimeout(() => {
        navigation.goBack();
      }, 2000);
    }
    if (error) {
      ToastAndroid.show("Failed to send booking request.", 4000);
    }
  }, [data, error]);    



  const handleSendBookingRequest = async () => {
    if (!user || !artistAccountId) return;
  
    try {

     sendBookingRequest({
        variables: {
          userId: user.id,
          artistAccountId,
          defaultMessage: "Hi, I would like to book you!"
        }
      })
     
    } catch (e) {
      ToastAndroid.show("Something went wrong while sending the booking request.", 4000);
      // Optionally show error
    }
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: colors.white }}>
      <CustomAppBar
        canMoveBack={true}
        title="Booking Request"
        description=""
      />
      <ScrollView contentContainerStyle={styles.container}>
        <Spacer height={20} />
        <Text style={styles.heading}>Before you continue</Text>
        <Spacer height={10} />
        {terms.map((term, idx) => (
          <View key={idx} style={styles.termRow}>
            <View style={styles.bullet} />
            <Text style={styles.termText}>{term}</Text>
          </View>
        ))}

        <Spacer height={40} />

        <CustomButton
          title="SEND BOOKING REQUEST"
          onPress={handleSendBookingRequest}
          loading={loading}
        />
        <Spacer height={20} />
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 20,
    paddingTop: 10,
    paddingBottom: 40,
    flexGrow: 1,
    justifyContent: 'flex-start',
    backgroundColor: colors.white,
  },
  heading: {
    fontSize: 20,
    fontWeight: 'bold',
    color: colors.black,
    marginBottom: 10,
  },
  termRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  bullet: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: colors.primary,
    marginTop: 7,
    marginRight: 12,
  },
  termText: {
    fontSize: 15,
    color: colors.gray500,
    flex: 1,
  },
  checkboxRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  checkbox: {
    fontSize: 24,
    marginRight: 10,
    color: colors.gray400,
  },
  checkboxChecked: {
    color: colors.primary,
  },
  acceptText: {
    fontSize: 15,
    color: colors.gray500,
    textDecorationLine: 'underline',
  },
});

export default SendBookingRequestScreen;
