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
      const cartItems = await AsyncStorage.getItem('cartItems');
      let updatedCart = cartItems ? JSON.parse(cartItems) : [];

      const productIndex = updatedCart.findIndex(item => item.product_id === product.Product_id);

      if (productIndex !== -1) {
        updatedCart[productIndex].quantity += quantity;
      } else {
        updatedCart.push({
          Prodouct_img: product.Prodouct_img_0,
          product_id: product.Product_id,
          quantity: quantity,
          sell_price: product.sell_price,
          weight: product.Weight,
          delivery_option: product.delivery_option
        });
      }

      await AsyncStorage.setItem('cartItems', JSON.stringify(updatedCart));

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
      try {
        const cartItems = await AsyncStorage.getItem('cartItems');
        let updatedCart = cartItems ? JSON.parse(cartItems) : [];

        const productIndex = updatedCart.findIndex(item => item.product_id === product.Product_id);

        if (productIndex !== -1) {
          updatedCart.splice(productIndex, 1);
          await AsyncStorage.setItem('cartItems', JSON.stringify(updatedCart));
        }

        setIsAddedToCart(false);
        setQuantity(1);
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
          <Image 
            source={{ uri: product.Prodouct_img_0 || 'https://ik.imagekit.io/efsdltq0e/icons/No_img.png?updatedAt=1727376099723' }} 
            style={styles.image} 
          />
        </View>

        {/* Product Details */}
        <View style={styles.card}>
          <Text style={styles.productName}>{product.Product_name}</Text>

          <View style={styles.priceContainer}>
            <Text style={styles.productPrice}>₹{product.sell_price}</Text>
            <Text style={styles.productOffer}>₹{product.MRP}</Text>
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
                <Ionicons name="remove-outline" size={24} color="#fff" />
              </TouchableOpacity>
              <Text style={styles.quantityText}>{quantity}</Text>
              <TouchableOpacity style={styles.quantityButton} onPress={increaseQuantity}>
                <Ionicons name="add-outline" size={24} color="#fff" />
              </TouchableOpacity>
            </View>
          )}

          {/* Display all the product details */}
          <View style={styles.infoSection}>
            <Text style={styles.sectionTitle}>Product Details</Text>
            <View style={styles.infoRow}>
              <Ionicons name="information-circle-outline" size={20} color="#000" />
              <Text style={styles.infoText}>About Product: {product.About_Product}</Text>
            </View>
            <View style={styles.infoRow}>
              <Ionicons name="checkmark-circle-outline" size={20} color="#000" />
              <Text style={styles.infoText}>Benefits: {product.Benefits}</Text>
            </View>
            <View style={styles.infoRow}>
              <Ionicons name="cube-outline" size={20} color="#000" />
              <Text style={styles.infoText}>Storage and Uses: {product.Storage_and_Uses}</Text>
            </View>
            <View style={styles.infoRow}>
              <Ionicons name="pricetags-outline" size={20} color="green" />
              <Text style={styles.infoText}>Brand: {product.Brand_name}</Text>
            </View>
            <View style={styles.infoRow}>
              <Ionicons name="bicycle-outline" size={20} color="#000" />
              <Text style={styles.infoText}>Delivery Option: {product.delivery_option}</Text>
            </View>
            <View style={styles.infoRow}>
              <Ionicons name="speedometer-outline" size={20} color="#000" />
              <Text style={styles.infoText}>Weight: {product.Weight}</Text>
            </View>
            <View style={styles.infoRow}>
              <Ionicons name="cash-outline" size={20} color="#000" />
              <Text style={styles.infoText}>GST Rate: {product.GST_Rate}%</Text>
            </View>
          </View>
        </View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff', // Light background
  },
  imageContainer: {
    backgroundColor: '#ffffff',
    elevation: 8,
    margin: 15,
    borderRadius: 10,
    overflow: 'hidden', // Ensures the image follows the border radius
  },
  image: {
    width: '100%',
    height: 350,
    resizeMode: 'cover',
  },
  card: {
    backgroundColor: '#fff',
    padding: 20,
    marginHorizontal: 15,
    marginBottom: 25,
    borderRadius: 10,
    shadowColor: '#000', // Add shadow for better visual depth
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 5,
  },
  productName: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#343a40', // Darker text for better contrast
    marginBottom: 15,
  },
  priceContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 15,
  },
  productPrice: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#28a745', // Green for pricing
    marginRight: 10,
  },
  productOffer: {
    fontSize: 18,
    color: 'silver', // Red for offer
    textDecorationLine: 'line-through',
  },
  addToCartButton: {
    flexDirection: 'row',
    backgroundColor: '#ecfdf5', // Lighter greenish background
    padding: 12,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 20,
    borderColor: '#28a745', // Match with the theme
    borderWidth: 1,
  },
  addToCartText: {
    color: '#28a745',
    fontWeight: 'bold',
    marginLeft: 10,
    fontSize: 16,
  },
  quantityContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 20,
  },
  quantityButton: {
    backgroundColor: '#28a745', // Green for buttons
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 5,
  },
  quantityText: {
    fontSize: 18,
    marginHorizontal: 20,
    color: '#333', // Neutral text color
    fontWeight: 'bold',
  },
  infoSection: {
    marginTop: 20,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 10,
    color: '#343a40',
  },
  infoRow: {
    flexDirection: 'row',
    marginBottom: 8,
  },
  infoText: {
    marginLeft: 8,
    fontSize: 16,
    color: '#495057', // Slightly darker text for better readability
  },
});

export default SingleProduct;
