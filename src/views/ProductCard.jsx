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
    //  console.log('clicked product',product)
      navigation.navigate('SingleProduct', { product });
    };

    return (
      <TouchableOpacity style={styles.card} onPress={handleProductPress}>
        <Text style={styles.productOffer}>{`${product.offer} % OFF`}</Text>
        <Image source={{ uri: product.Prodouct_img_0  ||'https://ik.imagekit.io/efsdltq0e/icons/No_img.png?updatedAt=1727376099723'}} style={styles.image} />
        <View style={styles.details}>
         <Image source={{uri : 'data:image/png;base64,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'}}
         height={15} width={15}/>
          <Text style={{color:'gray'}}>{product.Brand_name}</Text>
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
    textDecorationLine:'line-through'
  },
  productPrice: {
    fontSize: 12,
    color: 'black',
    marginBottom: 2,
    fontWeight:'600'
  },
  productOffer: {
    fontSize: 10,
    marginBottom: 5,
    backgroundColor: "#ffff33",
    color: 'black',
    fontWeight: '700',
    position: 'absolute',
    zIndex: 1,
    borderRadius: 10,
    padding: 3,
    margin: 2,
    paddingHorizontal:10
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
