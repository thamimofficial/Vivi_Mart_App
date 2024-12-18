import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation } from '@react-navigation/native';
import React, { useState, useEffect } from 'react';
import { View, TextInput, FlatList, Text, TouchableOpacity, StyleSheet, Alert, Platform, PermissionsAndroid } from 'react-native';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import Geolocation from '@react-native-community/geolocation';

import { getlocationID } from '../utils/config';

const GooglePlacesAutocomplete = () => {
  const navigation = useNavigation();
  const [searchText, setSearchText] = useState('');
  const [predictions, setPredictions] = useState([]);
  const [pincode, setPincode] = useState('');
  const [fullAddress, setFullAddress] = useState('');
  const [locationData, setLocationData] = useState(null); // Initialize to null
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchPredictions = async () => {
      try {
        const response = await fetch(
          `https://maps.googleapis.com/maps/api/place/autocomplete/json?input=${searchText}&key=AIzaSyCldVSEPoJ4_YS1rlM_LbWgbNMc_TTMBv8&components=country:in`
        );
        const json = await response.json();

        if (json.status === 'OK') {
          const detailedPredictions = await Promise.all(
            json.predictions.map(async (prediction) => {
              const detailResponse = await fetch(
                `https://maps.googleapis.com/maps/api/place/details/json?place_id=${prediction.place_id}&key=AIzaSyCldVSEPoJ4_YS1rlM_LbWgbNMc_TTMBv8`
              );
              const detailJson = await detailResponse.json();

              if (detailJson.status === 'OK') {
                const addressComponents = detailJson.result.address_components;
                const postalCodeObj = addressComponents.find((component) =>
                  component.types.includes('postal_code')
                );
                const postalCode = postalCodeObj ? postalCodeObj.short_name : null;
                const address = detailJson.result.formatted_address;

                const location = detailJson.result.geometry.location; // Get the latitude and longitude
                const { lat, lng } = location;

                return postalCode ? { ...prediction, full_address: `${address}, ${postalCode}`, lat, lng } : null;
              }
              return null;
            })
          );

          const predictionsWithPincode = detailedPredictions.filter((prediction) => prediction !== null);
          setPredictions(predictionsWithPincode);
        } else {
          console.log('Autocomplete error:', json.status);
        }
      } catch (error) {
        console.error('Error fetching predictions:', error);
        Alert.alert('Error', 'Failed to fetch location predictions. Please try again.');
      }
    };

    if (searchText.length > 2) {
      const timeoutId = setTimeout(fetchPredictions, 300); // Debounce API calls
      return () => clearTimeout(timeoutId);
    } else {
      setPredictions([]); // Clear predictions when search text is less than 2 characters
    }
  }, [searchText]);

  const handlePincodeSubmit = async () => {
    setLoading(true);
    Alert.alert('Pincode Entered', `Your Pincode: ${pincode}`);
    console.log('locationData', locationData);

    try {
      const { status, data } = await getlocationID(pincode);
      console.log('API Response:', { status, data });

      if (status === 200) {
        if (data.length === 0) {
          setError('No location data available for this pincode.');
          Alert.alert('No Data', 'No location data available for this pincode.');
        } else {
          const locationData = data;
          console.log('locationData', locationData);

          await AsyncStorage.setItem('pin_codes', pincode);
          await AsyncStorage.setItem('city_name', fullAddress);

          await AsyncStorage.multiSet([
            ['location_id', locationData.id.toString()],
            ['location_name', locationData.location_name || 'thamim'],
            ['store_id', locationData.store_id],
            ['pin_codes', pincode],
          ]);

          Alert.alert('Location Saved', `Location: ${locationData.city_name}, Pincode: ${locationData.pin_codes}`);
          navigation.replace('Home');
        }
      } else {
        throw new Error('Failed to fetch location data');
      }
    } catch (error) {
      setError(error.message);
      console.error('Error fetching location data:', error);
      Alert.alert('Error', error.message);
    } finally {
      setLoading(false);
    }
  };

  // Request location permission
  const requestLocationPermission = async () => {
    if (Platform.OS === 'android') {
      const granted = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
        {
          title: 'Location Access Required',
          message: 'This app needs to access your location',
          buttonNeutral: 'Ask Me Later',
          buttonNegative: 'Cancel',
          buttonPositive: 'OK',
        },
      );
      if (granted !== PermissionsAndroid.RESULTS.GRANTED) {
        Alert.alert('Permission Denied', 'Location permission is required to use this feature');
        return false;
      }
    }
    return true;
  };

  const getCurrentLocation = async () => {
    const hasPermission = await requestLocationPermission();
    if (!hasPermission) return;

    Geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude } = position.coords;
        setLocationData({ lat: latitude, lng: longitude });
        console.log('Current Location:', latitude, longitude);
        navigation.navigate('MapScreen', { lat: latitude, lng: longitude });
        // Alert.alert('Current Location', `Lat: ${latitude}, Lng: ${longitude}`);
      },
      (error) => {
        console.error('Error getting location:', error);
        Alert.alert('Error', 'Failed to get your current location. Please try again.');
      },
      { enableHighAccuracy: true, timeout: 15000, maximumAge: 10000 }
    );
  };

  const renderPrediction = ({ item }) => (
    <View  style={{flexDirection:'row',alignItems:'center'}}>
      <MaterialIcons name={'location-pin'} size={30} color="#000000" style={{marginLeft:10}}/>
    <TouchableOpacity
      onPress={() => {
        console.log('Selected Address:', item.full_address);
        console.log('Location Coordinates:', `Latitude: ${item.lat}, Longitude: ${item.lng}`);

        setLocationData({ lat: item.lat, lng: item.lng });

        const postalCode = item.full_address.match(/\d{6}$/)?.[0] || 'No postal code';
        setFullAddress(item.full_address);
        setPincode(postalCode);
        navigation.navigate('MapScreen', { lat: item.lat, lng: item.lng });
      }}
      style={styles.predictionItem}
    >
     
      <Text style={styles.mainText}>{item.description.split(' ')[0]}</Text>
      <Text style={styles.subText}>
      {item.full_address?.slice(0, item.full_address.indexOf('India') + 5)}
    </Text>

    </TouchableOpacity>
    </View>
  );

  const renderCurrentLocation = () => (
  <View>
      <TouchableOpacity
      style={{ flexDirection: 'row', alignSelf: 'flex-start', justifyContent: 'flex-start', marginVertical: 10,marginHorizontal:30 }}
      onPress={getCurrentLocation}
    >
      <MaterialIcons name={'my-location'} size={30} color="#000000" />
      <View style={{ marginLeft: 10 }}>
        <Text style={{ fontSize: 16, fontWeight: 'bold' ,color:'#000'}}>Use Current Location</Text>
        <Text style={{ fontSize: 14, color: '#777' }}>Using GPS</Text>
      </View>
    </TouchableOpacity>


    <TouchableOpacity
      style={{ flexDirection: 'row', alignSelf: 'flex-start', justifyContent: 'flex-start', marginVertical: 10,marginHorizontal:30 }}
      onPress={()=>navigation.navigate('AddAddress')}
    >
      <MaterialIcons name={'add-location-alt'} size={30} color="#000000" />
      <View style={{ marginLeft: 10 }}>
        <Text style={{ fontSize: 16, fontWeight: 'bold' ,color:'#000'}}>Add Address</Text>
        {/* <Text style={{ fontSize: 14, color: '#777' }}>Using GPS</Text> */}
      </View>
    </TouchableOpacity>
  </View>

    
  );

  return (
    <View style={{ backgroundColor: 'white', flex: 1 }}>
      <View style={styles.searchContainer}>
        <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
          <MaterialCommunityIcons name={'arrow-left'} size={30} color="#000000" />
        </TouchableOpacity>
        <TextInput
          style={styles.searchInput}
          onChangeText={setSearchText}
          value={searchText}
          placeholder="Enter Location"
          autoFocus={true}
          placeholderTextColor='black'
        />
      </View>

      <FlatList
        data={predictions}
        renderItem={renderPrediction}
        keyExtractor={(item) => item.place_id}
        ListEmptyComponent={() => <Text style={styles.emptyText}>No results found</Text>}
        ListFooterComponent={renderCurrentLocation}
      />
    </View>
  );
};

// Updated Styles
const styles = StyleSheet.create({
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginHorizontal: 15,
    marginTop: 40,
    backgroundColor: 'white',
    borderRadius: 10,
    elevation: 3,
  },
  backButton: {
    alignSelf: 'center',
    paddingHorizontal: 10,
  },
  searchInput: {
    flex: 1,
    height: 50,
    backgroundColor: '#fff',
    paddingHorizontal: 15,
    fontSize: 16,
    borderRadius: 10,
    color:'black'
  },
  predictionItem: {
    backgroundColor: '#fff',
    paddingVertical: 15,
    paddingHorizontal: 20,
    borderRadius: 8,
    marginVertical: 5,
    marginHorizontal: 15,
    borderColor: '#ddd',
    borderBottomWidth: 1,
  },
  mainText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#000',
  },
  subText: {
    fontSize: 14,
    color: '#555',
    marginTop: 5,
  },
  emptyText: {
    fontSize: 16,
    textAlign: 'center',
    color: '#aaa',
    marginTop: 20,
  },
});

export default GooglePlacesAutocomplete;
