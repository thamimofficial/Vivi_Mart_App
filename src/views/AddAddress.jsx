import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  Modal,
  TextInput,
  ScrollView,
  StyleSheet,
  Alert,
} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation } from '@react-navigation/native';

const AddAddress = () => {
  const navigation = useNavigation();
  const [addresses, setAddresses] = useState([]);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [selectedAddress, setSelectedAddress] = useState(null);
  const [newAddress, setNewAddress] = useState({
    houseNo: '',
    floor: '',
    area: '',
    landmark: '',
    recipientName: '',
    phone: '',
    type: 'Home', // Default type
    address: '', // Complete address string
  });

  useEffect(() => {
    loadAddresses();
  }, []);

  // Load addresses from AsyncStorage
  const loadAddresses = async () => {
    try {
      let storedAddresses = [];
      for (let i = 1; i <= 100; i++) {
        const address = await AsyncStorage.getItem(`address${i}`);

        if (address) {
          try {
            const parsedAddress = JSON.parse(address);
            storedAddresses.push(parsedAddress); // Add parsed JSON address
          } catch (error) {
            storedAddresses.push(address); // Add plain string address if parsing fails
          }
        } else {
          break; // Stop if no more addresses
        }
      }

      console.log('Stored addresses:', storedAddresses);
      setAddresses(storedAddresses); // Set addresses once after the loop
    } catch (error) {
      console.error('Error loading addresses:', error);
    }
  };

  // Save addresses to AsyncStorage
  const saveAddressesToStorage = async (updatedAddresses) => {
    try {
      // Clear existing addresses
      for (let i = 1; i <= 100; i++) {
        await AsyncStorage.removeItem(`address${i}`);
      }

      // Save updated addresses
      updatedAddresses.forEach(async (address, index) => {
        await AsyncStorage.setItem(`address${index + 1}`, JSON.stringify(address));
      });
    } catch (error) {
      console.error('Error saving addresses:', error);
    }
  };

  // Open modal to edit address
  const openEditModal = (address) => {
    setSelectedAddress(address);
    setNewAddress(address);
    setIsModalVisible(true);
  };

  // Save edited address
  const saveAddress = () => {
    const updatedAddress = {
      ...newAddress,
      address: `${newAddress.houseNo}, ${newAddress.floor}, ${newAddress.area}, ${newAddress.landmark}, ${newAddress.recipientName}, ${newAddress.phone} (${newAddress.type})`,
    };
    const updatedAddresses = addresses.map((item) =>
      item.id === selectedAddress.id ? { ...item, ...updatedAddress } : item
    );
    setAddresses(updatedAddresses);
    saveAddressesToStorage(updatedAddresses);
    setIsModalVisible(false);
    setSelectedAddress(null);
  };

  // Add a new address
  const addNewAddress = () => {
    const newId = addresses.length + 1;
    const fullAddress = `${newAddress.houseNo}, ${newAddress.floor}, ${newAddress.area}, ${newAddress.landmark}, ${newAddress.recipientName}, ${newAddress.phone} (${newAddress.type})`;
    const updatedAddresses = [...addresses, { id: newId, ...newAddress, address: fullAddress }];
    setAddresses(updatedAddresses);
    saveAddressesToStorage(updatedAddresses);
    setNewAddress({
      houseNo: '',
      floor: '',
      area: '',
      landmark: '',
      recipientName: '',
      phone: '',
      type: 'Home',
      address: '',
    });
    setIsModalVisible(false);
  };

  // Delete address
  const deleteAddress = (id) => {
    Alert.alert(
      'Delete Address',
      'Are you sure you want to delete this address?',
      [
        {
          text: 'Cancel',
          style: 'cancel',
        },
        {
          text: 'OK',
          onPress: () => {
            const updatedAddresses = addresses.filter(item => item.id !== id);
            const reAlignedAddresses = updatedAddresses.map((item, index) => ({
              ...item,
              id: index + 1,
            }));
            setAddresses(reAlignedAddresses);
            saveAddressesToStorage(reAlignedAddresses);
          },
        },
      ]
    );
  };

  return (
    <View style={styles.container}>
      <Text style={styles.pageTitle}>Manage Addresses</Text>

      {/* Display Address Cards */}
      <ScrollView contentContainerStyle={styles.addressList}>
        {addresses.map((item) => (
          <View key={item.id} style={styles.addressCard}>
            <Text style={styles.addressText}>
              {item.address} {/* Full address displayed */}
            </Text>
            <View style={styles.cardActions}>
              <TouchableOpacity onPress={() => openEditModal(item)}>
                <Icon name="pencil-outline" size={20} color="#000" />
              </TouchableOpacity>
              <TouchableOpacity onPress={() => deleteAddress(item.id)}>
                <Icon name="trash-outline" size={20} color="#ff0000" />
              </TouchableOpacity>
            </View>
          </View>
        ))}

        {/* Add Address Card */}
        <TouchableOpacity
          style={[styles.addressCard, styles.addCard]}
          onPress={() => {
            setSelectedAddress(null);
            setNewAddress({
              houseNo: '',
              floor: '',
              area: '',
              landmark: '',
              recipientName: '',
              phone: '',
              type: 'Home',
              address: '',
            });
            setIsModalVisible(true);
          }}
        >
          <Icon name="add-circle-outline" size={24} color="#007bff" />
          <Text style={styles.addText}>Add New Address</Text>
        </TouchableOpacity>

        <TouchableOpacity onPress={() => navigation.navigate('GooglePlacesAutocomplete')}
          style={[styles.addressCard, styles.addCard]}
        >
          <Icon name="add-circle-outline" size={24} color="#007bff" />
          <Text style={styles.addText}>Select Address</Text>
        </TouchableOpacity>
      </ScrollView>

      {/* Modal for Editing/Adding Address */}
      <Modal visible={isModalVisible} animationType="slide" transparent>
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>
              {selectedAddress ? 'Edit Address' : 'Add Address'}
            </Text>
            <TextInput
              style={styles.input}
              value={newAddress.houseNo}
              onChangeText={(text) => setNewAddress({ ...newAddress, houseNo: text })}
              placeholder="House No/Bldg No"
            />
            <TextInput
              style={styles.input}
              value={newAddress.floor}
              onChangeText={(text) => setNewAddress({ ...newAddress, floor: text })}
              placeholder="Floor/Wing"
            />
            <TextInput
              style={styles.input}
              value={newAddress.area}
              onChangeText={(text) => setNewAddress({ ...newAddress, area: text })}
              placeholder="Area/Locality"
            />
            <TextInput
              style={styles.input}
              value={newAddress.landmark}
              onChangeText={(text) => setNewAddress({ ...newAddress, landmark: text })}
              placeholder="Landmark"
            />
            <TextInput
              style={styles.input}
              value={newAddress.recipientName}
              onChangeText={(text) => setNewAddress({ ...newAddress, recipientName: text })}
              placeholder="Recipient Name"
            />
            <TextInput
              style={styles.input}
              value={newAddress.phone}
              onChangeText={(text) => setNewAddress({ ...newAddress, phone: text })}
              placeholder="Phone Number"
              keyboardType="phone-pad"
            />

            {/* Radio Buttons for Address Type */}
            <Text style={styles.radioTitle}>Address Type:</Text>
            <View style={styles.radioContainer}>
              {['Home', 'Work', 'Other'].map((type) => (
                <TouchableOpacity key={type} style={styles.radioOption} onPress={() => setNewAddress({ ...newAddress, type })}>
                  <View style={[styles.radioCircle, newAddress.type === type && styles.selectedRadio]} />
                  <Text>{type}</Text>
                </TouchableOpacity>
              ))}
            </View>

            <View style={styles.modalButtons}>
              <TouchableOpacity
                style={[styles.button, styles.cancelButton]}
                onPress={() => setIsModalVisible(false)}
              >
                <Text style={styles.buttonText}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.button, styles.saveButton]}
                onPress={selectedAddress ? saveAddress : addNewAddress}
              >
                <Text style={styles.buttonText}>{selectedAddress ? 'Save' : 'Add'}</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#fff',
  },
  pageTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  addressList: {
    paddingBottom: 16,
  },
  addressCard: {
    backgroundColor: '#f9f9f9',
    padding: 16,
    borderRadius: 8,
    marginBottom: 16,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  addressText: {
    fontSize: 16,
    flex: 1,
  },
  cardActions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: 80,
  },
  addCard: {
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'row',
  },
  addText: {
    marginLeft: 8,
    fontSize: 16,
    color: '#007bff',
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    backgroundColor: '#fff',
    margin: 16,
    padding: 16,
    borderRadius: 8,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    padding: 8,
    borderRadius: 4,
    marginBottom: 8,
  },
  radioTitle: {
    fontSize: 16,
    marginVertical: 8,
  },
  radioContainer: {
    flexDirection: 'row',
    marginBottom: 16,
  },
  radioOption: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 16,
  },
  radioCircle: {
    width: 20,
    height: 20,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: '#007bff',
    marginRight: 8,
  },
  selectedRadio: {
    backgroundColor: '#007bff',
  },
  modalButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  button: {
    padding: 10,
    borderRadius: 4,
  },
  cancelButton: {
    backgroundColor: '#ccc',
  },
  saveButton: {
    backgroundColor: '#007bff',
  },
  buttonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
});

export default AddAddress;
