import React, { useEffect, useState } from 'react';
import { View, Text, Image, StyleSheet, FlatList, TouchableOpacity, Alert, TextInput, Button } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { getCartProduct, placeOrder } from '../utils/config';
import Modal from 'react-native-modal';
import { useNavigation } from '@react-navigation/native';
import Header from './components/Header';
import Ionicons from 'react-native-vector-icons/Ionicons'; // Import Ionicons
import RazorpayCheckout from 'react-native-razorpay';

const Order = () => {
  const navigation = useNavigation();

  const [cartItems, setCartItems] = useState([]);
  const [totalAmount, setTotalAmount] = useState(0);
  const [allProduct, setAllProduct] = useState([]);


  // Modal states
  const [isModalVisible, setModalVisible] = useState(false);
  const [name, setName] = useState('');
  const [address, setAddress] = useState('');
  const [paymentMethod, setPaymentMethod] = useState('COD');
  const [deliveryNotes, setDeliveryNotes] = useState('');

  useEffect(() => {
    fetchCartItems();
  }, []);

  const fetchCartItems = async () => {
    try {
      const storedCartItems = await AsyncStorage.getItem('cartItems');
      if (storedCartItems) {
        const parsedItems = JSON.parse(storedCartItems);
        setCartItems(parsedItems);
        calculateTotal(parsedItems);
        fetchCartProducts(parsedItems);
      } else {
        setCartItems([]);
      }
    } catch (error) {
      Alert.alert('Error', 'Failed to load cart items');
    }
  };

  const fetchCartProducts = async (items) => {
    try {
      const productPromises = items.map(item => {
        return getCartProduct(item.product_id);
      });
      const responses = await Promise.all(productPromises);
      const fetchedProducts = responses.map(response => {
        if (response.status === 200) {
          return response.data;
        } else {
          console.error('Failed to fetch product:', response);
          return null;
        }
      }).filter(Boolean);

      setAllProduct(fetchedProducts);
    } catch (error) {
      Alert.alert('Error', 'Failed to fetch cart products');
    }
  };

  const calculateTotal = (items) => {
    const total = items.reduce((sum, item) => sum + (item.sell_price * item.quantity), 0);
    setTotalAmount(total.toFixed(2));
  };

  const removeFromCart = async (product_id) => {
    const updatedCart = cartItems.filter((item) => item.product_id !== product_id);
    await AsyncStorage.setItem('cartItems', JSON.stringify(updatedCart));
    setCartItems(updatedCart);
    calculateTotal(updatedCart);
  };

  const incrementQuantity = async (product_id) => {
    const updatedCart = cartItems.map(item => {
      if (item.product_id === product_id) {
        return { ...item, quantity: item.quantity + 1 };
      }
      return item;
    });
    await AsyncStorage.setItem('cartItems', JSON.stringify(updatedCart));
    setCartItems(updatedCart);
    calculateTotal(updatedCart);
  };

  const decrementQuantity = async (product_id) => {
    const updatedCart = cartItems.map(item => {
      if (item.product_id === product_id) {
        if (item.quantity > 1) {
          return { ...item, quantity: item.quantity - 1 };
        } else {
          removeFromCart(product_id);
          return item;
        }
      }
      return item;
    });
    if (updatedCart.length > 0) {
      await AsyncStorage.setItem('cartItems', JSON.stringify(updatedCart));
      setCartItems(updatedCart);
      calculateTotal(updatedCart);
    }
  };

  const handlePlaceOrder = async () => {
    if (!name || !address) {
      Alert.alert('Error', 'Please fill in all fields');
      return;
    }
    const location_id = await AsyncStorage.getItem('location_id');
    const phone_number = await AsyncStorage.getItem('phoneNumber');
    console.log('order location id',location_id)
    console.log('order phone_number',phone_number)
    const order = {
      location: location_id || 1,
      cartItems: cartItems.map(item => ({
        Product_name: item.Product_name,
        product_id: item.product_id,
        quantity: item.quantity,
        sell_price: item.sell_price,
        weight: item.weight,
      })),
      address: address,
      phone_number: phone_number || 9361879529,
      payment_method: paymentMethod,
      delivery_notes: deliveryNotes,
    };

    if(paymentMethod=='Online'){
      createOrder()
      return
    }

    console.log('order',order)

    try {
      const result = await placeOrder(order);
      console.log('order data',order)
      console.log('order response result',result)
      Alert.alert('Order Successful', result.data.message, [
        {
          text: 'OK',
          onPress: () => {
            setModalVisible(false);
            AsyncStorage.removeItem('cartItems');
            fetchCartItems();
          },
        },
      ]);
      navigation.navigate('Home');
    } catch (error) {
      Alert.alert('Order Error', error.message);
    }
  };
  

  const createOrder = async () => {
    // Define your Razorpay key here
    const razorpayKey = 'rzp_test_Cd1cVSHpocrBwT'; // Replace with your Razorpay key

    // Create an order on Razorpay
    const options = {
      key: razorpayKey,
      amount: totalAmount * 100, // Convert to paise
      currency: 'INR',
      name: 'Test Company',
      description: 'Test Order',
      prefill: {
        name: 'John Doe',
        email: 'john@example.com',
        contact: '9999999999',
      },
      theme: { color: '#1b18c7' },
    };

    RazorpayCheckout.open(options)
      .then((data) => {
        // Payment success handler
        console.log('Payment Success:', data);
        console.log(`Payment successful: ${data.razorpay_payment_id}`)
        Alert.alert('Success', `Payment successful: ${data.razorpay_payment_id}`);
      })
      .catch((error) => {
        // Payment failure handler
        console.error('Payment Error:', error);
        Alert.alert('Error', 'Payment failed!');
      });
  };


  const renderCartItem = ({ item }) => {
    const productDetail = allProduct.find(product => product.product_id === item.product_id);

    return (
      <View style={styles.card}>
        <Image
          source={{
            uri: item.Prodouct_img || 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTNNLEL-qmmLeFR1nxJuepFOgPYfnwHR56vcw&s',
          }}
          style={styles.image}
        />
        <View style={styles.details}>
          <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
            <View style={{width:'60%'}}>
              <Text style={styles.productName} numberOfLines={1}>{item.Product_name}</Text>
              <Text style={styles.productDetails}>Quantity: {item.quantity}</Text>
              <Text style={styles.productPrice}>Price: ₹{(item.sell_price * item.quantity).toFixed(2)}</Text>
            </View>

            <View style={{ flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
              <TouchableOpacity onPress={() => removeFromCart(item.product_id)}>
                <Ionicons name="trash-bin-outline" size={20} color="#FF0000" />
              </TouchableOpacity>

              <View style={styles.quantityContainer}>
              <TouchableOpacity style={styles.incrementButton} onPress={() => decrementQuantity(item.product_id)}>
                  <Text style={styles.incrementButtonText}>−</Text>
                </TouchableOpacity>
              
                <Text style={styles.productDetails}>{item.quantity}</Text>
                <TouchableOpacity style={styles.incrementButton} onPress={() => incrementQuantity(item.product_id)}>
                  <Text style={styles.incrementButtonText}>+</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </View>
        <View style={styles.divider} />
      </View>
    );
  };

  return (
    <View style={styles.container}>
             <Header leftIconName="home-outline" />
             
      <Text style={styles.heading}>Your Orders</Text>
      {cartItems.length === 0 ? (
        <>
        
        <Image source={require('../assets/cart.png')} style={{width:'90%',height:'50%',resizeMode:'contain'}} />
        <Text style={styles.emptyMessage}>Your cart is empty.</Text>
        <TouchableOpacity
  style={{
    width: '90%',
    backgroundColor: '#003d9d',
    position: 'absolute',
    margin: 10,
    bottom: 0,
    borderRadius: 10,
    alignSelf: 'center',
    justifyContent: 'center', // Center the content vertically
    alignItems: 'center', // Center the content horizontally
  }}
  onPress={()=>navigation.replace('Home')}
>
  <Text
    style={{
      fontSize: 16,
      fontWeight: '800',
      color: 'white',
      padding: 15,
      textAlign: 'center', // Center the text within the Text component
    }}
  >
    Add to Cart
  </Text>
</TouchableOpacity>

        </>
      ) : (
        <>
        <FlatList
          data={cartItems}
          renderItem={renderCartItem}
          keyExtractor={(item) => item.product_id}
          contentContainerStyle={{ paddingBottom: 100 }}
          showsVerticalScrollIndicator={false}
        />
   

      <View style={styles.bottomContainer}>
        <Text style={styles.totalText}>Total: ₹{totalAmount}</Text>
        <TouchableOpacity style={styles.orderNowButton} onPress={() => setModalVisible(true)}>
          <Text style={styles.orderNowText}>Order Now</Text>
        </TouchableOpacity>
      </View>
      </>
    )}

<Modal isVisible={isModalVisible} style={styles.modal}>
      <View style={styles.modalContent}>
        <Text style={styles.modalTitle}>Place Your Order</Text>
        <Text style={styles.paymentMethodTitle}>Payment Method</Text>
        
        <View style={styles.paymentMethodContainer}>
          <TouchableOpacity
            style={[styles.paymentButton, paymentMethod === 'COD' && styles.selectedPayment]}
            onPress={() => setPaymentMethod('COD')}
          >
            {paymentMethod === 'COD' &&  <Ionicons name="checkmark-circle-sharp" size={20} color="green" />}
            <Text style={styles.paymentText}>Cash on Delivery</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.paymentButton, paymentMethod === 'Online' && styles.selectedPayment]}
            onPress={() => setPaymentMethod('Online')}
          >
            {paymentMethod === 'Online' &&  <Ionicons name="checkmark-circle-sharp" size={20} color="green" />}
            <Text style={styles.paymentText}>Online Payment</Text>
          </TouchableOpacity>
        </View>

        <TextInput
          style={styles.input}
          placeholder="Your Name"
          value={name}
          onChangeText={setName}
          placeholderTextColor="#888"
        />
        <TextInput
          style={styles.input}
          placeholder="Your Address"
          value={address}
          onChangeText={setAddress}
          placeholderTextColor="#888"
        />
        <TextInput
          style={styles.input}
          placeholder="Delivery Notes"
          value={deliveryNotes}
          onChangeText={setDeliveryNotes}
          placeholderTextColor="#888"
        />
        
        <TouchableOpacity style={styles.modalButton} onPress={handlePlaceOrder}>
          <Text style={styles.modalButtonText}>Place Order</Text>
        </TouchableOpacity>
        
        <TouchableOpacity style={styles.closeModalButton} onPress={() => setModalVisible(false)}>
          <Text style={styles.closeModalButtonText}>Close</Text>
        </TouchableOpacity>
      </View>
    </Modal>

      {/* <Button title="Pay" onPress={createOrder} /> */}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  heading: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 20,
    color:'black',
    margin:10
  },
  emptyMessage: {
    textAlign: 'center',
    marginTop: 20,
    fontSize: 16,
    fontWeight:'800',
    color:'black'
  },
  bottomContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: 20,
    borderTopWidth: 1,
    borderTopColor: '#ccc',
    paddingTop: 16,
    padding:20
  },
  totalText: {
    fontSize: 18,
    fontWeight: '900',
    color:'black'
  },
  orderNowButton: {
    backgroundColor: '#003d9d',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 5,
  },
  orderNowText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  modal: {
    justifyContent: 'flex-end',
    margin: 0,
  },
  modalContent: {
    backgroundColor: '#ffffff',
    padding: 20,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    elevation: 10,
  },
  modalTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    color: '#333',
  },
  paymentMethodTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 10,
    color: '#333',
  },
  paymentMethodContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 15,
    
  },
  paymentButton: {
    flex: 1,
    padding: 15,
    backgroundColor: '#ecfdf5',
    borderRadius: 5,
    alignItems: 'center',
    marginHorizontal: 5,
  },
  selectedPayment: {
    backgroundColor: '#ecfdf5',
    borderWidth:1,
    borderColor:'green'
  },
  paymentText: {
    color: '#000',
    fontWeight: '500',
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
    padding: 10,
    marginBottom: 10,
    color: '#000',
  },
  modalButton: {
    backgroundColor: '#003d9d',
    padding: 15,
    borderRadius: 5,
    alignItems: 'center',
    marginBottom: 10,
  },
  modalButtonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
  },
  closeModalButton: {
    backgroundColor: '#ccc',
    padding: 15,
    borderRadius: 5,
    alignItems: 'center',
  },
  closeModalButtonText: {
    fontWeight: 'bold',
  },
  card: {
    backgroundColor: '#fff',
    marginBottom: 15,
    flexDirection:'row',
    alignItems:'center',
    borderBottomWidth:0.5,
    borderColor:'black',
    paddingHorizontal:10
  },
  image: {
    width: 100,
    height: 100,
    borderRadius: 5,
  },
  details: {
    flex: 1,
    marginLeft: 10,
  },
  productName: {
    fontSize: 16,
    fontWeight: 'bold',
    width:'70%',
    color:'black'
    
  },
  productDetails: {
    fontSize: 14,
    color:'black'
  },
  productPrice: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#FF6347',
  },
  quantityContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 10,
  },
  incrementButton: {
    backgroundColor: 'green',
    paddingHorizontal: 5,
    borderRadius: 5,
    marginHorizontal:5
  },
  incrementButtonText: {
    fontSize: 16,
    fontWeight: 'bold',
    color:'white'
  },
  divider: {
    height: 1,
    backgroundColor: '#ccc',
    marginVertical: 10,
  },
  title: {
    fontSize: 24,
    marginBottom: 20,
    textAlign: 'center',
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    padding: 10,
    marginBottom: 20,
    borderRadius: 5,
  },
});

export default Order;
