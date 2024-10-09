import React, { useState, useEffect } from 'react';
import { View, Text, Image, StyleSheet, Dimensions, TouchableOpacity, FlatList, ActivityIndicator, Alert, ScrollView } from 'react-native';
import { getSubSubCategoriesProduct, getSubSubCategories } from '../utils/config';
import { useNavigation, useRoute } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Ionicons from 'react-native-vector-icons/Ionicons'; // Importing Ionicons

import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons'; // Importing Ionicons
import Header from './components/Header';
import ExpandableLocationCard from './components/ExpandableLocationCard';

const { width } = Dimensions.get('window');

const ProductCard = () => {
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [products, setProducts] = useState([]);
  const [sidebarData, setSidebarData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const navigation = useNavigation();
  const route = useRoute();
  const { productDetails } = route.params;

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const { status, data } = await getSubSubCategories(productDetails.sub_category_name);
        if (status === 200 && data.length > 0) {
          setSidebarData(data);
          setSelectedCategory(data[0]); // Automatically select the first category
          fetchProducts(data[0]); // Fetch products for the first category
        } else if (status === 200 && data.length === 0) {
          setError('No categories available');
        } else {
          throw new Error('Failed to fetch sub-sub-categories');
        }
      } catch (error) {
        setError(error.message);
        Alert.alert('Error', error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchCategories();
  }, []);

  const fetchProducts = async (category) => {
    setLoading(true);
    try {
      const response = await getSubSubCategoriesProduct(category.sub_sub_category_name);
      if (response.status === 200) {
        setProducts(response.data); // Assuming response.data contains the product list
      }
    } catch (error) {
      console.error('Failed to fetch products:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleCategorySelect = (category) => {
    setSelectedCategory(category);
    fetchProducts(category);
  };

  const incrementQuantity = async (product, quantity, setQuantity) => {
    try {
      const updatedQuantity = quantity + 1;
      setQuantity(updatedQuantity);
      const cartItems = await AsyncStorage.getItem('cartItems');
      let updatedCart = cartItems ? JSON.parse(cartItems) : [];

      const productIndex = updatedCart.findIndex(item => item.product_id === product.Product_id);
      if (productIndex !== -1) {
        updatedCart[productIndex].quantity = updatedQuantity;
      } else {
        updatedCart.push({
          
          Product_name :product.Product_name,
          Prodouct_img :product.Prodouct_img_0,
          product_id: product.Product_id,
          quantity: updatedQuantity,
          sell_price: product.sell_price,
          weight: 1.0,
          delivery_option:product.delivery_option
        });
      }
      await AsyncStorage.setItem('cartItems', JSON.stringify(updatedCart));
    } catch (error) {
      Alert.alert('Error', 'Failed to update cart items');
    }
  };

  const decrementQuantity = async (product, quantity, setQuantity) => {
    if (quantity > 0) {
      const updatedQuantity = quantity - 1;
      setQuantity(updatedQuantity);
      const cartItems = await AsyncStorage.getItem('cartItems');
      let updatedCart = cartItems ? JSON.parse(cartItems) : [];

      const productIndex = updatedCart.findIndex(item => item.product_id === product.Product_id);
      if (productIndex !== -1) {
        if (updatedQuantity === 0) {
          updatedCart = updatedCart.filter(item => item.product_id !== product.Product_id);
        } else {
          updatedCart[productIndex].quantity = updatedQuantity;
        }
      }
      await AsyncStorage.setItem('cartItems', JSON.stringify(updatedCart));
    }
  };

  const SubProduct = () => {
    if (loading) {
      return <SkeletonLoader />;
    }

    return (
      <View style={styles.subProductContainer}>
        {products.map((product) => (
          <ProductItem key={product.Product_id} product={product} />
        ))}
      </View>
    );
  };

  const ProductItem = ({ product }) => {
    const [quantity, setQuantity] = useState(0);

    const handleProductPress = () => {
      console.log('clicked product',product)
      navigation.navigate('SingleProduct', { product });
    };

    return (
      <TouchableOpacity style={styles.card} onPress={handleProductPress}>
        <Text style={styles.productOffer}>{`₹${product.offer}`}</Text>
        <Image source={{ uri: product.Prodouct_img_0  ||'https://ik.imagekit.io/efsdltq0e/icons/No_img.png?updatedAt=1727376099723'}} style={styles.image} />
        <View style={styles.details}>
          <Text style={styles.brandName}>{product.Brand_name}</Text>
          <Text style={styles.productName} numberOfLines={1}>{product.Product_name}</Text>

<View style={{flexDirection:'row',alignItems:'center',justifyContent:"space-between"}}>
       <View>
          <Text style={styles.productPrice}>₹{product.sell_price}</Text>
          <Text style={styles.oldPrice}>₹{product.MRP}</Text>
        </View>
          <View>
          {quantity === 0 ? (
            <TouchableOpacity style={styles.addButton} onPress={() => incrementQuantity(product, quantity, setQuantity)}>
              <Text style={styles.addButtonText}>Add</Text>
              <Ionicons name="add" size={20} color="#fff" style={{fontSize:18,color:'black', fontWeight:'bold',paddingLeft:10}} />
            </TouchableOpacity>
          ) : (
            <View style={styles.quantityContainer}>
              <TouchableOpacity onPress={() => decrementQuantity(product, quantity, setQuantity)} style={styles.quantityButton}>
                {/* <Text >-</Text> */}
                <Ionicons style={styles.quantityButtonText} name="remove-outline" size={24} color="#fff" />
              </TouchableOpacity>
              <Text style={styles.quantityText}>{quantity}</Text>
              <TouchableOpacity onPress={() => incrementQuantity(product, quantity, setQuantity)} style={styles.quantityButton}>
                {/* <Text style={styles.quantityButtonText}>+</Text> */}
                <Ionicons style={styles.quantityButtonText} name="add-outline" size={24} color="#fff" />
              </TouchableOpacity>
            </View>
          )}
          </View>
</View>




          
        
        </View>
        <View style={{flexDirection:'row',alignItems:'center',justifyContent:'space-evenly',backgroundColor:'#fecaca',paddingVertical:2}}>
        <MaterialCommunityIcons name="bike-fast" size={20} color="#fff" style={{fontSize:18,color:'black', fontWeight:'bold',paddingLeft:10}} />
           <Text style={styles.deliveryOption}>{product.delivery_option}</Text>
        </View>
       
      </TouchableOpacity>
    );
  };

  const SkeletonLoader = () => (
    <View style={styles.skeletonContainer}>
      {Array.from({ length: 4 }).map((_, index) => (
        <View key={index} style={styles.skeletonCard}>
          <View style={styles.skeletonImage} />
          <View style={styles.skeletonText} />
          <View style={styles.skeletonText} />
        </View>
      ))}
    </View>
  );

  const renderSidebarItem = ({ item }) => (
    <TouchableOpacity
      style={[
        styles.imageContainer,
        selectedCategory?.sub_sub_category_id === item.sub_sub_category_id && styles.selectedImage,
      ]}
      onPress={() => handleCategorySelect(item)}
    >
      <Image source={{ uri: item.sub_sub_category_img }} style={styles.imageSide} resizeMode="contain" />
      <Text style={styles.categoryName} numberOfLines={2}>{item.sub_sub_category_name}</Text>
    </TouchableOpacity>
  );

  const renderSidebar = () => (
    <FlatList
      data={sidebarData}
      renderItem={renderSidebarItem}
      keyExtractor={(item) => item.sub_sub_category_id.toString()}
      showsVerticalScrollIndicator={false}
    />
  );

  return (
    <View style={styles.container}>
       <ExpandableLocationCard showBackButton={true} />
       <Header  />

      <View style={styles.mainContent}>
        <View style={styles.sidebar}>{renderSidebar()}</View>
        <ScrollView style={styles.scrollView}>
          <SubProduct />
        </ScrollView>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  mainContent: {
    flexDirection: 'row',
    flex: 1,
  },
  scrollView: {
    flex: 1,
  },
  sidebar: {
    width: '15%',
    backgroundColor: '#fff',
    justifyContent: 'flex-start',
    paddingVertical: 15,
    borderRightWidth: 1,
    borderColor: '#ddd',
  },
  imageContainer: {
    width: '100%',
    height: 80,
    marginBottom: 0,
    borderRadius: 10,
    overflow: 'hidden',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 3,
    borderColor: 'transparent',
  },
  selectedImage: {
    borderColor: '#007bff',
  },
  imageSide: {
    width: '70%',
    height: '70%',
    borderRadius: 35,
    resizeMode: 'contain',
  },
  categoryName: {
    marginTop: 0,
    marginBottom:5,
    fontSize: 10,
    textAlign: 'center',
    color:'black',
    fontWeight:'700'
  },
  subProductContainer: {
    flex: 1,
    paddingVertical: 10,
    backgroundColor: '#fff',
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 2,
    marginBottom: 15,
    overflow: 'hidden',
    width: '48%',
    marginHorizontal: '1%',
  },
  image: {
    width: '100%',
    height: 120,
    resizeMode: 'contain',
  },
  details: {
    padding: 10,
  },
  productName: {
    fontSize: 14,
    fontWeight: 'bold',
    marginBottom: 2,
    color:'black'
  },
  oldPrice:{
    fontSize: 10,
    color: 'gray',
    fontWeight:'500',
    marginBottom: 2,
  },
  productPrice: {
    fontSize: 12,
    color: 'black',
    marginBottom: 2,
    fontWeight:'600'
  },
  productOffer: {
    fontSize: 10,
    color: '#dc3545',
    marginBottom: 5,
    backgroundColor: "green",
    color: 'white',
    fontWeight: '700',
    position: 'absolute',
    zIndex: 1,
    borderRadius: 5,
    padding: 3,
    margin: 2,
  },
  deliveryOption: {
    fontSize: 10,
    color: 'black',
    backgroundColor: '#fecaca',
    paddingHorizontal: 10,
    paddingVertical: 3,
    fontWeight:'900'
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
  quantityContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  quantityButton: {
    backgroundColor: '#318616',
    paddingVertical: 3,
    paddingHorizontal: 10,
    borderRadius: 5,
  },
  quantityButtonText: {
    color: '#fff',
    fontSize: 10,
    fontWeight: 'bold',
  },
  quantityText: {
    marginHorizontal: 10,
    fontSize: 14,
    fontWeight: 'bold',
    color:'#000'
  },
  skeletonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    flexWrap: 'wrap',
  },
  skeletonCard: {
    backgroundColor: '#f0f0f0',
    borderRadius: 8,
    marginBottom: 15,
    width: '48%',
    height: 200,
  },
  skeletonImage: {
    backgroundColor: '#ddd',
    height: 120,
    borderTopLeftRadius: 8,
    borderTopRightRadius: 8,
  },
  skeletonText: {
    backgroundColor: '#ddd',
    height: 10,
    margin: 10,
    borderRadius: 5,
  },
});
export default ProductCard;
