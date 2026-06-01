

import React, { useState } from "react";
import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  TouchableOpacity,
  ToastAndroid,
  Dimensions
} from "react-native";

import { SafeAreaView } from "react-native-safe-area-context";
import { pick, isKnownType } from "@react-native-documents/picker"; 
import { gql } from "@apollo/client";
import { useMutation } from "@apollo/client/react";

import { useNavigation, useRoute } from "@react-navigation/native";
import colors from "../../constants/Colors";
import { screenNames } from "../../navigation/screenNames";
import CustomAppBar from "../../components/CustomAppBar/CustomAppBar";
import Spacer from "../../components/Spacer/Spacer";
import Ionicons from '@react-native-vector-icons/ionicons';


const { width } = Dimensions.get("window");

// GraphQL Mutation to handle file URIs or uploaded references
const UPLOAD_DOCUMENTS = gql`
  mutation UploadAcademicDocuments(
    $teacherId: ID!
    $degreeCertificate: String!
    $academicTranscript: String
    $teachingLicense: String
  ) {
    uploadAcademicDocuments(
      teacherId: $teacherId
      degreeCertificate: $degreeCertificate
      academicTranscript: $academicTranscript
      teachingLicense: $teachingLicense
    ) {
      id
      currentStep
    }
  }
`;

