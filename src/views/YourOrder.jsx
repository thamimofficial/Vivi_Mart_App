import React, { useEffect, useState } from 'react';
import { View, Text, Image, FlatList, StyleSheet, ActivityIndicator, Animated, TouchableOpacity, SafeAreaView } from 'react-native';
import Header from './components/Header'; // Assuming you have a custom header component
import { getYourOrders } from '../utils/config'; // Your API call
import ExpandableLocationCard from './components/ExpandableLocationCard';
import Bottom from './bottom';

const YourOrder = () => {
  const [yourOrderData, setYourOrderData] = useState([]); // Define state for orders
  const [loading, setLoading] = useState(false); // To handle loading state
  const [errorMessage, setErrorMessage] = useState(''); // To handle error messages
  const skeletonOpacity = new Animated.Value(0.5); // Opacity for skeleton loading effect
  const [expandedOrders, setExpandedOrders] = useState({}); // State to track expanded orders

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
          setErrorMessage(response.data.error);
          console.log('response error YourOrders', response.data.error);
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
        source={{ uri: item.product_image_0 || 'https://ik.imagekit.io/efsdltq0e/icons/No_img.png?updatedAt=1727376099723' }}
        style={styles.productImage}
      />
      <View style={styles.itemDetails}>
        <Text style={styles.productName}>{item.Product_name}</Text>
        <Text style={styles.productInfo}>Quantity: {item.quantity}</Text>
        <Text style={styles.productInfo}>Price: ₹{item.sell_price}</Text>
      </View>
    </View>
  );

  // Toggle expanded state for specific order
  const toggleExpanded = (orderId) => {
    setExpandedOrders((prevState) => ({
      ...prevState,
      [orderId]: !prevState[orderId],
    }));
  };

  // Render the entire order, including address and other details
  const renderOrder = ({ item }) => {
    const isExpanded = expandedOrders[item.order_id] || false;

    return (
      <View style={styles.orderContainer}>
        {/* Always visible */}
        <Text style={styles.orderInfo}>User ID: {item.user_id}</Text>
        <Text style={styles.orderInfo}>Order ID: {item.order_id}</Text>

        {/* View More Button */}
        <TouchableOpacity onPress={() => toggleExpanded(item.order_id)}>
          <Text style={styles.viewMoreText}>{isExpanded ? 'View Less' : 'View More'}</Text>
        </TouchableOpacity>

        {/* Expanded Details */}
        {isExpanded && (
          <>
            <Text style={styles.orderInfo}>Total Price: ₹{item.total_price}</Text>
            <Text style={styles.orderInfo}>Payment Method: {item.payment_method}</Text>
            <Text style={styles.orderInfo}>Delivery Address: {item.address}</Text>
            <Text style={styles.orderInfo}>Order Date: {new Date(item.order_date).toLocaleDateString()}</Text>

            <FlatList
              data={item.order_items}
              renderItem={renderOrderItems}
              keyExtractor={(product, index) => index.toString()} // Using index as key for order items
            />
          </>
        )}
      </View>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
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
      <View style={styles.bottomContainer}>
        <Bottom activeIcon="Orders" />
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  orderContainer: {
    backgroundColor: '#fff',
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
    backgroundColor: '#fff',
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
  viewMoreText: {
    color: '#007bff',
    fontWeight: 'bold',
    marginVertical: 5,
  },
  flatlistContainer: {
    paddingBottom: 100, // Ensure space for the bottom navigation
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
  bottomContainer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
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
