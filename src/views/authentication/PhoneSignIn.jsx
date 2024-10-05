import { useNavigation } from '@react-navigation/native';
import React, { useState, useEffect, useRef } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert, ImageBackground, Keyboard } from 'react-native';
import auth from '@react-native-firebase/auth';
import FeatherIcon from 'react-native-vector-icons/Feather';

const PhoneSignIn = () => {
  const navigation = useNavigation();
  const [confirm, setConfirm] = useState(null);
  const [phoneNumber, setPhoneNumber] = useState(''); // Separate state for phone number
  const [otp, setOtp] = useState(''); // Updated for single input with 6 characters
  const [containerHeight, setContainerHeight] = useState('30%');

  // Handle login state changes
  function onAuthStateChanged(user) {
    if (user) {
      console.log('User logged in:', user.phoneNumber);
      navigation.replace('Home');
    }
  }

  useEffect(() => {
    const subscriber = auth().onAuthStateChanged(onAuthStateChanged);
    return () => subscriber();
  }, []);

  // Handle the button press to sign in
  async function signInWithPhoneNumber(phoneNumber) {
    try {
      const confirmation = await auth().signInWithPhoneNumber(phoneNumber);
      setConfirm(confirmation);
    } catch (error) {
      console.error('Error signing in:', error);
      Alert.alert('Sign-in Error', 'Failed to sign in. Please try again.');
    }
  }

  async function confirmCode() {
    try {
      await confirm.confirm(otp);
      console.log('Code confirmed successfully');
      navigation.replace('Home');
    } catch (error) {
      console.log('Invalid code.');
      Alert.alert('Confirmation Error', 'Invalid OTP. Please try again.');
    }
  }

  useEffect(() => {
    const keyboardDidShowListener = Keyboard.addListener('keyboardDidShow', () => {
      setContainerHeight('40%');
    });
    const keyboardDidHideListener = Keyboard.addListener('keyboardDidHide', () => {
      setContainerHeight('30%');
    });

    return () => {
      keyboardDidHideListener.remove();
      keyboardDidShowListener.remove();
    };
  }, []);

  return (
    <ImageBackground 
      source={{ uri: 'https://ik.imagekit.io/efsdltq0e/welcome_screen/2.png?updatedAt=1726133820462' }} 
      style={styles.background}
    >
      <View style={styles.container}>
        <View style={[styles.whiteContainer, { height: containerHeight }]}>
          {!confirm ? (
            <>
              <Text style={styles.title}>Enter your phone number</Text>
              <TextInput
                style={styles.input}
                keyboardType="phone-pad"
                maxLength={10}
                placeholder="Enter your phone number"
                onChangeText={setPhoneNumber}
              />
              <TouchableOpacity style={styles.button} onPress={() => signInWithPhoneNumber(`+91${phoneNumber}`)}>
                <Text style={styles.buttonText}>Get OTP</Text>
              </TouchableOpacity>
            </>
          ) : (
            <>
              <View style={styles.header}>
                <TouchableOpacity
                  onPress={() => setConfirm(null)}
                  style={styles.headerAction}
                >
                  <FeatherIcon color="#F82E08" name="arrow-left" size={24} />
                </TouchableOpacity>

                <Text style={styles.title}>Enter Code</Text>
              </View>

              <View style={styles.form}>
                <View style={styles.formInput}>
                  <TextInput
                    autoCapitalize="none"
                    autoCorrect={false}
                    keyboardType="number-pad"
                    onChangeText={value => setOtp(value.slice(0, 6))} // Restrict to 6 characters
                    returnKeyType="done"
                    style={styles.formInputControl}
                    value={otp}
                  />
                  <View style={styles.formInputOverflow}>
                    {Array.from({ length: 6 }).map((_, index) => (
                      <Text key={index} style={styles.formInputChar}>
                        {otp[index] || <Text style={styles.formInputCharEmpty}>-</Text>}
                      </Text>
                    ))}
                  </View>
                </View>

                <TouchableOpacity style={styles.button} onPress={confirmCode}>
                  <Text style={styles.buttonText}>Confirm Code</Text>
                </TouchableOpacity>
              </View>
            </>
          )}
        </View>
      </View>
    </ImageBackground>
  );
};

const styles = StyleSheet.create({
  background: {
    flex: 1,
    justifyContent: 'flex-end',
  },
  container: {
    flex: 1,
    justifyContent: 'flex-end',
  },
  whiteContainer: {
    backgroundColor: '#fff',
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
    padding: 20,
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 5,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
    color: '#000',
  },
  input: {
    height: 50,
    borderColor: '#ddd',
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 16,
    marginBottom: 20,
    backgroundColor: '#fff',
    color: '#000',
  },
  formInput: {
    position: 'relative',
    backgroundColor: '#fff',
    borderRadius: 12,
  },
  formInputControl: {
    height: 60,
    color: 'transparent',
    paddingHorizontal: 16,
    zIndex: 2,
  },
  formInputOverflow: {
    zIndex: 1,
    position: 'absolute',
    top: 0,
    right: 0,
    left: 0,
    bottom: 0,
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingHorizontal: 16,
  },
  formInputChar: {
    flexGrow: 1,
    flexShrink: 1,
    flexBasis: 0,
    lineHeight: 60,
    fontSize: 34,
    textAlign: 'center',
    fontWeight: '600',
  },
  formInputCharEmpty: {
    color: '#BBB9BC',
    fontWeight: '400',
  },
  button: {
    backgroundColor: '#007bff',
    paddingVertical: 15,
    borderRadius: 8,
    alignItems: 'center',
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  headerAction: {
    width: 40,
    height: 40,
    borderRadius: 9999,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#ffdada',
    marginBottom: 16,
  },
  form: {
    flexGrow: 1,
    paddingHorizontal: 24,
  },
});

export default PhoneSignIn;