export const DocumentUploadScreen = () => {
  const navigation: any = useNavigation();
  const route: any = useRoute();
  const { teacherId } = route.params || { teacherId: "mock-teacher-id" };

  // File tracking states (storing local file names or URIs)
  const [degreeFile, setDegreeFile] = useState<string | null>(null);
  const [transcriptFile, setTranscriptFile] = useState<string | null>(null);
  const [licenseFile, setLicenseFile] = useState<string | null>(null);

  // Responsive modern picker execution loop
  const handleDocumentPick = async (type: "degree" | "transcript" | "license") => {
    try {
      // Pinpoint valid format restrictions safely using utility conversions
      const targetType = isKnownType({ kind: "extension", value: "pdf" });

      // Execute new array-destructured pick method
      const [response] = await pick({
        type: [targetType.mimeType || "application/pdf", "image/*"],
        allowMultiSelection: false, // Default matching design layout
      });

      if (response && response.uri) {
        // Grab filename safely (or fallback smoothly)
        const selectedName = response.name || "academic_document.pdf";
        
        if (type === "degree") setDegreeFile(selectedName);
        // Save response.uri to state to pass to your GraphQL Upload mutation later
        
        ToastAndroid.show(`Loaded: ${selectedName}`, ToastAndroid.SHORT);
      }
    } catch (err: any) {
      // The package throws a specific object if the user cancels out of the picker sheet
      if (err?.code === "DOCUMENT_PICKER_CANCELED") {
        console.log("User backed out of file selection panel.");
      } else {
        ToastAndroid.show("Error accessing file subsystem", ToastAndroid.SHORT);
        console.error(err);
      }
    }
  };

  const [submitDocuments, { loading }] = useMutation(UPLOAD_DOCUMENTS, {
    onCompleted: (data) => {
      ToastAndroid.show("Documents recorded successfully!", ToastAndroid.SHORT);
      // Navigate to Step 4 Final Screen
    //   navigation.navigate(screenNames.ReviewSubmit || "ReviewSubmitScreen", { teacherId });
    },
    onError: (err) => {
      ToastAndroid.show(err.message || "Failed to upload files.", ToastAndroid.SHORT);
    }
  });

  const handlePickFile = (type: "degree" | "transcript" | "license", method: "camera" | "pdf") => {
    // Simulated selection logic matching picker targets
    const sampleFileName = `Document_${Math.floor(1000 + Math.random() * 9000)}.${method === "pdf" ? "pdf" : "jpg"}`;
    
    if (type === "degree") setDegreeFile(sampleFileName);
    if (type === "transcript") setTranscriptFile(sampleFileName);
    if (type === "license") setLicenseFile(sampleFileName);

    ToastAndroid.show(`Selected ${sampleFileName}`, ToastAndroid.SHORT);
  };

  const handleContinue = () => {
    // if (!degreeFile) {
    //   ToastAndroid.show("Degree/Diploma Certificate is required to proceed.", ToastAndroid.LONG);
    //   return;
    // }

    // submitDocuments({
    //   variables: {
    //     teacherId,
    //     degreeCertificate: degreeFile,
    //     academicTranscript: transcriptFile || "",
    //     teachingLicense: licenseFile || ""
    //   }
    // });
    navigation.navigate(screenNames.SetPinScreen);
  };

  return (
    <SafeAreaView style={styles.container}>
      <CustomAppBar
       title="Document Upload"
       canMoveBack={true}
       />

      <ScrollView contentContainerStyle={styles.scrollContainer} showsVerticalScrollIndicator={false}>
        
        {/* Progress Timeline Tracking Indicator */}
        <View style={styles.progressWrapper}>
          <View style={styles.progressHeader}>
            <Text style={styles.stepText}>Step 3 of 4</Text>
            <Text style={styles.stepLabel}>Document Verification</Text>
          </View>
          <View style={styles.progressBarTrack}>
            <View style={[styles.progressBarFill, { width: "75%" }]} />
          </View>
        </View>

        {/* Headings */}
        <View style={styles.headingBlock}>
          <Text style={styles.titleText}>Upload Academic Documents</Text>
          <Text style={styles.bodyText}>
            Please provide clear digital copies of your professional credentials. PDFs or high-quality photos are accepted.
          </Text>
        </View>

        <Spacer height={30}/>

        {/* Main Required Upload Box: Degree/Diploma Certificate */}
        <View style={styles.mainUploadCard}>
          <View style={styles.uploadCardHeader}>
            <View style={styles.cardHeaderTitleGroup}>
              <Text style={styles.mainCardTitle}>Degree/Diploma Certificate</Text>
            </View>
            <View style={styles.requiredBadge}>
              <Text style={styles.requiredBadgeText}>REQUIRED</Text>
            </View>
          </View>

          {/* Dotted Upload Dropzone Container */}
          <View style={styles.dropzoneBox}>
            
            <Text style={styles.dropzoneText}>
              {degreeFile ? `Selected: ${degreeFile}` : "Tap to select or take photo"}
            </Text>
            <Text style={styles.maxSizeText}>Maximum size: 5MB</Text>

            {/* Quick-choice Picker Action Buttons */}
            <View style={styles.pickerActionsRow}>
              <TouchableOpacity 
                style={styles.pickerSubButton} 
                onPress={() => handlePickFile("degree", "camera")}
              >
                <Ionicons
                  name="camera"
                  size={20}
                  color={colors.primary}
                />
              </TouchableOpacity>
              <TouchableOpacity 
                style={[styles.pickerSubButton, styles.pdfButtonBackground]} 
                onPress={() => handlePickFile("degree", "pdf")}
              >
                <Ionicons
              name="document-text"
              size={20}
              color={colors.primary}
            />
              </TouchableOpacity>
            </View>
          </View>
        </View>

        <Spacer height={20}/>

        {/* Bottom Horizontal Split Action Button Bar Group */}
        <View style={styles.actionButtonsRow}>
          <TouchableOpacity 
            style={styles.saveDraftButton} 
            onPress={() => ToastAndroid.show("Draft entries cached locally.", ToastAndroid.SHORT)}
          >
            <Text style={styles.saveDraftText}>Save Draft</Text>
          </TouchableOpacity>

          <TouchableOpacity 
            style={[styles.continueButton, loading && styles.disabledButton]} 
            onPress={handleContinue}
            disabled={loading}
          >
            <Text style={styles.continueButtonText}>
              {loading ? "Saving..." : "Continue ➔"}
            </Text>
          </TouchableOpacity>
        </View>

      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F8FAFC"
  },
  appHeader: {
    width: "100%",
    paddingHorizontal: 16,
    paddingVertical: 14,
    backgroundColor: "#F0F5FA",
    borderBottomWidth: 1,
    borderColor: colors.gray200,
    flexDirection: "row",
    alignItems: "center"
  },
  backButton: {
    paddingRight: 12
  },
  backArrow: {
    fontSize: 20,
    fontWeight: "600",
    color: colors.primary
  },
  appHeaderTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: colors.primary,
    flex: 1
  },
  headerRightActions: {
    flexDirection: "row",
    alignItems: "center"
  },
  notificationIcon: {
    fontSize: 18,
    marginRight: 14,
    color: colors.textDark
  },
  avatarPlaceholder: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: "#94A3B8"
  },
  scrollContainer: {
    paddingHorizontal: 16,
    paddingTop: 20,
    paddingBottom: 30
  },
  progressWrapper: {
    marginBottom: 24
  },
  progressHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 8
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
  headingBlock: {
    marginBottom: 24
  },
  titleText: {
    fontSize: 22,
    fontWeight: "800",
    color: "#1E293B",
    marginBottom: 8
  },
  bodyText: {
    fontSize: 13,
    color: colors.textGray,
    lineHeight: 20
  },
  mainUploadCard: {
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: "#E2E8F0",
    borderRadius: 10,
    padding: 16,
    marginBottom: 20
  },
  uploadCardHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 14
  },
  cardHeaderTitleGroup: {
    flexDirection: "row",
    alignItems: "center"
  },
  cardIcon: {
    fontSize: 16,
    marginRight: 8
  },
  mainCardTitle: {
    fontSize: 14,
    fontWeight: "700",
    color: "#334155"
  },
  requiredBadge: {
    backgroundColor: "#FEE2E2",
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 4
  },
  requiredBadgeText: {
    fontSize: 10,
    color: "#EF4444",
    fontWeight: "700"
  },
  dropzoneBox: {
    width: "100%",
    backgroundColor: "#F8FAFC",
    borderWidth: 1.5,
    borderStyle: "dashed",
    borderColor: "#CBD5E1",
    borderRadius: 8,
    paddingVertical: 24,
    alignItems: "center"
  },
  cloudIcon: {
    fontSize: 28,
    color: colors.primary,
    marginBottom: 8
  },
  dropzoneText: {
    fontSize: 14,
    fontWeight: "600",
    color: "#475569",
    marginBottom: 4,
    textAlign: "center",
    paddingHorizontal: 12
  },
  maxSizeText: {
    fontSize: 11,
    color: colors.textGray,
    marginBottom: 16
  },
  pickerActionsRow: {
    flexDirection: "row",
    gap: 12
  },
  pickerSubButton: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#FFFFFF",
    borderWidth: 1,
    borderColor: "#CBD5E1",
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 6,
    elevation: 1,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 1
  },
  pdfButtonBackground: {
    backgroundColor: "#E2E8F0"
  },
  pickerSubButtonText: {
    fontSize: 13,
    fontWeight: "600",
    color: "#334155"
  },
  gridRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 32
  },
  gridCard: {
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: "#E2E8F0",
    borderRadius: 8,
    width: (width - 44) / 2,
    paddingVertical: 20,
    paddingHorizontal: 12,
    alignItems: "center",
    justifyContent: "center",
    height: 120
  },
  gridCardIcon: {
    fontSize: 22,
    marginBottom: 8
  },
  gridCardTitle: {
    fontSize: 12,
    fontWeight: "700",
    color: "#475569",
    textAlign: "center",
    marginBottom: 8,
    height: 32,
    textAlignVertical: "center"
  },
  uploadLabelAction: {
    fontSize: 11,
    fontWeight: "700",
    color: colors.primary
  },
  activeUploadedColor: {
    color: "#10B981"
  },
  actionButtonsRow: {
    flexDirection: "row",
    alignItems: "center",
    width: "100%",
    gap: 12
  },
  saveDraftButton: {
    flex: 1,
    height: 48,
    borderWidth: 1.5,
    borderColor: "#CBD5E1",
    borderRadius: 6,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#FFFFFF"
  },
  saveDraftText: {
    fontSize: 14,
    fontWeight: "700",
    color: "#64748B"
  },
  continueButton: {
    flex: 2,
    height: 48,
    backgroundColor: colors.primary,
    borderRadius: 6,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center"
  },
  disabledButton: {
    opacity: 0.6
  },
  continueButtonText: {
    color: "#FFFFFF",
    fontSize: 14,
    fontWeight: "700"
  }
});