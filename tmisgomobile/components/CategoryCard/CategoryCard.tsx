import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Image } from 'react-native';
import colors from '../../constants/Colors';

interface CategoryCardProps {
  name: string;
  iconUri?: string;
  onPress?: () => void;
  isSelected?: boolean;
}

const CategoryCard: React.FC<CategoryCardProps> = ({
  name,
  iconUri,
  onPress,
  isSelected = false,
}) => {

  console.log('CategoryCard iconUri:', iconUri);
  return (
    <TouchableOpacity
      style={[styles.container, isSelected && styles.selectedContainer]}
      onPress={onPress}
    >
      <View style={styles.iconContainer}>
        {iconUri ? (
          <Image
            source={{ uri: iconUri }}
            style={styles.icon}
            onError={() => {
              console.warn('Failed to load icon:', iconUri);
            }}
          />
        ) : (
          <View style={[styles.icon, {backgroundColor: colors.white, justifyContent: 'center', alignItems: 'center'}]}>
            <Text style={{fontSize: 18, color: colors.gray500}}>?</Text>
          </View>
        )}
      </View>
      <Text style={[styles.name, isSelected && styles.selectedName]}>
        {name}
      </Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    marginRight: 16,
    padding: 8,
  },
  selectedContainer: {
    backgroundColor: colors.white,
    borderRadius: 12,
  },
  iconContainer: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: colors.gray50,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
  },
  icon: {
    width: 30,
    height: 30,
    resizeMode: 'contain',
  },
  name: {
    fontSize: 12,
    color: colors.gray500,
    textAlign: 'center',
  },
  selectedName: {
    color: colors.primary,
    fontWeight: '600',
  },
});

export default CategoryCard;