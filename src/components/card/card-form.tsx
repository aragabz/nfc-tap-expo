import React, { useState } from 'react';
import {
  StyleSheet,
  TextInput,
  TouchableOpacity,
  View,
  Image,
  ScrollView,
  Alert,
} from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { BusinessCard } from '../../types/card';
import { ThemedText } from '../themed-text';
import { ThemedView } from '../themed-view';

interface CardFormProps {
  initialData?: BusinessCard | null;
  onSubmit: (data: Partial<BusinessCard>) => void;
  isLoading?: boolean;
}

export const CardForm = ({ initialData, onSubmit, isLoading }: CardFormProps) => {
  const [fullName, setFullName] = useState(initialData?.fullName || '');
  const [jobTitle, setJobTitle] = useState(initialData?.jobTitle || '');
  const [company, setCompany] = useState(initialData?.company || '');
  const [phone, setPhone] = useState(initialData?.phone || '');
  const [email, setEmail] = useState(initialData?.email || '');
  const [profileImage, setProfileImage] = useState(initialData?.profileImage || '');

  const pickImage = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ['images'],
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.5,
      base64: true,
    });

    if (!result.canceled && result.assets[0].base64) {
      setProfileImage(`data:image/jpeg;base64,${result.assets[0].base64}`);
    }
  };

  const handleSubmit = () => {
    if (!fullName.trim()) {
      Alert.alert('Error', 'Full Name is required');
      return;
    }
    onSubmit({
      fullName,
      jobTitle,
      company,
      phone,
      email,
      profileImage,
    });
  };

  return (
    <ScrollView style={styles.container}>
      <TouchableOpacity onPress={pickImage} style={styles.imageContainer}>
        {profileImage ? (
          <Image source={{ uri: profileImage }} style={styles.image} />
        ) : (
          <View style={[styles.image, styles.placeholder]}>
            <ThemedText>Add Photo</ThemedText>
          </View>
        )}
      </TouchableOpacity>

      <View style={styles.inputContainer}>
        <ThemedText style={styles.label}>Full Name *</ThemedText>
        <TextInput
          style={styles.input}
          value={fullName}
          onChangeText={setFullName}
          placeholder="Enter full name"
          placeholderTextColor="#999"
        />

        <ThemedText style={styles.label}>Job Title</ThemedText>
        <TextInput
          style={styles.input}
          value={jobTitle}
          onChangeText={setJobTitle}
          placeholder="Enter job title"
          placeholderTextColor="#999"
        />

        <ThemedText style={styles.label}>Company</ThemedText>
        <TextInput
          style={styles.input}
          value={company}
          onChangeText={setCompany}
          placeholder="Enter company name"
          placeholderTextColor="#999"
        />

        <ThemedText style={styles.label}>Phone</ThemedText>
        <TextInput
          style={styles.input}
          value={phone}
          onChangeText={setPhone}
          placeholder="Enter phone number"
          keyboardType="phone-pad"
          placeholderTextColor="#999"
        />

        <ThemedText style={styles.label}>Email</ThemedText>
        <TextInput
          style={styles.input}
          value={email}
          onChangeText={setEmail}
          placeholder="Enter email address"
          keyboardType="email-address"
          autoCapitalize="none"
          placeholderTextColor="#999"
        />
      </View>

      <TouchableOpacity
        style={[styles.button, isLoading && styles.disabled]}
        onPress={handleSubmit}
        disabled={isLoading}
      >
        <ThemedText style={styles.buttonText}>
          {isLoading ? 'Saving...' : 'Save Card'}
        </ThemedText>
      </TouchableOpacity>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 20,
  },
  imageContainer: {
    alignItems: 'center',
    marginBottom: 20,
  },
  image: {
    width: 120,
    height: 120,
    borderRadius: 60,
  },
  placeholder: {
    backgroundColor: '#f0f0f0',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#ccc',
    borderStyle: 'dashed',
  },
  inputContainer: {
    marginBottom: 20,
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 5,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    marginBottom: 15,
    color: '#000',
  },
  button: {
    backgroundColor: '#007AFF',
    padding: 15,
    borderRadius: 8,
    alignItems: 'center',
    marginBottom: 40,
  },
  disabled: {
    opacity: 0.5,
  },
  buttonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '600',
  },
});
