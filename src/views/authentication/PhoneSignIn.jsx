import { useNavigation } from '@react-navigation/native';
import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert, ImageBackground, Keyboard } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import auth from '@react-native-firebase/auth';
import FeatherIcon from 'react-native-vector-icons/Feather';

const PhoneSignIn = () => {
  const navigation = useNavigation();
  const [confirm, setConfirm] = useState(null);
  const [phoneNumber, setPhoneNumber] = useState('');
  const [otp, setOtp] = useState('');
  const [containerHeight, setContainerHeight] = useState('40%');
  const [counter, setCounter] = useState(30);
  const [isResendVisible, setIsResendVisible] = useState(false);

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
      setCounter(30);
      setIsResendVisible(false);
      startTimer();
    } catch (error) {
      console.error('Error signing in:', error);
      Alert.alert('Sign-in Error', 'Failed to sign in. Please try again.');
    }
  }

  async function confirmCode() {
    try {
      await confirm.confirm(otp);
      console.log('Code confirmed successfully');
      await AsyncStorage.setItem('phoneNumber', `+91${phoneNumber}`);
      navigation.replace('Home');
    } catch (error) {
      console.log('Invalid code.');
      Alert.alert('Confirmation Error', 'Invalid OTP. Please try again.');
    }
  }

  // Timer logic for OTP resend
  useEffect(() => {
    const keyboardDidShowListener = Keyboard.addListener('keyboardDidShow', () => {
      setContainerHeight('50%');
    });
    const keyboardDidHideListener = Keyboard.addListener('keyboardDidHide', () => {
      setContainerHeight('40%');
    });

    return () => {
      keyboardDidHideListener.remove();
      keyboardDidShowListener.remove();
    };
  }, []);

  const startTimer = () => {
    let timer = setInterval(() => {
      setCounter((prevCounter) => {
        if (prevCounter <= 1) {
          clearInterval(timer);
          setIsResendVisible(true);
          return 0;
        }
        return prevCounter - 1;
      });
    }, 1000);
  };

  return (
    <ImageBackground
      source={{ uri: 'https://ik.imagekit.io/efsdltq0e/welcome_screen/2.png?updatedAt=1726133820462' }}
      style={styles.background}
    >
      <View style={styles.container}>
        <View style={[styles.whiteContainer, { height: containerHeight }]}>
          {!confirm ? (
            <>
              <Text style={styles.title}>Login or Signup</Text>
              <View style={styles.phoneInputContainer}>
                <Text style={styles.countryCode}>+91</Text>
                <TextInput
                  style={[styles.input, { borderLeftWidth: 0 }]}
                  keyboardType="phone-pad"
                  maxLength={10}
                  placeholder="Enter your phone number"
                  onChangeText={setPhoneNumber}
                  placeholderTextColor='black'
                />
              </View>
              <TouchableOpacity
                style={styles.button}
                onPress={() => signInWithPhoneNumber(`+91${phoneNumber}`)}
              >
                <Text style={styles.buttonText}>Continue</Text>
              </TouchableOpacity>
              <Text style={styles.termsText}>
                By continuing, you agree to the Terms of Use & Privacy Policy.
              </Text>
            </>
          ) : (
            <>
            <View style={styles.header}>
              <TouchableOpacity onPress={() => setConfirm(null)} style={styles.headerAction}>
                <FeatherIcon color="#F82E08" name="arrow-left" size={24} />
              </TouchableOpacity>
            <View>
              <Text style={styles.verifyTitle}>Verify with OTP</Text>
              <Text style={styles.subText}>
                6-digit OTP has been sent to +91{phoneNumber}. Not yours?{' '}
                <Text style={styles.linkText} onPress={() => setConfirm(null)}>
                  Change
                </Text>
              </Text>
              </View>
            </View>

            <View style={styles.form}>
              <Text style={styles.inputLabel}>Enter Code</Text>
              <View style={styles.formInput}>
                <TextInput
                  autoCapitalize="none"
                  autoCorrect={false}
                  keyboardType="number-pad"
                  onChangeText={(value) => setOtp(value.slice(0, 6))} // Restrict to 6 characters
                  returnKeyType="done"
                  style={styles.formInputControl}
                  // value={otp}
                />
                <View style={styles.formInputOverflow}>
                  {Array.from({ length: 6 }).map((_, index) => (
                    <Text key={index} style={styles.formInputChar}>
                      {otp[index] || <Text style={styles.formInputCharEmpty}>-</Text>}
                    </Text>
                  ))}
                </View>
              </View>

              {counter > 0 ? (
                <Text style={styles.resendText}>Didn't receive OTP? Resend in 00:{counter < 10 ? `0${counter}` : counter}</Text>
              ) : isResendVisible ? (
                <TouchableOpacity onPress={() => signInWithPhoneNumber(`+91${phoneNumber}`)}>
                  <Text style={styles.resendButton}>Resend OTP</Text>
                </TouchableOpacity>
              ) : null}

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
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 5,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 20,
    color: '#000',
  },
  phoneInputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  countryCode: {
    fontSize: 18,
    fontWeight: 'bold',
    paddingHorizontal: 10,
    color: '#000',
    borderRightWidth: 1,
    borderColor: '#ddd',
  },
  input: {
    flex: 1,
    height: 50,
    borderColor: '#ddd',
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 16,
    backgroundColor: '#fff',
    color: 'black',
  },
  termsText: {
    textAlign: 'center',
    marginVertical: 10,
    fontSize: 12,
    color: '#666',
  },
  header: {
    marginBottom: 20,
    flexDirection:'row',
    alignItems:'center'
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
  verifyTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: 'black',
    textAlign: 'center',
    marginBottom: 15,
  },
  subText: {
    fontSize: 12,
    color: 'gray',
    textAlign: 'left',
  },
  linkText: {
    color: '#007bff',
    textDecorationLine: 'underline',
  },
  form: {
    paddingHorizontal: 24,
  },
  inputLabel: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#000',
    marginBottom: 10,
  },
  formInput: {
    position: 'relative',
    backgroundColor: '#fff',
    borderRadius: 12,
  },
  formInputControl: {
    height: 50,
    color: 'white',
    paddingHorizontal: 16,
    borderColor: '#ddd',
    borderWidth: 1,
    borderRadius: 8,
    zIndex: 2,
  },
  formInputOverflow: {
    zIndex: 1,
    position: 'absolute',
    top: 0,
    height: '100%',
    width: '100%',
    paddingHorizontal: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  formInputChar: {
    fontSize: 20,
    fontWeight: 'bold',
    color: 'black',
  },
  formInputCharEmpty: {
    color: '#ddd',
  },
  resendText: {
    textAlign: 'center',
    color: '#000',
    marginVertical: 10,
  },
  resendButton: {
    textAlign: 'center',
    color: '#007bff',
    fontWeight: 'bold',
    textDecorationLine: 'underline',
    marginVertical: 10,
  },
  button: {
    height: 50,
    backgroundColor: '#003d9d',
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 20,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default PhoneSignIn;
