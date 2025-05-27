import { theme } from '@/constants/theme';
import { useToast } from '@/context/ToastContext';
import { useAuth, useUser } from '@clerk/clerk-expo';
import * as DocumentPicker from 'expo-document-picker';
import * as FileSystem from 'expo-file-system';
import { Image } from 'expo-image';
import { manipulateAsync, SaveFormat } from 'expo-image-manipulator';
import * as ImagePicker from 'expo-image-picker';
import { Stack, useRouter } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { Pressable, Text, TextInput, View } from 'react-native';

export default function EditProfileScreen() {
  const { user } = useUser();
  const { isLoaded } = useAuth();
  const router = useRouter();
  const { showToast } = useToast();

  const [firstName, setFirstName] = useState(user?.firstName || '');
  const [lastName, setLastName] = useState(user?.lastName || '');
  const [profileImage, setProfileImage] = useState(user?.imageUrl || '');
  const [isLoading, setIsLoading] = useState(false);
  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    (async () => {
      const { status } =
        await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (status !== 'granted') {
        // Alert.alert(
        //   'Permission Denied',
        //   'Sorry, we need camera roll permissions to upload images.'
        // );
        showToast(
          'Please enable camera roll permissions in settings.',
          'warning'
        );
      }
    })();
  }, []);

  const convertImageToBase64 = async (uri: string) => {
    try {
      const fileInfo = await FileSystem.getInfoAsync(uri);
      if (fileInfo.exists && fileInfo.size && fileInfo.size > 2 * 1024 * 1024) {
        // Alert.alert('Error', 'Image size must be less than 2MB.');
        showToast('Image size must be less than 2MB.', 'error');
        return null;
      }

      const base64 = await FileSystem.readAsStringAsync(uri, {
        encoding: FileSystem.EncodingType.Base64,
      });
      return `data:image/jpeg;base64,${base64}`;
    } catch (error) {
      console.error('Error converting image to base64:', error); // Debug log
      // Alert.alert('Error', 'Failed to process image. Please try again.');
      showToast('Failed to process image. Please try again.', 'error');
      return null;
    }
  };

  const handleImagePicker = async () => {
    try {
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [1, 1],
        quality: 0.7,
      });

      if (!result.canceled) {
        const manipulatedImage = await manipulateAsync(
          result.assets[0].uri,
          [{ resize: { width: 500, height: 500 } }],
          { compress: 0.7, format: SaveFormat.JPEG }
        );

        const base64Image = await convertImageToBase64(manipulatedImage.uri);
        if (base64Image) {
          setProfileImage(base64Image);
        }
      }
    } catch (error) {
      console.error('Error picking image:', error); // Debug log
      // Alert.alert('Error', 'Failed to pick image. Please try again.');
      showToast('Failed to pick image. Please try again.', 'error');
    }
  };

  const handleGifPicker = async () => {
    try {
      setUploading(true);

      const result = await DocumentPicker.getDocumentAsync({
        type: 'image/gif',
      });

      if (result.canceled) {
        console.log('User cancelled file picker.'); // Debug log
        showToast('File selection cancelled.', 'info');
        return;
      }

      if (!result.assets || result.assets.length === 0) {
        // throw new Error('No file selected.');
        showToast('No file selected.', 'warning');
        return;
      }

      const file = result.assets[0];
      if (!file.uri) {
        // throw new Error('No file URI found.');
        showToast('No file URI found.', 'warning');
        return;
      }

      const base64Gif = await convertImageToBase64(file.uri);
      if (base64Gif) {
        setProfileImage(base64Gif);
      }
    } catch (error) {
      console.error('Error picking GIF:', error); // Debug log
      // Alert.alert('Error', 'Failed to pick GIF. Please try again.');
      showToast('Failed to pick GIF. Please try again.', 'error');
      if (error instanceof Error) {
        // Alert.alert('Error', error.message);
        showToast(error.message, 'error');
      }
    } finally {
      setUploading(false);
    }
  };

  const handleUpdateProfile = async () => {
    if (!isLoaded || !user) {
      // Alert.alert('Error', 'User not loaded. Please try again.');
      showToast('User not loaded. Please try again.', 'error');
      return;
    }

    setIsLoading(true);

    try {
      if (profileImage !== user.imageUrl) {
        await user.setProfileImage({ file: profileImage });
      }

      await user.update({ firstName, lastName });

      // Alert.alert('Success', 'Profile updated successfully!');
      showToast('Profile updated successfully!', 'success');
      router.back();
    } catch (error: any) {
      console.error('Error updating profile:', error); // Debug log
      // Alert.alert(
      //   'Error',
      //   error.errors?.[0]?.message ||
      //     'Failed to update profile. Please try again.'
      // );
      showToast(
        error.errors?.[0]?.message ||
          'Failed to update profile. Please try again.',
        'error'
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <View
      style={{ flex: 1, padding: 20, backgroundColor: theme.colors.background }}
    >
      <Stack.Screen
        options={{
          title: '',
          headerTitleStyle: { fontFamily: 'Regular' },
          headerShadowVisible: false,
          headerStyle: { backgroundColor: theme.colors.background },
          headerTintColor: theme.colors.gray[500],
        }}
      />
      <View
        style={{
          alignItems: 'center',
          marginBottom: 20,
        }}
      >
        <Image
          source={
            profileImage
              ? { uri: profileImage }
              : require('@/assets/images/icon.png')
          }
          style={{
            width: 100,
            height: 100,
            borderRadius: 50,
            marginBottom: 10,
            borderWidth: 2,
            borderColor: theme.colors.text,
          }}
        />
        <View
          style={{
            flexDirection: 'row',
            justifyContent: 'space-between',
            width: '80%',
          }}
        >
          <Pressable
            onPress={handleImagePicker}
            disabled={uploading || isLoading}
            style={{
              flex: 1,
              padding: 10,
              backgroundColor: theme.colors.background,
              borderColor: theme.colors.text,
              borderWidth: 1,
              borderRadius: 5,
              marginRight: 5,
            }}
          >
            <Text
              style={{
                color: theme.colors.text,
                fontFamily: 'Regular',
                textAlign: 'center',
              }}
            >
              Change Photo
            </Text>
          </Pressable>
          <Pressable
            onPress={handleGifPicker}
            disabled={uploading || isLoading}
            style={{
              flex: 1,
              padding: 10,
              borderWidth: 1,
              backgroundColor: theme.colors.text,
              borderRadius: 5,
              marginLeft: 5,
            }}
          >
            <Text
              style={{
                color: theme.colors.background,
                fontFamily: 'Regular',
                textAlign: 'center',
              }}
            >
              Upload GIF
            </Text>
          </Pressable>
        </View>
      </View>

      <TextInput
        style={{
          borderWidth: 1,
          borderColor: theme.colors.border,
          padding: 10,
          marginBottom: 10,
          fontFamily: 'Regular',
          color: theme.colors.text,
        }}
        value={firstName}
        placeholder="First Name"
        placeholderTextColor={theme.colors.gray[500]}
        onChangeText={setFirstName}
        editable={!isLoading}
      />

      <TextInput
        style={{
          borderWidth: 1,
          borderColor: theme.colors.border,
          padding: 10,
          marginBottom: 10,
          fontFamily: 'Regular',
          color: theme.colors.text,
        }}
        value={lastName}
        placeholder="Last Name"
        placeholderTextColor={theme.colors.gray[500]}
        onChangeText={setLastName}
        editable={!isLoading}
      />

      <Pressable
        onPress={handleUpdateProfile}
        disabled={isLoading || uploading}
        style={{
          padding: 15,
          backgroundColor: theme.colors.text,
          borderRadius: 5,
          alignItems: 'center',
        }}
      >
        <Text style={{ color: theme.colors.background, fontFamily: 'Regular' }}>
          {isLoading ? 'Updating...' : 'Update Profile'}
        </Text>
      </Pressable>
    </View>
  );
}
