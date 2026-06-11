import React from 'react';
import { ScrollView, StyleSheet, View } from 'react-native';

interface HorizontalScrollListProps {
  children: React.ReactNode;
}

const HorizontalScrollList: React.FC<HorizontalScrollListProps> = ({
  children,
}) => {
  return (
    <ScrollView
      horizontal
      showsHorizontalScrollIndicator={false}
      contentContainerStyle={styles.contentContainer}
    >
      {children}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  contentContainer: {
    paddingHorizontal: 16,
    paddingVertical: 8,
  },
});

export default HorizontalScrollList;