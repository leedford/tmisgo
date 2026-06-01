import React, { useEffect, useState } from "react";
import { StyleSheet, ToastAndroid, View, Text, TouchableOpacity } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useSelector } from "react-redux";
import * as yup from 'yup';
import { Formik } from 'formik';
import { useNavigation } from "@react-navigation/native";

import BodyText from "../../components/BodyText";
import CustomButton from "../../components/CustomBotton/CustomButton";
import HeadingText from "../../components/HeadingText";
import PhoneInput from "../../components/PhoneInput/PhoneInput";
import Spacer from "../../components/Spacer/Spacer";
import colors from "../../constants/Colors";
import { RootState, useAppDispatch } from "../../redux/store";
import { _getOTP } from "../../redux/actions/auth.actions";
import { resetAuthState, setCallingCode, setMobileNumber } from "../../redux/feature/auth.feature";
import { screenNames } from "../../navigation/screenNames";
import { dimentions } from "../../constants/dimentions";

const GetOTPScreen = () => {
  const navigation:any = useNavigation();
  const dispatch = useAppDispatch();
  const { loading, isError, isSuccess, message } = useSelector((state: RootState) => state.authSlice);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (isSuccess) {
      dispatch(resetAuthState());
      navigation.navigate(screenNames.VerifyOTP);
    }

    if (isError && message) {
      ToastAndroid.show(message, 4000);
      setTimeout(() => {
        dispatch(resetAuthState());
      }, 4000);
    }
  }, [isError, message, isSuccess]);

  const handleGettingOTP = async (phone: string) => {
    try {
      if (phone.length === 0 || phone.length > 10) {
        setError("Invalid Number");
        return;
      }
      
      dispatch(setMobileNumber(phone));
      dispatch(setCallingCode("+256"));
      dispatch(_getOTP({
        mobileNumber: phone,
        callingCode: "+256"
      }));
    } catch (error) {
      console.log(error);
    }
  };

  let schema = yup.object().shape({
    phoneNumber: yup.string().required("Phone number is required").min(9, "Too short").max(9, "Number must be 9 digits long"),
  });

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: colors.white }}>
      <View style={styles.main}>
        <Spacer height={100} />
        <HeadingText text="Sign in" />
        <Spacer height={15} />
        <BodyText text="Enter mobile number to continue" />
        <Spacer height={30} />
        
        <View style={{ padding: 4, width: "100%" }}>
          <Formik
            onSubmit={(values, actions) => {
              handleGettingOTP(values.phoneNumber);
              actions.resetForm();
            }}
            initialValues={{ phoneNumber: "", code: "+256" }}
            validationSchema={schema}
          >
            {({ values, errors, setFieldValue, touched, handleSubmit }) => (
              <View style={{ width: "100%" }}>
                <PhoneInput
                  onCountryCodeChange={(code) => setFieldValue("code", code)}
                  value={values.phoneNumber}
                  onChangeText={(phoneNumber) => setFieldValue("phoneNumber", phoneNumber)}
                  error={errors.phoneNumber && touched.phoneNumber ? errors.phoneNumber : ""}
                />
                
                <Spacer height={24} />
                
                <CustomButton
                  title="GET OTP"
                  onPress={() => handleSubmit()}
                  loading={loading}
                />
              </View>
            )}
          </Formik>
        </View>

        {/* PERSISTENT LINK TO REGISTRATION SYSTEM IF NOT ACCOUNT FOOTPRINT PRESENT */}
        <Spacer height={30} />
        <View style={styles.registerLinkContainer}>
          <Text style={styles.noAccountText}>Don't have an account? </Text>
          <TouchableOpacity 
            onPress={() =>{
              navigation.navigate(screenNames.NinVerification);
            }}
            activeOpacity={0.7}
          >
            <Text style={styles.registerLinkText}>Register here</Text>
          </TouchableOpacity>
        </View>
        
      </View>  
    </SafeAreaView>
  );
};

export default GetOTPScreen;

const styles = StyleSheet.create({
  main: {
    width: "100%",
    height: dimentions.vh,
    justifyContent: "flex-start",
    alignItems: "center",
    backgroundColor: colors.white,
    paddingHorizontal: 20,
  },
  registerLinkContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    marginTop: 10,
  },
  noAccountText: {
    fontSize: 14,
    color: colors.textGray,
  },
  registerLinkText: {
    fontSize: 14,
    fontWeight: "600",
    color: colors.primary, 
    textDecorationLine: "underline"
  }
});