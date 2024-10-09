import React, { useState } from 'react';
import { View, Text, Image, StyleSheet, ScrollView, TouchableOpacity, Alert } from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Header from './components/Header';
import ExpandableLocationCard from './components/ExpandableLocationCard';

const SingleProduct = ({ route }) => {
  const { product } = route.params; // Get the product details from route params
  const [isAddedToCart, setIsAddedToCart] = useState(false); // State to track if item is added
  const [quantity, setQuantity] = useState(1); // State to manage quantity

  const handleAddToCart = async () => {
    try {
      // Retrieve existing cart items
      const cartItems = await AsyncStorage.getItem('cartItems');
      let updatedCart = cartItems ? JSON.parse(cartItems) : [];

      // Check if the product already exists in the cart
      const productIndex = updatedCart.findIndex(item => item.product_id === product.Product_id);

      if (productIndex !== -1) {
        // If the product already exists, update the quantity
        updatedCart[productIndex].quantity += quantity;
        // Alert.alert('Success', 'Product quantity updated in cart!');
      } else {
        // If it does not exist, add it to the cart with the current quantity
        updatedCart.push({
          Prodouct_img: product.Prodouct_img_0,
          product_id: product.Product_id,
          quantity: quantity, // Add the quantity here
          sell_price: product.sell_price,
          weight: 1.00, // Adjust this value as necessary
        });
        // Alert.alert('Success', 'Product added to cart!');
      }

      // Store updated cart in AsyncStorage
      await AsyncStorage.setItem('cartItems', JSON.stringify(updatedCart));
      
      // Reset quantity and state
      setIsAddedToCart(true);
      setQuantity(1); // Reset quantity to 1 after adding to cart
    } catch (error) {
      Alert.alert('Error', 'Failed to add/update product in cart');
    }
  };

  const increaseQuantity = () => {
    setQuantity(quantity + 1);
  };

  const decreaseQuantity = async () => {
    if (quantity > 1) {
      setQuantity(quantity - 1);
    } else {
      // If quantity is 1 and decrement is pressed, remove the item from the cart
      try {
        // Retrieve existing cart items
        const cartItems = await AsyncStorage.getItem('cartItems');
        let updatedCart = cartItems ? JSON.parse(cartItems) : [];

        // Find the product index
        const productIndex = updatedCart.findIndex(item => item.product_id === product.Product_id);
        
        if (productIndex !== -1) {
          // Remove the product from the cart
          updatedCart.splice(productIndex, 1);
          await AsyncStorage.setItem('cartItems', JSON.stringify(updatedCart));
          // Alert.alert('Removed', 'Product removed from cart!'); // Show alert
        }

        setIsAddedToCart(false); // Show "Add to Cart" button again
        setQuantity(1); // Reset quantity to 1
      } catch (error) {
        Alert.alert('Error', 'Failed to remove product from cart');
      }
    }
  };

  return (
    <View style={styles.container}>
      <ExpandableLocationCard showBackButton={true} />
      <Header />
      <ScrollView>
        {/* Product Image */}
        <View style={styles.imageContainer}>
          <Image source={{ uri: product.Prodouct_img_0 ||'https://ik.imagekit.io/efsdltq0e/icons/No_img.png?updatedAt=1727376099723'}} style={styles.image} />
        </View>

        {/* Product Details */}
        <View style={styles.card}>
          <Text style={styles.productName}>{product.Product_name}</Text>

          <View style={styles.priceContainer}>
            <Text style={styles.productPrice}>₹{product.sell_price}</Text>
            <Text style={styles.productOffer}>₹{product.offer}</Text>
          </View>

          {/* Add to Cart Button or Quantity Selector */}
          {!isAddedToCart ? (
            <TouchableOpacity style={styles.addToCartButton} onPress={handleAddToCart}>
              <Ionicons name="cart-outline" size={24} color="#000" />
              <Text style={styles.addToCartText}>Add to Cart</Text>
            </TouchableOpacity>
          ) : (
            <View style={styles.quantityContainer}>
              <TouchableOpacity style={styles.quantityButton} onPress={decreaseQuantity}>
              <Ionicons style={styles.quantityButtonText} name="remove-outline" size={24} color="#fff" />
              </TouchableOpacity>
              <Text style={styles.quantityText}>{quantity}</Text>
              <TouchableOpacity style={styles.quantityButton} onPress={increaseQuantity}>
              <Ionicons style={styles.quantityButtonText} name="add-outline" size={24} color="#fff" />
              </TouchableOpacity>
            </View>
          )}

          {/* Information Sections */}
          <View style={styles.infoSection}>
            <Ionicons name="bicycle-outline" size={20} color="#6c757d" />
            <Text style={styles.infoText}>Delivery Option: {product.delivery_option}</Text>
          </View>

          <View style={styles.infoSection}>
            <Ionicons name="information-circle-outline" size={20} color="#6c757d" />
            <Text style={styles.infoText}>About Product: {product.About_Product}</Text>
          </View>

          <View style={styles.infoSection}>
            <Ionicons name="checkmark-circle-outline" size={20} color="#6c757d" />
            <Text style={styles.infoText}>Benefits: {product.Benefits}</Text>
          </View>

          <View style={styles.infoSection}>
            <Ionicons name="cube-outline" size={20} color="#6c757d" />
            <Text style={styles.infoText}>Storage and Uses: {product.Storage_and_Uses}</Text>
          </View>
        </View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff', // Slight off-white background for full screen
  },
  imageContainer: {
    backgroundColor: '#ffffff',
    elevation: 3, // Card-like effect for the image
    margin: 10,
    borderRadius: 10,
  },
  image: {
    width: '100%',
    height: 350,
    resizeMode: 'contain',
    borderRadius: 10,
  },
  card: {
    backgroundColor: '#fff',
    padding: 20,
    marginHorizontal: 10,
    marginBottom: 20,
    borderRadius: 10,
  },
  productName: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 10,
  },
  priceContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  productPrice: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#28a745',
    marginRight: 10,
  },
  productOffer: {
    fontSize: 16,
    color: '#dc3545',
    textDecorationLine: 'line-through',
  },
  addToCartButton: {
    flexDirection: 'row',
    backgroundColor: '#ecfdf5',
    padding: 12,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 15,
    borderColor:'green',
    borderWidth:1
  },
  addToCartText: {
    color: '#000',
    fontWeight: 'bold',
    marginLeft: 10,
  },
  quantityContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 15,
  },
  quantityButton: {
    backgroundColor: '#318616',
    paddingVertical:5,
    paddingHorizontal: 10,
    borderRadius: 5,
  },
  quantityText: {
    fontSize: 18,
    marginHorizontal: 15,
  },
  quantityButtonText: {
    color: '#fff',
    fontSize: 10,
    fontWeight: 'bold',
  },
  infoSection: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 5,
  },
  infoText: {
    marginLeft: 10,
    color: '#555',
  },
});

export default SingleProduct;
