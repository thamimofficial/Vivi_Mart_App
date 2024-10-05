import React, { useEffect } from 'react';
import { View, StyleSheet, Image } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import FastImage from 'react-native-fast-image'; // Recommended for GIF performance

const SplashScreen = () => {
  const navigation = useNavigation();

  useEffect(() => {
    const timeout = setTimeout(() => {
      navigation.replace('PhoneSignIn'); // Navigate to LoginPage after 3 seconds
    }, 3000); // Adjust the time delay as needed

    return () => clearTimeout(timeout); // Clean up the timer when component unmounts
  }, [navigation]);

  return (
    <View style={styles.container}>
      <FastImage
        style={styles.gifImage}
        source={{ uri: 'https://ik.imagekit.io/efsdltq0e/welcome_screen/gif.gif?updatedAt=1726133821908' }} // Replace with your GIF URL
        resizeMode={FastImage.resizeMode.cover}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff', // Adjust the background color as needed
  },
  gifImage: {
    width: '100%',
    height: '100%', // Fullscreen GIF
  },
});

export default SplashScreen;
