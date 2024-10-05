import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Modal,
  Pressable,
  PermissionsAndroid,
  Alert,
  Platform,
  TextInput,
} from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import Geolocation from 'react-native-geolocation-service';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { request, PERMISSIONS, RESULTS } from 'react-native-permissions';
import { getlocationID } from '../../utils/config'; // Ensure you have the correct path
import { useNavigation } from '@react-navigation/native';

const ExpandableLocationCard = () => {
  const navigation = useNavigation()
  const [modalVisible, setModalVisible] = useState(false);
  const [userLocation, setUserLocation] = useState(null);
  const [address, setAddress] = useState('');
  const [pincode, setPincode] = useState('');
  const [pincodeModalVisible, setPincodeModalVisible] = useState(false);
  const [enteredPincode, setEnteredPincode] = useState('');
  const [locationData, setLocationData] = useState(null);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  // Functions to open/close modals
  const openModal = () => setModalVisible(true);
  const closeModal = () => setModalVisible(false);
  const openPincodeModal = () => setPincodeModalVisible(true);
  const closePincodeModal = () => setPincodeModalVisible(false);


  useEffect(() => {
    const fetchStoredLocation = async () => {
      try {
        const storedPincode = await AsyncStorage.getItem('pin_codes');
        const storedCityName = await AsyncStorage.getItem('city_name');
  console.log('location in 6 sec',storedCityName,storedPincode)
        if (storedPincode && storedCityName) {
          setLocationData({
            pin_codes: storedPincode,
            city_name: storedCityName,
          });
        }
      } catch (error) {
        console.error('Failed to load location from AsyncStorage:', error);
      }
    };
  
    // Call fetchStoredLocation every 5 seconds
    const intervalId = setInterval(fetchStoredLocation, 10000);
  
    // Cleanup interval when component unmounts
    return () => clearInterval(intervalId);
  }, []);
  
  // Request location permission
  const requestLocationPermission = async () => {
    try {
      const result =
        Platform.OS === 'android'
          ? await PermissionsAndroid.request(PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION)
          : await request(PERMISSIONS.IOS.LOCATION_WHEN_IN_USE);

      if (result === (Platform.OS === 'android' ? PermissionsAndroid.RESULTS.GRANTED : RESULTS.GRANTED)) {
        getCurrentLocation();
      } else {
        Alert.alert('Permission Denied', 'Location permission is required to detect your location.');
      }
    } catch (error) {
      console.error('Permission request failed:', error);
      Alert.alert('Error', 'Failed to request location permission.');
    }
  };

  // Get current location
  const getCurrentLocation = () => {
    Geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude } = position.coords;
        setUserLocation(`Lat: ${latitude}, Long: ${longitude}`);
        Alert.alert('Location Detected', `Lat: ${latitude}, Long: ${longitude}`);
        reverseGeocode(latitude, longitude);
      },
      (error) => {
        Alert.alert('Error', 'Failed to detect your location. Please try again.');
        console.log(error);
      },
      {
        enableHighAccuracy: true,
        timeout: 15000,
        maximumAge: 10000,
      }
    );
  };

  // Reverse geocode to get address and pincode using Google Maps API
  const reverseGeocode = async (latitude, longitude) => {
    try {
      const apiKey = 'AIzaSyCldVSEPoJ4_YS1rlM_LbWgbNMc_TTMBv8'; // Replace with your actual API key
      const response = await axios.get(
        `https://maps.googleapis.com/maps/api/geocode/json?latlng=${latitude},${longitude}&key=${apiKey}`
      );
      const data = response.data;
console.log('location data',data)
      if (data.results.length > 0) {
        const result = data.results[0];
        setAddress(result.formatted_address);
        const addressComponents = result.address_components;

        const postalCodeComponent = addressComponents.find((component) =>
          component.types.includes('postal_code')
        );

        setPincode(postalCodeComponent ? postalCodeComponent.long_name : '');
        console.log('Address:', result.formatted_address);
        console.log('Pincode:', postalCodeComponent ? postalCodeComponent.long_name : 'N/A');
      } else {
        Alert.alert('Error', 'Could not retrieve address. Please try again.');
      }
    } catch (error) {
      console.error('Error during reverse geocoding:', error);
      Alert.alert('Error', 'Failed to retrieve address. Please try again.');
    }
  };

  // Handle pincode submission to fetch location data
  const handlePincodeSubmit = async () => {
    setLoading(true);
    setPincode(enteredPincode);
    closePincodeModal();
    Alert.alert('Pincode Entered', `Your Pincode: ${enteredPincode}`);
  
    try {
      // Fetch location data from API
      const { status, data } = await getlocationID(enteredPincode);
      console.log('API Response:', { status, data }); // Log full response for debugging
  
      if (status === 200) {
        setLocationData(data); // Store first location data object
        console.log('Location Data:', data);
  
        // Store data in AsyncStorage
        await AsyncStorage.setItem('location_id', data.id.toString());
        await AsyncStorage.setItem('location_name', data.location_name);
        await AsyncStorage.setItem('city_name', data.city_name);
        await AsyncStorage.setItem('store_id', data.store_id);
        await AsyncStorage.setItem('pin_codes', data.pin_codes);
  
        Alert.alert('Location Saved', `Location: ${data.city_name}, Pincode: ${data.pin_codes}`);
      } else if (status === 200 && data.length === 0) {
        setError('No location data available for this pincode.');
        Alert.alert('No Data', 'No location data available for this pincode.');
      } else {
        throw new Error('Failed to fetch location data');
      }
    } catch (error) {
      setError(error.message);
      console.error('Error fetching location data:', error); // Log the exact error
      Alert.alert('Error', error.message);
    } finally {
      setLoading(false);
    }
  };
  

  return (
    <View style={styles.container}>
      <TouchableOpacity onPress={openModal} style={styles.topBar}>
        <Ionicons name="chevron-down-outline" size={18} color="#fff" />
        <View style={{flexDirection:'row'}}>
            <Text style={styles.topBarText} numberOfLines={1}>
              {locationData ? `${locationData.city_name}` : 'Select your location'}
            </Text>
            <Text style={styles.topBarText} numberOfLines={1}>
              {locationData ? `${locationData.pin_codes}` : ' '}
            </Text>
        </View>
      </TouchableOpacity>

      {/* Main Location Modal */}
      <Modal animationType="slide" transparent={true} visible={modalVisible} onRequestClose={closeModal}>
        <View style={styles.modalBackground}>
          <View style={styles.modalContainer}>
            <Text style={styles.modalTitle}>Select Delivery Location</Text>
            <Text style={styles.modalText}>
              Add an address or set delivery location to see product availability, offers, and discounts.
            </Text>

            {/* Option to enter pincode */}
            {/* <TouchableOpacity style={styles.optionCard} onPress={openPincodeModal}>
              <Ionicons name="location-outline" size={20} color="#1476bc" />
              <Text style={styles.optionText}>Enter a Pincode</Text>
            </TouchableOpacity> */}

            {/* Option to detect location */}
            <TouchableOpacity style={styles.optionCard} onPress={()=>navigation.navigate('GooglePlacesAutocomplete')}>
              <Ionicons name="navigate-outline" size={20} color="#1476bc" />
              <Text style={styles.optionText}>Detect Current Location</Text>
            </TouchableOpacity>

            {userLocation && <Text style={styles.locationText}>Your Location: {userLocation}</Text>}
            {address && <Text style={styles.locationText}>Your Address: {address}</Text>}
            {pincode && <Text style={styles.locationText}>Your Pincode: {pincode}</Text>}

            <Pressable style={styles.closeButton} onPress={closeModal}>
              <Text style={styles.closeButtonText}>Close</Text>
            </Pressable>
          </View>
        </View>
      </Modal>

      {/* Pincode Input Modal */}
      <Modal animationType="slide" transparent={true} visible={pincodeModalVisible} onRequestClose={closePincodeModal}>
        <View style={styles.modalBackground}>
          <View style={styles.modalContainer}>
            <Text style={styles.modalTitle}>Enter Pincode</Text>
            <TextInput
              style={styles.textInput}
              placeholder="Enter Pincode"
              keyboardType="numeric"
              maxLength={6}
              value={enteredPincode}
              onChangeText={setEnteredPincode}
            />
            <Pressable style={styles.applyButton} onPress={handlePincodeSubmit}>
              <Text style={styles.applyButtonText}>Apply</Text>
            </Pressable>
            <Pressable style={styles.closeButton} onPress={closePincodeModal}>
              <Text style={styles.closeButtonText}>Close</Text>
            </Pressable>
          </View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: '100%',
    alignItems: 'center',
  },
  topBar: {
    width: '100%',
    backgroundColor: '#1c44fc',
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 10,
    paddingHorizontal: 15,
  },
  topBarText: {
    color: '#fff',
    fontSize: 14,
    marginLeft: 5,
    width:'50%',
    fontWeight:'700'
  },
  modalBackground: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContainer: {
    width: '80%',
    backgroundColor: '#fff',
    padding: 20,
    borderRadius: 10,
    alignItems: 'center',
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 15,
  },
  modalText: {
    fontSize: 14,
    textAlign: 'center',
    marginBottom: 20,
  },
  optionCard: {
    width: '100%',
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 10,
    paddingHorizontal: 15,
    backgroundColor: '#f1f1f1',
    borderRadius: 5,
    marginBottom: 15,
  },
  optionText: {
    marginLeft: 10,
    fontSize: 16,
    color: '#1476bc',
  },
  locationText: {
    fontSize: 14,
    textAlign: 'center',
    marginVertical: 5,
    color: '#333',
  },
  closeButton: {
    marginTop: 20,
    backgroundColor: '#1476bc',
    borderRadius: 5,
    paddingVertical: 10,
    paddingHorizontal: 20,
  },
  closeButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  textInput: {
    width: '100%',
    borderColor: '#ddd',
    borderWidth: 1,
    borderRadius: 5,
    padding: 10,
    marginBottom: 15,
  },
  applyButton: {
    width: '100%',
    backgroundColor: '#1476bc',
    padding: 12,
    borderRadius: 5,
    alignItems: 'center',
    marginBottom: 10,
  },
  applyButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default ExpandableLocationCard;
