import React from "react";
import { StyleSheet, Text, View, Animated } from "react-native";
import colors from "../../constants/Colors";

interface ProgressTimelineProps {
  currentStep: number;
  totalSteps: number;
  stepLabel: string;
}

export const ProgressTimeline: React.FC<ProgressTimelineProps> = ({
  currentStep,
  totalSteps,
  stepLabel,
}) => {
  // Calculate dynamic percentage width for the progress tracking line bar
  const progressPercent = Math.min(Math.max((currentStep / totalSteps) * 100, 0), 100);

  return (
    <View style={styles.progressWrapper}>
      <View style={styles.progressHeader}>
        <Text style={styles.stepText}>
          Step {currentStep} of {totalSteps}
        </Text>
        <Text style={styles.stepLabel}>{stepLabel}</Text>
      </View>
      <View style={styles.progressBarTrack}>
        <View style={[styles.progressBarFill, { width: `${progressPercent}%` }]} />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  progressWrapper: {
    width: "100%",
    marginBottom: 24,
  },
  progressHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 8,
  },
  stepText: {
    fontSize: 13,
    fontWeight: "700",
    color: colors.primary,
  },
  stepLabel: {
    fontSize: 13,
    fontWeight: "600",
    color: colors.textGray,
  },
  progressBarTrack: {
    width: "100%",
    height: 5,
    backgroundColor: colors.gray200,
    borderRadius: 2.5,
  },
  progressBarFill: {
    height: "100%",
    backgroundColor: colors.primary,
    borderRadius: 2.5,
  },
});