import React, { useEffect, useState } from 'react';
import { View, Text, Image, FlatList, StyleSheet, ActivityIndicator, Animated } from 'react-native';
import Header from './components/Header'; // Assuming you have a custom header component
import { getYourOrders } from '../utils/config'; // Your API call
import ExpandableLocationCard from './components/ExpandableLocationCard';

const YourOrder = () => {
  const [yourOrderData, setYourOrderData] = useState([]); // Define state for orders
  const [loading, setLoading] = useState(false); // To handle loading state
  const [errorMessage, setErrorMessage] = useState(''); // To handle error messages

  const skeletonOpacity = new Animated.Value(0.5); // Opacity for skeleton loading effect

  // Fetch the orders using useEffect
  useEffect(() => {
    const fetchOrders = async () => {
      setLoading(true);
      setErrorMessage(''); // Reset error message before fetching
      try {
        const response = await getYourOrders('+919361879529'); // Fetching the orders
        if (response.status === 200) {
          setYourOrderData(response.data); // Assuming response.data contains the order list
          console.log('Your Orders', response.data);
        } else if (response.status === 404 || response.status === 400 || response.status === 401) {
          setErrorMessage('No orders found.');
        }
      } catch (error) {
        console.error('Failed to fetch orders:', error);
        setErrorMessage('Failed to fetch orders. Please try again.');
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, []);

  // Start skeleton animation
  useEffect(() => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(skeletonOpacity, {
          toValue: 1,
          duration: 500,
          useNativeDriver: true,
        }),
        Animated.timing(skeletonOpacity, {
          toValue: 0.5,
          duration: 500,
          useNativeDriver: true,
        }),
      ])
    ).start();
  }, []);

  // Skeleton loader component
  const SkeletonLoader = () => (
    <View style={styles.skeletonContainer}>
      {[1, 2, 3, 4].map((_, index) => (
        <View key={index} style={styles.skeletonItem}>
          <Animated.View style={[styles.skeletonImage, { opacity: skeletonOpacity }]} />
          <View style={styles.skeletonDetails}>
            <Animated.View style={[styles.skeletonLine, { width: '60%', opacity: skeletonOpacity }]} />
            <Animated.View style={[styles.skeletonLine, { width: '80%', opacity: skeletonOpacity }]} />
            <Animated.View style={[styles.skeletonLine, { width: '40%', opacity: skeletonOpacity }]} />
          </View>
        </View>
      ))}
    </View>
  );

  // Render each order item (list of products for each order)
  const renderOrderItems = ({ item }) => (
    <View style={styles.orderItemContainer}>
      <Image 
        source={{ uri: item.item_product_image_0 || 'https://ik.imagekit.io/efsdltq0e/icons/No_img.png?updatedAt=1727376099723' }} 
        style={styles.productImage} 
      />
      <View style={styles.itemDetails}>
        <Text style={styles.productName}>{item.Product_name}</Text>
        <Text style={styles.productInfo}>Quantity: {item.item_quantity}</Text>
        <Text style={styles.productInfo}>Price: ₹{item.item_sell_price}</Text>
        <Text style={styles.productInfo}>Weight: {item.item_weight} kg</Text>
      </View>
    </View>
  );

  // Render the entire order, including address and other details
  const renderOrder = ({ item }) => (
    <View style={styles.orderContainer}>
      <Text style={styles.orderInfo}>Order ID: {item.order_id}</Text>
      <Text style={styles.orderInfo}>Total Price: ₹{item.total_price}</Text>
      <Text style={styles.orderInfo}>Payment Method: {item.payment_method}</Text>
      <Text style={styles.orderInfo}>Delivery Address: {item.address}</Text>
      <Text style={styles.orderInfo}>Order Date: {new Date(item.order_date).toLocaleDateString()}</Text>

      <FlatList
        data={item.order_items}
        renderItem={renderOrderItems}
        keyExtractor={(product, index) => index.toString()} // Using index as key for order items
      />
    </View>
  );

  return (
    <View style={{ flex: 1 }}>
      <ExpandableLocationCard showBackButton={true} />
      <Header title="Your Orders" />
      {loading ? (
        <SkeletonLoader />
      ) : errorMessage ? (
        <Text style={styles.errorMessage}>{errorMessage}</Text>
      ) : yourOrderData.length > 0 ? (
        <FlatList
          data={yourOrderData}
          renderItem={renderOrder}
          keyExtractor={(item) => item.order_id.toString()}
          contentContainerStyle={styles.flatlistContainer} // Styling for the FlatList container
        />
      ) : (
        <Text style={styles.emptyText}>No orders found.</Text>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  orderContainer: {
    backgroundColor: '#f8f8f8',
    margin: 10,
    padding: 10,
    borderRadius: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 3,
    elevation: 5,
  },
  orderItemContainer: {
    flexDirection: 'row',
    marginVertical: 10,
  },
  productImage: {
    width: 80,
    height: 80,
    resizeMode: 'contain',
    marginRight: 10,
  },
  itemDetails: {
    flex: 1,
  },
  productName: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  productInfo: {
    fontSize: 14,
    color: '#555',
  },
  orderInfo: {
    fontSize: 14,
    marginVertical: 2,
  },
  loading: {
    marginTop: 20,
  },
  flatlistContainer: {
    paddingBottom: 20, // Ensure proper spacing at the bottom
  },
  emptyText: {
    textAlign: 'center',
    marginTop: 20,
    fontSize: 16,
  },
  errorMessage: {
    textAlign: 'center',
    marginTop: 20,
    fontSize: 16,
    color: 'red',
  },
  // Skeleton loader styles
  skeletonContainer: {
    padding: 20,
  },
  skeletonItem: {
    flexDirection: 'row',
    marginVertical: 10,
    alignItems: 'center',
  },
  skeletonImage: {
    width: 80,
    height: 80,
    backgroundColor: '#E0E0E0',
    borderRadius: 8,
    marginRight: 10,
  },
  skeletonDetails: {
    flex: 1,
  },
  skeletonLine: {
    height: 20,
    backgroundColor: '#E0E0E0',
    borderRadius: 4,
    marginVertical: 5,
  },
});

export default YourOrder;
