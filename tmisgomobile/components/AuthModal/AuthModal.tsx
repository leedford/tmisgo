import React from "react";
import { Modal, View, StyleSheet, Pressable } from "react-native";
import BodyText from "../BodyText";
import Spacer from "../Spacer/Spacer";
import CustomButton from "../CustomBotton/CustomButton";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../../redux/store";
import { showAuthModal, showAuthStack } from "../../redux/feature/auth.feature";
import Icon from "@react-native-vector-icons/ionicons"

const AuthModal = () => {
  const dispatch = useDispatch();
  const { authModalStatus } = useSelector((state: RootState) => state.authSlice);

  return (
    <Modal
      visible={authModalStatus}
      animationType="slide"
      transparent
      onRequestClose={() => dispatch(showAuthModal(false))}
    >
      <View style={styles.overlay}>
        
        <View style={styles.modalContent}>
          <View style={{width: '100%',height: 50, alignItems: 'flex-end'}}>
          <Pressable
            onPress={() => dispatch(showAuthModal(false))}
          >
            <Icon name="close" size={24} color="black" />
          </Pressable>
        </View>

         <Spacer/>
          
          <BodyText text="Login or Create an account to continue" />
          <Spacer />
          <CustomButton
            title="LOGIN / SIGN UP"
            onPress={() => {
              dispatch(showAuthStack(true));
              dispatch(showAuthModal(false)); // Hide modal after opening auth stack
            }}
          />
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.4)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    width: '80%',
    backgroundColor: 'white',
    borderRadius: 16,
    padding: 24,
    alignItems: 'center',
    elevation: 5,
  },
});

export default AuthModal;
