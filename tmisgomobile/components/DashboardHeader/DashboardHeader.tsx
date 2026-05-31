import React, { useState } from 'react';
import { View, Text, Image, StyleSheet, TouchableOpacity, Modal, TouchableWithoutFeedback } from 'react-native';
import IonIcons from "@react-native-vector-icons/ionicons";
import { RootState } from '../../redux/store';
import colors from '../../constants/Colors';
import { useSelector } from 'react-redux';
import { useNavigation } from '@react-navigation/native';
import { screenNames } from '../../navigation/screenNames';

const DashboardHeader = () => {

  const navigation = useNavigation()
  const { user } = useSelector((state:RootState) => state.authSlice);

  const [menuVisible, setMenuVisible] = useState(false);

  const toggleMenu = () => setMenuVisible(!menuVisible);

  return (
    <View style={styles.container}>
      <View style={styles.profileSection}>
        <Image 
          source={{ uri: user?.avatarUrl || 'https://via.placeholder.com/50' }} 
          style={styles.avatar} 
        />
        <View style={styles.info}>
          <Text style={styles.name}>{user?.firstName}</Text>
          <Text style={styles.role}>{"Architect"}</Text>
        </View>
      </View>

      {/* Menu Trigger */}
      <TouchableOpacity onPress={toggleMenu} hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}>
        <IonIcons name="ellipsis-vertical" size={24} color={colors.black} />
      </TouchableOpacity>

      {/* Dropdown Menu */}
      {menuVisible && (
        <>
          {/* Transparent backdrop to close menu when clicking outside */}
          <TouchableWithoutFeedback onPress={() => setMenuVisible(false)}>
            <View style={styles.overlay} />
          </TouchableWithoutFeedback>
          
          <View style={styles.dropdown}>
            <TouchableOpacity 
              style={styles.menuItem} 
              onPress={() => {
                console.log("Navigate to Profile");
                setMenuVisible(false);
              }}
            >
              <IonIcons name="person-outline" size={18} color={colors.black} />
              <Text style={styles.menuText}>
                View Profile
              </Text>
            </TouchableOpacity>

    n        <View style={styles.separator} />

            <TouchableOpacity 
              style={styles.menuItem} 
              onPress={() => {
                navigation.navigate(screenNames.LinkDeviceScreen as never);
                setMenuVisible(false);
              }}
            >
              <IonIcons name="hardware-chip-outline" size={18} color={colors.black} />
              <Text style={styles.menuText}>
                Link device
              </Text>
            </TouchableOpacity>
          </View>
        </>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 15,
    backgroundColor: colors.white,
    zIndex: 1000, // Ensure header is above list content
  },
  profileSection: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  avatar: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: '#ccc',
  },
  info: {
    marginLeft: 12,
  },
  name: {
    fontSize: 18,
    fontWeight: 'bold',
    color: colors.black,
  },
  role: {
    fontSize: 14,
    color: '#666',
  },
  /* Dropdown Styles */
  overlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: -1000, // Cover the screen below
    backgroundColor: 'transparent',
  },
  dropdown: {
    position: 'absolute',
    top: 60,
    right: 20,
    backgroundColor: colors.white,
    borderRadius: 12,
    width: 160,
    paddingVertical: 5,
    // Shadow
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 5,
    zIndex: 2000,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 15,
  },
  menuText: {
    marginLeft: 10,
    fontSize: 14,
    color: colors.black,
    fontWeight: '500',
  },
  separator: {
    height: 1,
    backgroundColor: '#F0F0F0',
    marginHorizontal: 10,
  }
});

export default DashboardHeader;