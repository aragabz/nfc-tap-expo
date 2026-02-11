import React from 'react';
import { StyleSheet, View, Image } from 'react-native';
import { ThemedText } from '../themed-text';
import { ThemedView } from '../themed-view';
import { UserProfile } from '../../types/auth';
import { IconSymbol } from '../ui/icon-symbol';

interface ProfileCardProps {
  user: UserProfile;
}

export const ProfileCard: React.FC<ProfileCardProps> = ({ user }) => {
  return (
    <ThemedView style={styles.container}>
      <View style={styles.avatarContainer}>
        {user.photoUri ? (
          <Image source={{ uri: user.photoUri }} style={styles.avatar} />
        ) : (
          <View style={[styles.avatar, styles.placeholderAvatar]}>
            <IconSymbol name="person.fill" size={40} color="#fff" />
          </View>
        )}
      </View>
      <View style={styles.infoContainer}>
        <ThemedText type="subtitle" style={styles.name}>{user.fullName}</ThemedText>
        <ThemedText style={styles.email}>{user.email}</ThemedText>
        {user.jobTitle && <ThemedText style={styles.details}>{user.jobTitle}</ThemedText>}
        {user.organization && <ThemedText style={styles.details}>{user.organization}</ThemedText>}
      </View>
    </ThemedView>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 20,
    borderRadius: 12,
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
    borderWidth: 1,
    borderColor: 'rgba(150, 150, 150, 0.1)',
  },
  avatarContainer: {
    marginRight: 20,
  },
  avatar: {
    width: 80,
    height: 80,
    borderRadius: 40,
  },
  placeholderAvatar: {
    backgroundColor: '#007AFF',
    alignItems: 'center',
    justifyContent: 'center',
  },
  infoContainer: {
    flex: 1,
  },
  name: {
    fontSize: 20,
    fontWeight: '600',
  },
  email: {
    fontSize: 14,
    opacity: 0.6,
    marginTop: 2,
  },
  details: {
    fontSize: 14,
    opacity: 0.8,
    marginTop: 4,
  },
});
