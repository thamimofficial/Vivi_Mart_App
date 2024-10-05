import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, Image, StyleSheet, TextInput, TouchableOpacity, Alert } from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { getAllProduct } from '../utils/config';
import ExpandableLocationCard from './components/ExpandableLocationCard';

const AllProduct = ({ navigation }) => {
  const [cartCount, setCartCount] = useState(0);
  const [searchQuery, setSearchQuery] = useState('');
  const [productsData, setProductsData] = useState([]);
  const [quantities, setQuantities] = useState({}); // Track quantities for each product

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const { status, data } = await getAllProduct();
        if (status === 200) {
          setProductsData(data);
          setQuantities(data.reduce((acc, product) => {
            acc[product.Product_id] = 0; // Initialize quantities
            return acc;
          }, {}));
        } else if (status === 200 && data.length === 0) {
          Alert.alert('No products available');
        } else {
          throw new Error('Failed to fetch products');
        }
      } catch (error) {
        Alert.alert('Error', error.message);
      }
    };

    fetchProducts();
  }, []);

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
              await AsyncStorage.clear();
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

  const updateCart = async (productId, quantity) => {
    try {
      const cartItems = await AsyncStorage.getItem('cartItems');
      let updatedCart = cartItems ? JSON.parse(cartItems) : [];

      const productIndex = updatedCart.findIndex(item => item.product_id === productId);
      if (productIndex !== -1) {
        if (quantity === 0) {
          updatedCart = updatedCart.filter(item => item.product_id !== productId);
        } else {
          updatedCart[productIndex].quantity = quantity;
        }
      } else {
        updatedCart.push({
          Product_name: productsData.find(product => product.Product_id === productId).Product_name,
          Prodouct_img: productsData.find(product => product.Product_id === productId).Prodouct_img_0,
          product_id: productId,
          quantity,
          sell_price: productsData.find(product => product.Product_id === productId).sell_price,
          weight: 1.0,
        });
      }

      await AsyncStorage.setItem('cartItems', JSON.stringify(updatedCart));
    } catch (error) {
      Alert.alert('Error', 'Failed to update cart items');
    }
  };

  const incrementQuantity = (productId) => {
    setQuantities(prev => {
      const newQuantity = prev[productId] + 1;
      updateCart(productId, newQuantity);
      return { ...prev, [productId]: newQuantity };
    });
  };

  const decrementQuantity = (productId) => {
    setQuantities(prev => {
      const newQuantity = Math.max(prev[productId] - 1, 0); // Prevent negative quantity
      updateCart(productId, newQuantity);
      return { ...prev, [productId]: newQuantity };
    });
  };

  const filteredProducts = productsData.filter(product =>
    product.Product_name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const renderProductCard = ({ item }) => (
    <View key={item.Product_id} style={styles.card}>
    <Image source={{ uri: item.Prodouct_img_0 }} style={styles.productImage} />
    <View style={styles.productDetails}>
      <Text style={styles.productName}>{item.Product_name}</Text>
      <Text style={styles.productPrice}>Sell Price: ₹{item.sell_price}</Text>
      <Text style={styles.productMRP}>MRP: ₹{item.MRP}</Text>
      <Text style={styles.productOffer}>Offer: {item.offer}% off</Text>
    </View>
  
    <View style={styles.quantityContainer}>
      {quantities[item.Product_id] === 0 ? (

        <TouchableOpacity style={styles.addButton} onPress={() => incrementQuantity(item.Product_id)}>
        <Text style={styles.addButtonText}>Add</Text>
        <Ionicons name="add" size={20} color="#fff" style={{fontSize:18,color:'black', fontWeight:'bold',paddingLeft:10}} />
        </TouchableOpacity>
      ) : (
        <View style={{flexDirection:'row',justifyContent:'space-evenly'}}>
          <TouchableOpacity onPress={() => decrementQuantity(item.Product_id)} disabled={quantities[item.Product_id] === 0}>
            <Ionicons name="remove-circle-outline" size={24} color="#ff0000" />
          </TouchableOpacity>
          <Text style={styles.quantityText}>{quantities[item.Product_id]}</Text>
          <TouchableOpacity onPress={() => incrementQuantity(item.Product_id)}>
            <Ionicons name="add-circle-outline" size={24} color="#00ff00" />
          </TouchableOpacity>
        </View>
      )}
    </View>
  </View>
  
  );

  return (
    <View style={styles.container}>
      <ExpandableLocationCard />
      <View style={styles.headerContainer}>
        <View style={styles.iconContainer}>
          <View style={styles.searchInputContainer}>
            <Ionicons name="search-outline" size={20} color="#fff" style={styles.searchIcon} />
            <TextInput
              style={styles.searchInput}
              placeholder="Search"
              placeholderTextColor="#fff"
              value={searchQuery}
              onChangeText={setSearchQuery}
            />
          </View>
        </View>
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
<View style={{marginTop:10}}>   
     <FlatList
        data={filteredProducts}
        renderItem={renderProductCard}
        keyExtractor={item => item.Product_id.toString()}
        contentContainerStyle={styles.productList}
        showsVerticalScrollIndicator={false}
      />
      </View>

    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  productList: {
    paddingHorizontal: 10,
    paddingBottom: 20,
  },
  card: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 10,
    marginBottom: 10,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'silver',
  },
  productImage: {
    width: 80,
    height: 80,
    borderRadius: 10,
    resizeMode: 'contain',
  },
  productDetails: {
    marginLeft: 10,
    flex: 1,
  },
  productName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
  },
  productPrice: {
    fontSize: 14,
    color: '#333',
  },
  productMRP: {
    fontSize: 12,
    color: '#888',
    textDecorationLine: 'line-through',
  },
  productOffer: {
    fontSize: 12,
    color: 'green',
  },
  quantityContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 10,
  },
  quantityText: {
    marginHorizontal: 10,
    fontSize: 16,
    color: '#333',
  },
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
  rightIconsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  iconWrapper: {
    marginLeft: 15,
  },
  badge: {
    position: 'absolute',
    right: -10,
    top: -5,
    backgroundColor: 'red',
    borderRadius: 10,
    width: 20,
    height: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  badgeText: {
    color: 'white',
    fontSize: 12,
  },
  addButton: {
    borderRadius: 30,
    paddingVertical:3,
    alignItems: 'center',
    paddingHorizontal:10,
    borderColor:'green',
    borderWidth:1,
    flexDirection:'row',
    justifyContent:'space-between'
    
  },
  addButtonText: {
    color: 'black',
    fontSize: 14,
    fontWeight: 'bold',
  },
});

export default AllProduct;
