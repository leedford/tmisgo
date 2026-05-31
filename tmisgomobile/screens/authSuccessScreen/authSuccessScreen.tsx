import React, { useEffect } from "react";
import { View, StyleSheet, Text } from "react-native";
import IonIcons from "@react-native-vector-icons/ionicons";
import HeadingText from "../../components/HeadingText";
import CustomButton from "../../components/CustomBotton/CustomButton";
import colors from "../../constants/Colors";
import { useNavigation } from "@react-navigation/native";
import { screenNames } from "../../navigation/screenNames";
import { useAppDispatch } from "../../redux/store";
import { getAuthToken } from "../../constants/authorization";
import { _authenticateUserByToken } from "../../redux/actions/auth.actions";
import { showAuthStack } from "../../redux/feature/auth.feature";

const AuthSuccessScreen = () => {
  
  const dispatch  = useAppDispatch();

  return (
    <View style={styles.main}>
      <View style={{ justifyContent: "center", alignItems: "center" }}>
        <IonIcons name="checkmark-circle" size={80} color={colors.black} />
        <HeadingText text="Success!" textStyles={{ textAlign: "center" }} />
        <View style={{ width: "70%", marginTop: 10 }}>
          <Text style={{ textAlign: "center", color: colors.black, fontSize: 16 }}>
            You have successfully logged in.You can now continue
          </Text>
        </View>
      </View>
      <View style={{ marginTop: 40, width: '100%', alignItems: 'center' }}>
        <CustomButton
          title="CONTINUE"
          onPress={async () =>{ 
            const token = await getAuthToken()
             dispatch(_authenticateUserByToken({token:token as string}))
             dispatch(showAuthStack(false))

        }}
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  main: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: colors.white,
    paddingHorizontal: 15,
    paddingVertical: 60,
  },
});

export default AuthSuccessScreen;
