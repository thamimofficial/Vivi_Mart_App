import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation } from '@react-navigation/native';
import React, { useState, useEffect } from 'react';
import { View, TextInput, FlatList, Text, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import { getlocationID } from '../utils/config';

const GooglePlacesAutocomplete = () => {
  const navigation = useNavigation();
  const [searchText, setSearchText] = useState('');
  const [predictions, setPredictions] = useState([]);
  const [pincode, setPincode] = useState('');
  const [fullAddress, setFullAddress] = useState('');
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

                return postalCode ? { ...prediction, full_address: `${address}, ${postalCode}` } : null;
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

    try {
      const { status, data } = await getlocationID(pincode);
      console.log('API Response:', { status, data });

      if (status === 200) {
        if (data.length === 0) {
          setError('No location data available for this pincode.');
          Alert.alert('No Data', 'No location data available for this pincode.');
        } else {
          const locationData = data;
          console.log('locationData',locationData)
        await AsyncStorage.setItem('pin_codes',pincode);
        await AsyncStorage.setItem('city_name',fullAddress);

          await AsyncStorage.multiSet([
            ['location_id', locationData.id.toString()],
            ['location_name', locationData.location_name || 'thamim'],
            ['store_id', locationData.store_id],
            ['pin_codes', pincode],
          ]);

          Alert.alert('Location Saved', `Location: ${locationData.city_name}, Pincode: ${locationData.pin_codes}`);
          navigation.replace('Home')
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

  const renderPrediction = ({ item }) => (
    <TouchableOpacity
      onPress={() => {
        console.log('item.full_address',item.full_address)
        const postalCode = item.full_address.match(/\d{6}$/)?.[0] || 'No postal code';
        setFullAddress(item.full_address)
        setPincode(postalCode);
        if (postalCode.length === 6) {
          handlePincodeSubmit();
        } else {
          Alert.alert('Invalid Postal Code', 'The selected address does not contain a valid postal code.');
        }
      }}
      style={styles.predictionItem}
    >
      <Text style={styles.mainText}>{item.description.split(' ')[0]}</Text>
      <Text style={styles.subText}>{item.full_address}</Text>
    </TouchableOpacity>
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
        />
      </View>

      <FlatList
        data={predictions}
        renderItem={renderPrediction}
        keyExtractor={(item) => item.place_id}
        ListEmptyComponent={() => {<Text style={styles.emptyText}>No results found</Text>}}
      />
      <TouchableOpacity style={{flexDirection:'row', alignItems:'center',justifyContent:'flex-start'}}>
        
          <MaterialIcons name={'my-location'} size={30} color="#000000" />
          
          <Text>Use Current Location</Text>
          <Text>Usinge GPS</Text>
      </TouchableOpacity>
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
  },
  backButton: {
    alignSelf: 'center',
    paddingHorizontal: 10,
  },
  searchInput: {
    flex: 1,
    height: 50,
    borderRadius: 25,
    borderColor: '#ddd',
    borderWidth: 1,
    backgroundColor: '#fff',
    paddingHorizontal: 15,
    fontSize: 16,
    elevation: 2,
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
    color: '#333',
  },
  subText: {
    color: '#777',
    marginTop: 5,
  },
  emptyText: {
    textAlign: 'center',
    marginTop: 30,
    color: '#aaa',
    fontSize: 16,
  },
});

export default GooglePlacesAutocomplete;
