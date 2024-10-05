import React, { useEffect, useRef, useState } from 'react';
import { StyleSheet, Text, View, Dimensions, TouchableOpacity, Alert, ActivityIndicator, PermissionsAndroid, Platform } from 'react-native';
import MapView, { Marker } from 'react-native-maps';
import Geolocation from '@react-native-community/geolocation';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation } from '@react-navigation/native';

const GOOGLE_MAPS_APIKEY = "AIzaSyCldVSEPoJ4_YS1rlM_LbWgbNMc_TTMBv8"; // Replace with your actual API key

export default function MapScreen() {
  const navigation = useNavigation();
  const [coordinates, setCoordinates] = useState({ latitude: 13.083372224685666, longitude: 80.2326378919348 }); // Default coordinates
  const [region, setRegion] = useState(""); // For displaying the formatted address
  const [isFetchingAddress, setIsFetchingAddress] = useState(false); // Loading state for address fetching
  const mapView = useRef(null);

  useEffect(() => {
    requestLocationPermission();
  }, []);

  // Request location permission for Android
  const requestLocationPermission = async () => {
    if (Platform.OS === 'android') {
      try {
        const granted = await PermissionsAndroid.request(
          PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
          {
            title: 'Location Permission',
            message: 'This app requires access to your location.',
            buttonNeutral: 'Ask Me Later',
            buttonNegative: 'Cancel',
            buttonPositive: 'OK',
          }
        );
        if (granted === PermissionsAndroid.RESULTS.GRANTED) {
          getCurrentPosition();
        } else {
          Alert.alert('Error', 'Location permission not granted.');
        }
      } catch (err) {
        console.warn(err);
      }
    } else {
      getCurrentPosition(); // iOS permissions handled automatically
    }
  };

  // Get the user's current location
  const getCurrentPosition = () => {
    Geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude } = position.coords;
        setCoordinates({ latitude, longitude });
        fetchAddress(latitude, longitude);
      },
      (error) => {
        Alert.alert('Error', 'Unable to get your location.');
        console.log(error);
      },
      { enableHighAccuracy: true, timeout: 15000, maximumAge: 10000 }
    );
  };

  // Fetch the address based on latitude and longitude
  const fetchAddress = async (latitude, longitude) => {
    setIsFetchingAddress(true); // Start loading
    try {
      const response = await fetch(`https://maps.googleapis.com/maps/api/geocode/json?latlng=${latitude},${longitude}&key=${GOOGLE_MAPS_APIKEY}`);
      const json = await response.json();
      if (json.status === "OK") {
        const formattedAddress = json.results[0].formatted_address;
        setRegion(formattedAddress);

        // Extract pincode from the formatted address
        const pincode = formattedAddress.match(/(\d{6})\s*,\s*India/)?.[1] || 'Pincode not found';
        await AsyncStorage.setItem('pin_codes', pincode);
        await AsyncStorage.setItem('city_name', formattedAddress);

        //navigation.replace('Home');
      } else {
        console.log('Geocoding error:', json.status);
      }
    } catch (error) {
      console.log(error);
      Alert.alert('Error', 'Unable to fetch address.');
    } finally {
      setIsFetchingAddress(false); // End loading
    }
  };

  // When the marker is dragged to a new location
  const handleMarkerDragEnd = (e) => {
    const newCoordinate = e.nativeEvent.coordinate;
    setCoordinates(newCoordinate);
    fetchAddress(newCoordinate.latitude, newCoordinate.longitude);
  };

  // When the map is pressed, set the marker and fetch the address
  const handleMapPress = (e) => {
    const newCoordinate = e.nativeEvent.coordinate;
    setCoordinates(newCoordinate);
    fetchAddress(newCoordinate.latitude, newCoordinate.longitude);
  };

  // Submit the selected location (coordinates and address)
  const handleSubmit = () => {
    console.log('Selected Location:', {
      latitude: coordinates.latitude,
      longitude: coordinates.longitude,
      address: region,
    });
    Alert.alert('Location Submitted', `Latitude: ${coordinates.latitude}, Longitude: ${coordinates.longitude}, Address: ${region}`);
    navigation.navigate('Home')
  };

  return (
    <View style={styles.container}>
      <MapView
        ref={mapView}
        style={styles.maps}
        initialRegion={{
          latitude: coordinates.latitude,
          longitude: coordinates.longitude,
          latitudeDelta: 0.0622,
          longitudeDelta: 0.0121,
        }}
        onPress={handleMapPress} // Add onPress event to the MapView
      >
        <Marker
          coordinate={coordinates}
          draggable
          onDragEnd={handleMarkerDragEnd}
        />
      </MapView>

      <View style={styles.bottomContainer}>
        <Text style={styles.addressText}>{region || "Fetching address..."}</Text>
        {isFetchingAddress ? (
          <ActivityIndicator size="small" color="#FF6347" />
        ) : (
          <TouchableOpacity style={styles.submitButton} onPress={handleSubmit}>
            <Text style={styles.submitButtonText}>Submit</Text>
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  maps: {
    width: Dimensions.get('screen').width,
    height: Dimensions.get('screen').height,
  },
  bottomContainer: {
    position: 'absolute',
    bottom: 0,
    width: '100%',
    padding: 20,
    backgroundColor: '#ffffff',
    borderTopLeftRadius: 10,
    borderTopRightRadius: 10,
  },
  addressText: {
    fontSize: 20,
    fontWeight: '600',
    marginBottom: 20,
  },
  submitButton: {
    alignSelf: 'center',
    paddingHorizontal: 20,
    paddingVertical: 10,
    backgroundColor: '#FF6347',
    borderRadius: 10,
  },
  submitButtonText: {
    color: '#ffffff',
    fontSize: 20,
  },
});
