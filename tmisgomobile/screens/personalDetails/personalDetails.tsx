import React, { useEffect, useState } from 'react';
import {
  StyleSheet,
  Text,
  View,
  TextInput,
  ScrollView,
  TouchableOpacity,
  ToastAndroid,
} from 'react-native';

import { SafeAreaView } from 'react-native-safe-area-context';
import { gql } from '@apollo/client';
import { useMutation } from '@apollo/client/react';
import { useNavigation, useRoute } from '@react-navigation/native';
import colors from '../../constants/Colors';
import CustomButton from '../../components/CustomBotton/CustomButton';
import { screenNames } from '../../navigation/screenNames';
import CustomAppBar from '../../components/CustomAppBar/CustomAppBar';
import Ionicons from '@react-native-vector-icons/ionicons';

//@TODO pick NIRA RESPONSE

// GraphQL Mutation matching our unified backend architecture
const INITIALIZE_PROFILE = gql`
  mutation InitializeTeacherProfile(
    $nin: String!
    $fullName: String!
    $dateOfBirth: Date!
    $gender: String!
    $districtOfOrigin: String!
  ) {
    initializeTeacherProfile(
      nin: $nin
      fullName: $fullName
      dateOfBirth: $dateOfBirth
      gender: $gender
      districtOfOrigin: $districtOfOrigin
    ) {
      id
      nin
      currentStep
    }
  }
`;

