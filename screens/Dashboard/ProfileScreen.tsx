import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
  KeyboardAvoidingView,
  Platform,
  Image,
} from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { auth } from '../../firebase/config';
import { updateProfile, signOut } from 'firebase/auth';
import { Ionicons } from '@expo/vector-icons';
import { uploadImageToCloudinary } from '../../utils/cloudinary';

export default function ProfileScreen({ navigation }: any) {
  const user = auth.currentUser;
  const [name, setName] = useState(user?.displayName || '');
  const [email] = useState(user?.email || '');
  const [editing, setEditing] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [photoURL, setPhotoURL] = useState(user?.photoURL || '');

  const handleUpdateUsername = async () => {
    if (!name.trim()) {
      Alert.alert('Validation Error', 'Username cannot be empty.');
      return;
    }

    try {
      await updateProfile(user!, {
        displayName: name.trim(), 
      });
      setEditing(false);
      Alert.alert('Success', 'Username updated successfully!');
    } catch (err: any) {
      Alert.alert('Update failed', err.message);
    }
  };

  const handleLogout = async () => {
    try {
      await signOut(auth);
      Alert.alert('Success', 'You have been logged out.');
    } catch (error: any) {
      Alert.alert('Logout failed', error.message);
    }
  };

  const handleImageUpload = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images, 
      base64: true,
      allowsEditing: true,
      quality: 0.7,
    });

    if (!result.canceled) {
      try {
        setUploading(true);
        const base64 = `data:image/jpeg;base64,${result.assets[0].base64}`;
        const cloudinaryUrl = await uploadImageToCloudinary(base64);
        console.log('Cloudinary URL:', cloudinaryUrl);
        await updateProfile(user!, {
          photoURL: cloudinaryUrl, 
        });
        setPhotoURL(cloudinaryUrl);
        Alert.alert('Success', 'Profile photo updated!');
      } catch (err: any) {
        console.error('Upload error:', err);
        Alert.alert('Upload Failed', err.message || 'Something went wrong');
      } finally {
        setUploading(false);
      }
    }
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.select({ ios: 'padding', android: undefined })}
    >
      <Text style={styles.header}>Profile</Text>

      <View style={styles.avatarContainer}>
        {photoURL ? (
          <Image source={{ uri: photoURL }} style={styles.avatarImage} />
        ) : (
          <Text style={styles.emoji}>👤</Text>
        )}
      </View>

      <Text style={styles.label}>Username</Text>
      <View style={styles.inputRow}>
        <TextInput
          style={styles.input}
          value={name}
          onChangeText={setName}
          editable={editing}
        />
        <TouchableOpacity onPress={() => setEditing(!editing)}>
          <Ionicons name="create-outline" size={24} color="#1976D2" />
        </TouchableOpacity>
      </View>

      {editing && (
        <TouchableOpacity
          style={styles.updateButton}
          onPress={handleUpdateUsername}
        >
          <Ionicons name="checkmark-done-outline" size={18} color="#fff" />
          <Text style={styles.buttonText}>Update Username</Text>
        </TouchableOpacity>
      )}

      <Text style={styles.label}>Email</Text>
      <TextInput
        style={[styles.input, { color: '#777' }]}
        value={email}
        editable={false}
      />

      <TouchableOpacity
        style={styles.fakeUploadButton}
        onPress={handleImageUpload}
        disabled={uploading}
      >
        <Ionicons name="cloud-upload-outline" size={18} color="#fff" />
        <Text style={styles.buttonText}>
          {uploading ? 'Uploading...' : 'Upload New Profile Photo'}
        </Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
        <Ionicons name="log-out-outline" size={18} color="#fff" />
        <Text style={styles.buttonText}>Logout</Text>
      </TouchableOpacity>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 24,
    flex: 1,
    backgroundColor: '#fff',
  },
  header: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  avatarContainer: {
    alignItems: 'center',
    marginBottom: 20,
  },
  avatarImage: {
    width: 100,
    height: 100,
    borderRadius: 50,
  },
  emoji: {
    fontSize: 80,
  },
  label: {
    fontSize: 14,
    color: '#444',
    marginTop: 12,
    marginBottom: 4,
  },
  input: {
    flex: 1,
    borderWidth: 1,
    borderColor: '#ccc',
    padding: 12,
    borderRadius: 8,
    fontSize: 16,
    backgroundColor: '#f9f9f9',
  },
  inputRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  updateButton: {
    backgroundColor: '#1976D2',
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 8,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 10,
    marginTop: 10,
  },
  fakeUploadButton: {
    backgroundColor: '#1976D2',
    paddingVertical: 14,
    paddingHorizontal: 16,
    borderRadius: 8,
    flexDirection: 'row',
    gap: 10,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 140,
  },
  logoutButton: {
    backgroundColor: '#1976D2',
    paddingVertical: 14,
    paddingHorizontal: 16,
    borderRadius: 8,
    flexDirection: 'row',
    gap: 10,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 14,
  },
  buttonText: {
    color: '#fff',
    fontSize: 15,
    fontWeight: '500',
  },
});
