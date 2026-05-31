import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Image } from 'react-native';
import colors from '../../constants/Colors';

interface ArtistCardProps {
  stageName: string;
  category?: string;
  imageUri: string;
  isVerified?: boolean;
  onPress?: () => void;
}

const ArtistCard: React.FC<ArtistCardProps> = ({
  stageName,
  category,
  imageUri,
  isVerified = false,
  onPress,
}) => {
  return (
    <TouchableOpacity style={styles.container} onPress={onPress}>
      <View style={styles.imageContainer}>
        <Image source={{ uri: imageUri }} style={{width:"100%",height:"100%",objectFit:"fill"}} />
      </View>

      <View style={styles.infoContainer}>
        <View style={styles.nameContainer}>
          <Text style={styles.name} numberOfLines={1}>
            {stageName}
          </Text>

          {isVerified && (
            <Text style={styles.verifiedBadge}>✓</Text>
          )}
        </View>
        <Text style={styles.category} numberOfLines={1}>
          {category}
        </Text>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    width: 140,
    marginRight: 12,
    overflow: 'hidden',
  },
  imageContainer: {
    width: 140,
    height: 140,
    borderRadius: 12,
    backgroundColor: colors.gray200,
    overflow: 'hidden',
  },
  infoContainer: {
    marginTop: 8,
    paddingHorizontal: 4,
  },
  nameContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  name: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.black,
    flex: 1,
  },
  verifiedBadge: {
    fontSize: 12,
    color: colors.primary,
    fontWeight: 'bold',
    marginLeft: 4,
  },
  category: {
    fontSize: 12,
    color: colors.gray500,
    marginTop: 2,
  },
});

export default ArtistCard;