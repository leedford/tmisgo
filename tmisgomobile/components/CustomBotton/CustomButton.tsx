import React from "react";
import { ActivityIndicator, StyleSheet, Text, TouchableOpacity, ViewStyle, TextStyle } from "react-native";
import colors from "../../constants/Colors";

interface Props {
  title: string;
  loading?: boolean;
  onPress: () => void;
  customStyles?: ViewStyle | ViewStyle[];
  textStyles?: TextStyle | TextStyle[];
}

const CustomButton = ({ title, onPress, customStyles, textStyles, loading }: Props) => {
  return (
    <TouchableOpacity
      onPress={onPress}
      disabled={loading}
      style={[styles.main, customStyles]}
      activeOpacity={0.8}
    >
      {loading ? (
        <ActivityIndicator color={colors.white} />
      ) : (
        <Text style={[styles.text, textStyles]}>
          {title}
        </Text>
      )}
    </TouchableOpacity>
  );
};

export default CustomButton;

const styles = StyleSheet.create({
  main: {
    width: "100%",
    height: 54,
    backgroundColor: colors.primary, // Automatically scales to the new TMIS primary color token
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 8,
    marginVertical: 4,
  },
  text: {
    fontSize: 16,
    fontWeight: "600",
    color: colors.white,
    textAlign: "center"
  }
});