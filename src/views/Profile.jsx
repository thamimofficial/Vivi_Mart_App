import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ScrollView } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons'; // Import Ionicons from react-native-vector-icons
import Header from './components/Header';
import ExpandableLocationCard from './components/ExpandableLocationCard';
import Bottom from './bottom';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { getAuth, signOut } from '@react-native-firebase/auth';

const Profile = ({ navigation }) => {

    const logout = async () => {
        const auth = getAuth(); // Get Firebase auth instance
        
        try {
          // Sign out from Firebase
          await signOut(auth);
          console.log('Firebase user signed out successfully');
      
          // Clear all AsyncStorage data
          await AsyncStorage.clear();
          console.log('All AsyncStorage data cleared');
      
          // Navigate to PhoneSignIn screen
          navigation.replace('PhoneSignIn');
        } catch (error) {
          console.log('Error during sign-out: ', error);
        }}
      
  return (
    <View style={styles.container}>

        <ExpandableLocationCard />
          <Header />

      <ScrollView style={styles.content}>
        <TouchableOpacity style={styles.menuItem} onPress={() => navigation.navigate('YourOrder')}>
          <Icon name="list-outline" size={25} color="#007bff" />
          <Text style={styles.menuText}>Orders</Text>
        </TouchableOpacity>

        {/* <TouchableOpacity style={styles.menuItem} onPress={() => navigation.navigate('GeneralInfo')}>
          <Icon name="information-circle-outline" size={25} color="#007bff" />
          <Text style={styles.menuText}>General Info</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.menuItem} onPress={() => navigation.navigate('ProfileInfo')}>
          <Icon name="person-outline" size={25} color="#007bff" />
          <Text style={styles.menuText}>Profile</Text>
        </TouchableOpacity> */}

        <TouchableOpacity style={styles.menuItem} onPress={() => navigation.navigate('AddAddress')}>
          <Icon name="location-outline" size={25} color="#007bff" />
          <Text style={styles.menuText}>Address</Text>
        </TouchableOpacity>

        {/* <TouchableOpacity style={styles.menuItem} onPress={() => navigation.navigate('Support')}>
          <Icon name="help-circle-outline" size={25} color="#007bff" />
          <Text style={styles.menuText}>Customer Support</Text>
        </TouchableOpacity> */}

        {/* <TouchableOpacity style={styles.menuItem} onPress={() => navigation.navigate('Notifications')}>
          <Icon name="notifications-outline" size={25} color="#007bff" />
          <Text style={styles.menuText}>Notifications</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.menuItem} onPress={() => navigation.navigate('AboutUs')}>
          <Icon name="information-outline" size={25} color="#007bff" />
          <Text style={styles.menuText}>About Us</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.menuItem} onPress={() => navigation.navigate('Privacy')}>
          <Icon name="shield-checkmark-outline" size={25} color="#007bff" />
          <Text style={styles.menuText}>Account Privacy</Text>  
        </TouchableOpacity>

        <TouchableOpacity style={styles.menuItem} onPress={() => navigation.navigate('ShareApp')}>
          <Icon name="share-social-outline" size={25} color="#007bff" />
          <Text style={styles.menuText}>Share the App</Text>
        </TouchableOpacity> */}

        <TouchableOpacity style={[styles.menuItem, { marginTop: 20 }]} onPress={logout}>
          <Icon name="log-out-outline" size={25} color="#ff0000" />
          <Text style={[styles.menuText, { color: '#ff0000' }]}>Logout</Text>
        </TouchableOpacity>
      </ScrollView>

      {/* Footer */}
      {/* <View style={styles.footer}>
        <Text style={styles.footerText}>Version 1.1.1</Text>
      </View> */}
     <Bottom activeIcon="Profile" />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  header: {
    backgroundColor: '#007bff',
    height: 60,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 15,
  },
  headerTitle: {
    color: '#fff',
    fontSize: 20,
    fontWeight: 'bold',
    marginLeft: 20,
  },
  content: {
    padding: 10,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
    marginLeft:10
  },
  menuText: {
    fontSize: 16,
    marginLeft: 15,
  },
  footer: {
    alignItems: 'center',
    paddingVertical: 15,
  },
  footerText: {
    color: '#888',
    fontSize: 14,
  },
});

export default Profile;
