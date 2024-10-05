import React, { useEffect, useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation } from '@react-navigation/native';
import auth from '@react-native-firebase/auth'; // Import Firebase Auth

const Header = () => {
    const navigation = useNavigation();
    const [cartCount, setCartCount] = useState(0);

    const fetchCartItems = async () => {
        try {
            const storedCartItems = await AsyncStorage.getItem('cartItems');
            if (storedCartItems) {
                const items = JSON.parse(storedCartItems);
                setCartCount(items.length > 0 ? items.length : 0);
            } else {
                setCartCount(0);
            }
        } catch (error) {
            Alert.alert('Error', 'Failed to load cart items');
        }
    };

    // Function to handle logout
    const handleLogout = () => {
        Alert.alert(
            'Logout',
            'Are you sure you want to logout?',
            [
                {
                    text: 'Cancel',
                    style: 'cancel',
                },
                {
                    text: 'Yes',
                    onPress: async () => {
                        try {
                            // Clear AsyncStorage
                            await AsyncStorage.clear();
                            // Sign out the user from Firebase authentication
                            await auth().signOut();
                            // Navigate to PhoneSignIn screen
                            navigation.replace('PhoneSignIn');
                        } catch (error) {
                            Alert.alert('Error', 'Failed to log out. Please try again.');
                        }
                    },
                },
            ],
            { cancelable: false }
        );
    };

    useEffect(() => {
        fetchCartItems();

        const intervalId = setInterval(() => {
            fetchCartItems();
        }, 1000);

        return () => clearInterval(intervalId);
    }, []);

    return (
        <View style={styles.headerContainer}>
            <TouchableOpacity style={styles.iconContainer} >
                <TouchableOpacity style={styles.searchInputContainer} onPress={()=>navigation.replace('AllProduct')} >
                    <Ionicons name="search-outline" size={20} color="#fff" style={styles.searchIcon} />
                    <Text style={styles.searchInput}>
                        Search
                    </Text>
                </TouchableOpacity>
            </TouchableOpacity>
            <View style={styles.rightIconsContainer}>
                <TouchableOpacity style={styles.iconWrapper} onPress={() => navigation.navigate('Order')}>
                    <View style={styles.badge}>
                        <Text style={styles.badgeText}>{cartCount}</Text>
                    </View>
                    <Ionicons name="cart-outline" size={24} color="#fff" />
                </TouchableOpacity>
                <TouchableOpacity style={styles.iconWrapper} onPress={handleLogout}>
                    <Ionicons name="exit-outline" size={24} color="#fff" />
                </TouchableOpacity>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    headerContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#1f45fc',
        paddingHorizontal: 10,
        paddingVertical: 10,
        justifyContent: 'space-between',
        zIndex: 1,
    },
    iconContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        flex: 1,
    },

    searchInputContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#0e3c9d',
        borderRadius: 5,
        paddingHorizontal: 10,
        flex: 1,
      },
      searchInput: {
        height: 40,
        color: '#fff',
        flex: 1,
        paddingLeft: 10,
      },

    searchIcon: {
        paddingHorizontal: 10,
    },

    rightIconsContainer: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    iconWrapper: {
        marginLeft: 15,
        position: 'relative',
    },
    badge: {
        position: 'absolute',
        top: -5,
        right: -10,
        backgroundColor: '#f00',
        borderRadius: 10,
        width: 20,
        height: 20,
        justifyContent: 'center',
        alignItems: 'center',
    },
    badgeText: {
        color: '#fff',
        fontSize: 12,
        fontWeight: 'bold',
    },
});

export default Header;
