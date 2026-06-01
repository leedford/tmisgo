import React, { useState } from 'react';
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  ToastAndroid,
  Dimensions,
} from 'react-native';

import { SafeAreaView } from 'react-native-safe-area-context';
import { gql } from '@apollo/client';
import { useMutation } from '@apollo/client/react';
import { useNavigation, useRoute } from '@react-navigation/native';
import colors from '../../constants/Colors';
import { screenNames } from '../../navigation/screenNames';
import CustomAppBar from '../../components/CustomAppBar/CustomAppBar';
import { ProgressTimeline } from '../../components/ProgressTimeLine/ProgressTimeLine';
import Ionicons from '@react-native-vector-icons/ionicons';

const { width } = Dimensions.get('window');

// GraphQL Mutation to finalize registration by persisting the security PIN
const SET_TEACHER_PIN = gql`
  mutation SetTeacherPin($teacherId: ID!, $pin: String!) {
    setTeacherPin(teacherId: $teacherId, pin: $pin) {
      id
      currentStep
      status
    }
  }
`;

export const SetPinScreen = () => {
  const navigation: any = useNavigation();
  const route: any = useRoute();
  const { teacherId } = route.params || { teacherId: 'mock-teacher-id' };

  const [pin, setPin] = useState<string>('');

  const [finalizePin, { loading }] = useMutation(SET_TEACHER_PIN, {
    onCompleted: data => {
      ToastAndroid.show(
        'Security PIN configured successfully!',
        ToastAndroid.SHORT,
      );
      // Registration complete, route them back to the core onboarding/auth entry point
      //   navigation.navigate(screenNames.GetOTP || "GetOTPScreen");
    },
    onError: err => {
      ToastAndroid.show(
        err.message || 'Failed to set security PIN.',
        ToastAndroid.SHORT,
      );
    },
  });

  // Handle number pad button inputs
  const handleKeyPress = (num: string) => {
    if (pin.length < 5) {
      setPin(prev => prev + num);
    }
  };

  // Handle pin deletion/backspace
  const handleBackspace = () => {
    setPin(prev => prev.slice(0, -1));
  };

  const handleContinue = () => {
    if (pin.length !== 5) {
      ToastAndroid.show(
        'Please complete your 5-digit PIN code.',
        ToastAndroid.SHORT,
      );
      return;
    }

    navigation.navigate(screenNames.SuccessScreen)

    // finalizePin({
    //   variables: {
    //     teacherId,
    //     pin,
    //   },
    // });
  };

  // Keypad matrix configuration tracking layout rows cleanly
  const keypadRows = [
    ['1', '2', '3'],
    ['4', '5', '6'],
    ['7', '8', '9'],
    ['', '0', 'BACKSPACE'],
  ];

  return (
    <SafeAreaView style={styles.container}>
      <CustomAppBar title="Set Your PIN" canMoveBack={true} />

      <View style={styles.contentContainer}>

       <ProgressTimeline currentStep={4} totalSteps={4} stepLabel="PIN" />


        {/* Top Centered Decorative Lock Asset Icon */}
        <View style={styles.lockIconBadge}>
        
            <Ionicons
                  name="lock-closed"
                  size={20}
                  color={colors.primary}
                />
        
        </View>

        {/* Narrative Context Headings */}
        <Text style={styles.mainTitle}>Create Your PIN</Text>
        <Text style={styles.subTitle}>
          Your 5-digit security PIN will be used for future logins to secure
          your educator profile.
        </Text>

        {/* 5-Digit Circular Progress Dot Group */}
        <View style={styles.dotsRow}>
          {[0, 1, 2, 3, 4].map(index => (
            <View
              key={index}
              style={[
                styles.pinDot,
                pin.length > index ? styles.filledPinDot : styles.emptyPinDot,
              ]}
            />
          ))}
        </View>

        {/* Integrated Native Numerical Keyboard Matrix */}
        <View style={styles.keypadContainer}>
          {keypadRows.map((row, rowIndex) => (
            <View key={rowIndex} style={styles.keypadRow}>
              {row.map((key, keyIndex) => {
                if (key === '') {
                  return <View key={keyIndex} style={styles.emptyKeypadCell} />;
                }
                if (key === 'BACKSPACE') {
                  return (
                    <TouchableOpacity
                      key={keyIndex}
                      style={[styles.keypadButton, styles.transparentKeyButton]}
                      onPress={handleBackspace}
                      activeOpacity={0.6}
                    >
                      <Text style={styles.backspaceButtonText}>⌫</Text>
                    </TouchableOpacity>
                  );
                }
                return (
                  <TouchableOpacity
                    key={keyIndex}
                    style={styles.keypadButton}
                    onPress={() => handleKeyPress(key)}
                    activeOpacity={0.6}
                  >
                    <Text style={styles.keypadButtonText}>{key}</Text>
                  </TouchableOpacity>
                );
              })}
            </View>
          ))}
        </View>

        {/* Sticky Continue Footer Button Core Component */}
        <TouchableOpacity
          style={[
            styles.continueButton,
            pin.length === 5
              ? styles.activeContinueBtn
              : styles.disabledContinueBtn,
          ]}
          onPress={handleContinue}
          disabled={pin.length !== 5 || loading}
          activeOpacity={0.8}
        >
          <Text
            style={[
              styles.continueButtonText,
              pin.length === 5 ? styles.activeText : styles.disabledText,
            ]}
          >
            {loading ? 'Saving PIN...' : 'Submit'}
          </Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8FAFC',
  },
  appHeader: {
    width: '100%',
    paddingHorizontal: 16,
    paddingVertical: 14,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderColor: colors.gray200,
    flexDirection: 'row',
    alignItems: 'center',
  },
  backButton: {
    paddingRight: 12,
  },
  backArrow: {
    fontSize: 20,
    fontWeight: '600',
    color: colors.primary,
  },
  appHeaderTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: colors.primary,
    flex: 1,
    textAlign: 'center',
    marginRight: 24, // Re-centers heading safely accounting for back arrow width
  },
  contentContainer: {
    flex: 1,
    alignItems: 'center',
    paddingHorizontal: 24,
    paddingTop: 32,
    paddingBottom: 24,
  },
  lockIconBadge: {
    width:40,
    height:40,
    borderRadius: 14,
    backgroundColor: '#FFEADC', // Soft brand tinted base background
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 24,
  },
  mainTitle: {
    fontSize: 24,
    fontWeight: '800',
    color: '#0F172A',
    marginBottom: 12,
    textAlign: 'center',
  },
  subTitle: {
    fontSize: 14,
    color: colors.textGray,
    textAlign: 'center',
    lineHeight: 22,
    paddingHorizontal: 16,
    marginBottom: 40,
  },
  dotsRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 20,
    marginBottom: 40,
  },
  pinDot: {
    width: 14,
    height: 14,
    borderRadius: 7,
    borderWidth: 2,
  },
  emptyPinDot: {
    borderColor: '#94A3B8',
    backgroundColor: 'transparent',
  },
  filledPinDot: {
    borderColor: colors.primary,
    backgroundColor: colors.primary,
  },
  progressBarContainer: {
    width: '100%',
    height: 4,
    backgroundColor: colors.gray200,
    borderRadius: 2,
    marginBottom: 36,
  },
  progressBarFill: {
    height: '100%',
    backgroundColor: colors.primary,
    borderRadius: 2,
  },
  keypadContainer: {
    width: '100%',
    gap: 12,
    marginBottom: 'auto', // Pushes the actions button flush against screen bases perfectly
  },
  keypadRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 12,
  },
  keypadButton: {
    flex: 1,
    height:40,
    backgroundColor: '#EBF2FA', // Soft light blue matrix button caps from blueprint
    borderRadius: 6,
    justifyContent: 'center',
    alignItems: 'center',
  },
  transparentKeyButton: {
    backgroundColor: 'transparent',
  },
  emptyKeypadCell: {
    flex: 1,
  },
  keypadButtonText: {
    fontSize: 20,
    fontWeight: '700',
    color: '#0F172A',
  },
  backspaceButtonText: {
    fontSize: 22,
    color: '#0F172A',
    fontWeight: '600',
  },
  continueButton: {
    width: '100%',
    height: 50,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'row',
  },
  disabledContinueBtn: {
    backgroundColor: '#E2E8F0',
  },
  activeContinueBtn: {
    backgroundColor: colors.primary,
  },
  continueButtonText: {
    fontSize: 15,
    fontWeight: '700',
  },
  disabledText: {
    color: '#94A3B8',
  },
  activeText: {
    color: '#FFFFFF',
  },
});
