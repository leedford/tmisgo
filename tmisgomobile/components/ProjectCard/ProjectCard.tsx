import React from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity } from 'react-native';
import colors from '../../constants/Colors';
import { useAppDispatch } from '../../redux/store';
import { setSelectedSite } from '../../redux/feature/site.feature';
import { Site } from '../../types/types';

const ProjectCard = ({ project }: { project:Site }) => {

  // const progressPercent = (project.progress || 0) * 100;

  const dispatch = useAppDispatch()

  return (
    <TouchableOpacity onPress={()=> dispatch(setSelectedSite(project)) }>
    <View style={styles.card}>
      {project.notificationCount > 0 && (
        <View style={styles.badge}>
          <Text style={styles.badgeText}>{project.notificationCount}</Text>
        </View>
      )}
      
      <View style={styles.row}>
        <View style={styles.logoContainer}>
          <Image source={{ uri: project.logoUrl }} style={styles.logo} resizeMode="contain" />
        </View>
        <View style={styles.details}>
          <Text style={styles.projectName}>{project.name}</Text>
          <Text style={styles.statusText}>
            Status : <Text style={styles.statusValue}>{project.status.replace('_', ' ')}</Text>
          </Text>
          <Text style={styles.daysText}>Days left: {project.daysLeft}</Text>
          
          {/* Progress Bar */}
          <View style={styles.progressTrack}>
            <View 
              style={[
                styles.progressFill, 
                { width: `${50}%`, backgroundColor: project.status === 'CLOSED' ? '#FF5252' : '#00C853' }
              ]} 
            />
          </View>
        </View>
      </View>
    </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.white,
    borderRadius:8,
    padding: 20,
    marginBottom: 20,
    marginHorizontal: 20,
    borderWidth:1,
    borderColor:"#F0F0F0",
    position: 'relative',
  },
  badge: {
    position: 'absolute',
    top: -5,
    right: -5,
    backgroundColor: '#FF5252',
    width: 24,
    height: 24,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 10,
  },
  badgeText: { color: colors.white, fontSize: 12, fontWeight: 'bold' },
  row: { flexDirection: 'row', alignItems: 'center' },
  logoContainer: {
    width: 70,
    height: 70,
    borderRadius: 15,
    borderWidth: 1,
    borderColor: '#F0F0F0',
    justifyContent: 'center',
    alignItems: 'center',
  },
  logo: { width: 50, height: 50 },
  details: { flex: 1, marginLeft: 15 },
  projectName: { fontSize: 20, fontWeight: '600', color: '#333', marginBottom: 5 },
  statusText: { fontSize: 12, color: '#888' },
  statusValue: { fontWeight: '600' },
  daysText: { fontSize: 12, color: '#888', marginBottom: 10 },
  progressTrack: { height: 4, backgroundColor: '#F0F0F0', borderRadius: 2, overflow: 'hidden' },
  progressFill: { height: '100%' },
});

export default ProjectCard;