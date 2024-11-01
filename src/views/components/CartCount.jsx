import React, { useEffect, useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Ionicons from 'react-native-vector-icons/Ionicons';

const CartCount = () => {
  const [cartCount, setCartCount] = useState(0);

  // Fetch cart items from AsyncStorage and calculate count
  const fetchCartCount = async () => {
    try {
      const cartItems = await AsyncStorage.getItem('cart_items');
      const parsedItems = cartItems ? JSON.parse(cartItems) : [];
      const count = parsedItems.reduce((total, item) => total + item.quantity, 0);
      setCartCount(count);
    } catch (error) {
      console.error('Error fetching cart items:', error);
      Alert.alert('Error', 'Failed to load cart items');
    }
  };

  // Update count when cart items change
  useEffect(() => {
    fetchCartCount();
    const interval = setInterval(fetchCartCount, 1000); // Refresh every 5 seconds

    return () => clearInterval(interval);
  }, []);

  // Function to add item to cart for demonstration
  const addToCart = async () => {
    try {
      const cartItems = await AsyncStorage.getItem('cart_items');
      const parsedItems = cartItems ? JSON.parse(cartItems) : [];
      
      // Add a demo item with a quantity of 1
      const newItem = { id: Math.random().toString(), name: 'Demo Item', quantity: 1 };
      parsedItems.push(newItem);

      await AsyncStorage.setItem('cart_items', JSON.stringify(parsedItems));
      fetchCartCount(); // Refresh cart count
      Alert.alert('Added', 'Item added to cart');
    } catch (error) {
      console.error('Error adding item to cart:', error);
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.rowContainer}>
        <Ionicons name="cart-outline" size={24} color="#fff" />
        <Text style={styles.headerText}>Cart Count</Text>
      </View>
      <Text style={styles.countText}>Items in Cart: {cartCount}</Text>
      <TouchableOpacity style={styles.button} onPress={addToCart}>
        <Text style={styles.buttonText}>Add Item to Cart</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#1c44fc',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
  rowContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  headerText: {
    color: '#fff',
    fontSize: 20,
    fontWeight: 'bold',
    marginLeft: 10,
  },
  countText: {
    color: '#fff',
    fontSize: 18,
    marginBottom: 30,
  },
  button: {
    backgroundColor: '#fff',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 5,
  },
  buttonText: {
    color: '#1c44fc',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default CartCount;