const PersonalDetailsScreen = () => {
  const navigation: any = useNavigation();
  const route: any = useRoute();

  // Extract NIRA profile data forwarded from Step 1
  const { profile } = route.params || {
    profile: {
      nin: 'CM88014101XYZ9',
      fullName: 'NAKIMULI SARAH',
      dateOfBirth: '14 / 05 / 1988',
      gender: 'Female',
      districtOfOrigin: 'KAMPALA',
    },
  };

  const [fullName, setFullName] = useState(profile.fullName);
  const [dateOfBirth, setDateOfBirth] = useState(profile.dateOfBirth);
  const [gender, setGender] = useState(profile.gender);
  const [districtOfOrigin, setDistrictOfOrigin] = useState(
    profile.districtOfOrigin,
  );

  const [createProfile, { loading, data, error }] =
    useMutation<any>(INITIALIZE_PROFILE);

  useEffect(() => {
    if (data && data.initializeTeacherProfile) {
      // Clear route history stack step and head to Step 3
      navigation.navigate(screenNames.DocumentUpload, {
        teacherId: data.initializeTeacherProfile.id,
      });
    }

    if (error) {
      console.error('Error initializing profile:', error);
      ToastAndroid.show(
        'An error occurred while creating the profile.',
        ToastAndroid.SHORT,
      );
    }
  }, [data, error]);

  const parseDateOfBirth = (input: string): string => {
    if (!input || typeof input !== 'string') return input as unknown as string;
    const normalized = input.replace(/\s+/g, '').replace(/[-.]/g, '/');
    const parts = normalized.split('/').filter(Boolean);
    if (parts.length === 3) {
      const [day, month, year] = parts;
      const iso = `${year.padStart(4, '0')}-${month.padStart(
        2,
        '0',
      )}-${day.padStart(2, '0')}`;
      const d = new Date(iso);
      if (!isNaN(d.getTime())) return d.toISOString();
    }
    const d = new Date(input);
    return isNaN(d.getTime()) ? input : d.toISOString();
  };

  const handleContinue = () => {
    if (!fullName.trim() || !dateOfBirth.trim() || !districtOfOrigin.trim()) {
      ToastAndroid.show(
        'Please ensure all personal records are filled.',
        ToastAndroid.SHORT,
      );
      return;
    }

    createProfile({
      variables: {
        nin: profile.nin,
        fullName: fullName.trim(),
        dateOfBirth: parseDateOfBirth(dateOfBirth),
        gender: gender,
        districtOfOrigin: districtOfOrigin.trim(),
      },
    });
  };

  return (
    <SafeAreaView style={styles.container}>
      <CustomAppBar title="Personal Details" canMoveBack={true} />

      <ScrollView
        contentContainerStyle={styles.scrollContainer}
        showsVerticalScrollIndicator={false}
      >
        {/* Step Progress Metrics */}
        <View style={styles.progressWrapper}>
          <View style={styles.progressHeader}>
            <Text style={styles.stepText}>Step 2 of 4</Text>
            <Text style={styles.stepLabel}>Personal Details</Text>
          </View>
          <View style={styles.progressBarTrack}>
            <View style={[styles.progressBarFill, { width: '50%' }]} />
          </View>
        </View>

        {/* Identity Verified Green Success Alert Card */}
        <View style={styles.verifiedBanner}>
          <Text style={styles.shieldIcon}>
            <Ionicons
              name="shield-checkmark"
              size={20}
              color={colors.primary}
            />
          </Text>
          <Text style={styles.verifiedBannerText}>
            Identity verified via NIN. Please review and update the details
            below if necessary.
          </Text>
        </View>

        {/* Card 1: Legal Identity Section Group */}
        <View style={styles.detailsCard}>
          <View style={styles.cardHeaderRow}>
            <Text style={styles.cardHeaderIcon}></Text>
            <Text style={styles.cardHeaderTitle}>Legal Identity</Text>
          </View>

          <View style={styles.inputUnit}>
            <Text style={styles.fieldLabel}>Full Name (from NIN)</Text>
            <View style={styles.inputWrapper}>
              <TextInput
                style={styles.editableInput}
                value={fullName}
                onChangeText={setFullName}
              />
              <Text style={styles.editIcon}>
                <Ionicons
                  name="pencil"
                  size={14}
                  color={colors.gray400}
                  style={styles.editIcon}
                />
              </Text>
            </View>
          </View>

          <View style={styles.inputUnit}>
            <Text style={styles.fieldLabel}>Date of Birth</Text>
            <View style={styles.inputWrapper}>
              <TextInput
                style={styles.editableInput}
                value={dateOfBirth}
                onChangeText={setDateOfBirth}
              />
              <Text style={styles.editIcon}>
                <Ionicons
                  name="calendar"
                  size={14}
                  color={colors.gray400}
                  style={styles.editIcon}
                />
              </Text>
            </View>
          </View>

          <View style={styles.inputUnit}>
            <Text style={styles.fieldLabel}>Gender</Text>
            <View style={styles.inputWrapper}>
              <TextInput
                style={styles.editableInput}
                value={gender}
                onChangeText={setGender}
              />
              <Text style={styles.dropdownIcon}>▼</Text>
            </View>
          </View>
        </View>

        {/* Card 2: Administrative Area Section Group */}
        <View style={styles.detailsCard}>
          <View style={styles.cardHeaderRow}>
            <Text style={styles.cardHeaderIcon}></Text>
            <Text style={styles.cardHeaderTitle}>Administrative Area</Text>
          </View>

          <View style={styles.inputUnit}>
            <Text style={styles.fieldLabel}>District of Origin</Text>
            <View style={styles.inputWrapper}>
              <TextInput
                style={styles.editableInput}
                value={districtOfOrigin}
                onChangeText={setDistrictOfOrigin}
              />
              <Text style={styles.editIcon}>
                <Ionicons
                  name="pencil"
                  size={14}
                  color={colors.gray400}
                  style={styles.editIcon}
                />
              </Text>
            </View>
          </View>

          {/* Locked Read-Only Verified NIN Flag Wrapper */}
          <View style={styles.ninVerifyBadgeCard}>
            <View style={styles.ninLeftIndicator} />
            <View style={styles.ninBadgeContent}>
              <Text style={styles.ninBadgeLabel}>NIN Number</Text>
              <Text style={styles.ninBadgeValue}>{profile.nin}</Text>
            </View>
            <Text style={styles.verifiedGreenCheck}>
              <Ionicons
                name="checkmark-circle"
                size={20}
                color={colors.success}
              />
            </Text>
          </View>
        </View>

        {/* Horizontal Sticky Action Buttons Footer matching layout spacing blueprint */}
        <View style={styles.actionButtonsRow}>
          <TouchableOpacity
            style={styles.backActionButton}
            onPress={() => navigation.goBack()}
            activeOpacity={0.7}
          >
            <Text style={styles.backActionButtonText}>Back</Text>
          </TouchableOpacity>

          <View style={styles.continueButtonFlex}>
            <CustomButton
              title="Continue  ➔"
              loading={loading}
              onPress={handleContinue}
              customStyles={styles.customContinueBtn}
            />
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default PersonalDetailsScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8FAFC', // Subtle light canvas tone supporting white detail cards
  },
  appHeader: {
    width: '100%',
    paddingHorizontal: 16,
    paddingVertical: 14,
    backgroundColor: '#F0F5FA',
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
  },
  avatarPlaceholder: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: colors.gray300,
    overflow: 'hidden',
  },
  avatarInner: {
    width: '100%',
    height: '100%',
    backgroundColor: '#475569',
  },
  scrollContainer: {
    paddingHorizontal: 16,
    paddingTop: 20,
    paddingBottom: 30,
  },
  progressWrapper: {
    marginBottom: 20,
  },
  progressHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  stepText: {
    fontSize: 13,
    fontWeight: '700',
    color: colors.primary,
  },
  stepLabel: {
    fontSize: 13,
    fontWeight: '600',
    color: colors.textGray,
  },
  progressBarTrack: {
    width: '100%',
    height: 5,
    backgroundColor: colors.gray200,
    borderRadius: 2.5,
  },
  progressBarFill: {
    height: '100%',
    backgroundColor: colors.primary,
    borderRadius: 2.5,
  },
  verifiedBanner: {
    flexDirection: 'row',
    backgroundColor: '#A7F3D0', // Matches the soft mint light green banner backdrop fill in design
    borderWidth: 1,
    borderColor: '#6EE7B7',
    borderRadius: 8,
    padding: 12,
    alignItems: 'center',
    marginBottom: 20,
  },
  shieldIcon: {
    fontSize: 18,
    marginRight: 10,
    color: '#065F46',
  },
  verifiedBannerText: {
    flex: 1,
    fontSize: 13,
    fontWeight: '600',
    color: '#065F46',
    lineHeight: 18,
  },
  detailsCard: {
    backgroundColor: colors.surface,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: colors.gray200,
    padding: 16,
    marginBottom: 18,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  cardHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
    borderBottomWidth: 1,
    borderColor: '#F1F5F9',
    paddingBottom: 8,
  },
  cardHeaderIcon: {
    fontSize: 16,
    marginRight: 8,
    color: colors.primary,
  },
  cardHeaderTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: colors.textDark,
  },
  inputUnit: {
    marginBottom: 14,
  },
  fieldLabel: {
    fontSize: 12,
    fontWeight: '600',
    color: colors.textGray,
    marginBottom: 6,
  },
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    width: '100%',
    height: 46,
    borderWidth: 1,
    borderColor: colors.gray300,
    borderRadius: 6,
    paddingHorizontal: 12,
    backgroundColor: '#FFFFFF',
  },
  editableInput: {
    flex: 1,
    height: '100%',
    fontSize: 14,
    color: colors.textDark,
    fontWeight: '600',
  },
  editIcon: {
    fontSize: 14,
    color: colors.gray400,
    marginLeft: 6,
  },
  dropdownIcon: {
    fontSize: 10,
    color: colors.gray400,
    marginLeft: 6,
  },
  ninVerifyBadgeCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F1F5F9',
    borderRadius: 6,
    height: 54,
    paddingHorizontal: 14,
    marginTop: 6,
    overflow: 'hidden',
  },
  ninLeftIndicator: {
    position: 'absolute',
    left: 0,
    top: 0,
    bottom: 0,
    width: 4,
    backgroundColor: colors.primary,
  },
  ninBadgeContent: {
    flex: 1,
    paddingLeft: 4,
  },
  ninBadgeLabel: {
    fontSize: 11,
    color: colors.textGray,
    fontWeight: '500',
  },
  ninBadgeValue: {
    fontSize: 15,
    fontWeight: '700',
    color: colors.textDark,
    letterSpacing: 0.5,
  },
  verifiedGreenCheck: {
    fontSize: 16,
  },
  actionButtonsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    width: '100%',
    marginTop: 10,
    marginBottom: 10,
  },
  backActionButton: {
    width: 100,
    height: 48,
    borderWidth: 1.5,
    borderColor: colors.gray300,
    borderRadius: 6,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    marginRight: 12,
  },
  backActionButtonText: {
    fontSize: 14,
    fontWeight: '700',
    color: colors.textGray,
  },
  continueButtonFlex: {
    flex: 1,
  },
  customContinueBtn: {
    backgroundColor: colors.primary,
    borderRadius: 6,
    height: 48,
    marginVertical: 0,
  },
});
