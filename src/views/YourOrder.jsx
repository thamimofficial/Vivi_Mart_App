import React from 'react';
import { View, Text, Image, FlatList, StyleSheet, ScrollView } from 'react-native';
import Header from './components/Header';
import ExpandableLocationCard from './components/ExpandableLocationCard';

const dummyData = [
    {
      "order_id": 25,
      "user_id": 2147483647,
      "product_id": 0,
      "quantity": 0,
      "total_price": "1125.00",
      "store_id": "AMB197901",
      "location_id": 5,
      "razorpay_order_id": "order_P3ebiTLWiwe0Q4",
      "order_date": "2024-10-01T05:13:10.000Z",
      "address": "123 Main Street, Coimabatore, 600035",
      "phone_number": "+919361879529",
      "delivery_notes": "Leave at the front door.",
      "status": "New",
      "payment_method": "COD",
      "payment_status": "Pending",
      "Product_name": "Apple Royal Gala",
      "item_quantity": 2,
      "item_sell_price": "225.00",
      "item_product_id": 1111,
      "item_weight": "1.00",
      "item_product_image_0": "https://ik.imagekit.io/efsdltq0e/product_images/Products/1_1_1_1 Apple Royal Gala.png",
      "item_category": "Fruits & Vegetables",
      "item_status": "New",
      "order_items": [
        {
          "Product_name": "Apple Royal Gala",
          "quantity": 2,
          "sell_price": "225.00",
          "product_id": 1111,
          "weight": "1.00",
          "product_image_0": "https://ik.imagekit.io/efsdltq0e/product_images/Products/1_1_1_1 Apple Royal Gala.png",
          "category": "Fruits & Vegetables",
          "status": "New"
        },
        {
          "Product_name": "Apple Shimla",
          "quantity": 1,
          "sell_price": "225.00",
          "product_id": 1112,
          "weight": "1.00",
          "product_image_0": "https://ik.imagekit.io/efsdltq0e/product_images/Products/1_1_1_2 Apple Shimla.png",
          "category": "Fruits & Vegetables",
          "status": "New"
        },
        {
          "Product_name": "Apple Washington",
          "quantity": 1,
          "sell_price": "225.00",
          "product_id": 1113,
          "weight": "1.00",
          "product_image_0": "https://ik.imagekit.io/efsdltq0e/product_images/Products/1_1_1_3 Apple Washington.png",
          "category": "Fruits & Vegetables",
          "status": "New"
        },
        {
          "Product_name": "Pear Green",
          "quantity": 1,
          "sell_price": "225.00",
          "product_id": 1114,
          "weight": "1.00",
          "product_image_0": "https://ik.imagekit.io/efsdltq0e/product_images/Products/1_1_1_4 Pear Green.png",
          "category": "Fruits & Vegetables",
          "status": "New"
        }
      ]
    },
    {
      "order_id": 49,
      "user_id": 2147483647,
      "product_id": 0,
      "quantity": 0,
      "total_price": "1380.00",
      "store_id": "ADM001",
      "location_id": 1,
      "razorpay_order_id": "order_P6SVUtNjFQyZ86",
      "order_date": "2024-10-08T07:19:58.000Z",
      "address": "hgghhg",
      "phone_number": "+919361879529",
      "delivery_notes": "notes",
      "status": "New",
      "payment_method": "COD",
      "payment_status": "Pending",
      "Product_name": "Apple Royal Gala",
      "item_quantity": 1,
      "item_sell_price": "240.00",
      "item_product_id": 1111,
      "item_weight": "1.00",
      "item_product_image_0": "https://ik.imagekit.io/efsdltq0e/product_images/Products/1_1_1_1 Apple Royal Gala.png",
      "item_category": "Fruits & Vegetables",
      "item_status": "New",
      "order_items": [
        {
          "Product_name": "Apple Royal Gala",
          "quantity": 1,
          "sell_price": "240.00",
          "product_id": 1111,
          "weight": "1.00",
          "product_image_0": "https://ik.imagekit.io/efsdltq0e/product_images/Products/1_1_1_1 Apple Royal Gala.png",
          "category": "Fruits & Vegetables",
          "status": "New"
        },
        {
          "Product_name": "Apple Washington",
          "quantity": 1,
          "sell_price": "225.00",
          "product_id": 1113,
          "weight": "1.00",
          "product_image_0": "https://ik.imagekit.io/efsdltq0e/product_images/Products/1_1_1_3 Apple Washington.png",
          "category": "Fruits & Vegetables",
          "status": "New"
        },
        {
          "Product_name": "Apple Red Delicious Importe",
          "quantity": 1,
          "sell_price": "225.00",
          "product_id": 1115,
          "weight": "1.00",
          "product_image_0": "https://ik.imagekit.io/efsdltq0e/product_images/Products/1_1_1_5 Apple Red Delicious Imported.png",
          "category": "Fruits & Vegetables",
          "status": "New"
        },
        {
          "Product_name": "Apple Fuji",
          "quantity": 1,
          "sell_price": "225.00",
          "product_id": 1116,
          "weight": "1.00",
          "product_image_0": "https://ik.imagekit.io/efsdltq0e/product_images/Products/1_1_1_6  Apple Fuji.png",
          "category": "Fruits & Vegetables",
          "status": "New"
        },
        {
          "Product_name": "Pear Green",
          "quantity": 1,
          "sell_price": "225.00",
          "product_id": 1114,
          "weight": "1.00",
          "product_image_0": "https://ik.imagekit.io/efsdltq0e/product_images/Products/1_1_1_4 Pear Green.png",
          "category": "Fruits & Vegetables",
          "status": "New"
        },
        {
          "Product_name": "Apple Shimla",
          "quantity": 1,
          "sell_price": "240.00",
          "product_id": 1112,
          "weight": "1.00",
          "product_image_0": "https://ik.imagekit.io/efsdltq0e/product_images/Products/1_1_1_2 Apple Shimla.png",
          "category": "Fruits & Vegetables",
          "status": "New"
        }
      ]
    },
    {
      "order_id": 55,
      "user_id": 2147483647,
      "product_id": 0,
      "quantity": 0,
      "total_price": "1365.00",
      "store_id": "ADM001",
      "location_id": 1,
      "razorpay_order_id": "order_P6VQj5SsNAE4qV",
      "order_date": "2024-10-08T10:11:32.000Z",
      "address": "hh",
      "phone_number": "+919361879529",
      "delivery_notes": "hh",
      "status": "New",
      "payment_method": "COD",
      "payment_status": "Pending",
      "Product_name": "Apple Royal Gala",
      "item_quantity": 1,
      "item_sell_price": "240.00",
      "item_product_id": 1111,
      "item_weight": "1.00",
      "item_product_image_0": "https://ik.imagekit.io/efsdltq0e/product_images/Products/1_1_1_1 Apple Royal Gala.png",
      "item_category": "Fruits & Vegetables",
      "item_status": "New",
      "order_items": [
        {
          "Product_name": "Apple Royal Gala",
          "quantity": 1,
          "sell_price": "240.00",
          "product_id": 1111,
          "weight": "1.00",
          "product_image_0": "https://ik.imagekit.io/efsdltq0e/product_images/Products/1_1_1_1 Apple Royal Gala.png",
          "category": "Fruits & Vegetables",
          "status": "New"
        },
        {
          "Product_name": "Apple Washington",
          "quantity": 1,
          "sell_price": "225.00",
          "product_id": 1113,
          "weight": "1.00",
          "product_image_0": "https://ik.imagekit.io/efsdltq0e/product_images/Products/1_1_1_3 Apple Washington.png",
          "category": "Fruits & Vegetables",
          "status": "New"
        },
        {
          "Product_name": "Apple Red Delicious Importe",
          "quantity": 1,
          "sell_price": "225.00",
          "product_id": 1115,
          "weight": "1.00",
          "product_image_0": "https://ik.imagekit.io/efsdltq0e/product_images/Products/1_1_1_5 Apple Red Delicious Imported.png",
          "category": "Fruits & Vegetables",
          "status": "New"
        },
        {
          "Product_name": "Pink Lady Apple",
          "quantity": 1,
          "sell_price": "225.00",
          "product_id": 1119,
          "weight": "1.00",
          "product_image_0": "https://ik.imagekit.io/efsdltq0e/product_images/Products/1_1_1_9 Pink Lady Apple.png",
          "category": "Fruits & Vegetables",
          "status": "New"
        },
        {
          "Product_name": "Mango Banganpalle",
          "quantity": 1,
          "sell_price": "225.00",
          "product_id": 1161,
          "weight": "1.00",
          "product_image_0": "https://ik.imagekit.io/efsdltq0e/product_images/Products/1_1_6_1 Mango Banganpalle.png",
          "category": "Fruits & Vegetables",
          "status": "New"
        },
        {
          "Product_name": "Raw Mango",
          "quantity": 1,
          "sell_price": "225.00",
          "product_id": 1163,
          "weight": "1.00",
          "product_image_0": "https://ik.imagekit.io/efsdltq0e/product_images/Products/1_1_6_3 Raw Mango.png",
          "category": "Fruits & Vegetables",
          "status": "New"
        }
      ]
    }
  ];

const YourOrder = () => {
  const renderOrderItem = ({ item }) => (
    <View style={styles.orderItemContainer}>
      <Image source={{ uri: item.product_image_0 }} style={styles.productImage} />
      <View style={styles.itemDetails}>
        <Text style={styles.productName}>{item.Product_name}</Text>
        <Text style={styles.productInfo}>Quantity: {item.quantity}</Text>
        <Text style={styles.productInfo}>Price: ₹{item.sell_price}</Text>
        <Text style={styles.productInfo}>Weight: {item.weight} Kg</Text>
        <Text style={styles.productInfo}>Category: {item.category}</Text>
        <Text style={styles.productStatus}>Status: {item.status}</Text>
      </View>
    </View>
  );

  const renderOrder = ({ item }) => (
    <View style={styles.orderContainer}>
      <View style={styles.orderHeader}>
        <Text style={styles.orderId}>Order ID: {item.order_id}</Text>
        <Text style={styles.orderDate}>Date: {new Date(item.order_date).toLocaleDateString()}</Text>
        <Text style={styles.totalPrice}>Total Price: ₹{item.total_price}</Text>
        <Text style={styles.status}>Status: {item.status}</Text>
      </View>
      <FlatList
        data={item.order_items}
        renderItem={renderOrderItem}
        keyExtractor={(orderItem) => orderItem.product_id.toString()}
        ItemSeparatorComponent={() => <View style={styles.separator} />}
      />
      <View style={styles.deliveryInfo}>
        <Text style={styles.deliveryText}>Delivery Address: {item.address}</Text>
        <Text style={styles.deliveryText}>Phone: {item.phone_number}</Text>
        <Text style={styles.deliveryText}>Delivery Notes: {item.delivery_notes}</Text>
      </View>
    </View>
  );

  return (
    <>
    <ExpandableLocationCard />
    <Header />
    <ScrollView style={styles.container}>
      <FlatList
        data={dummyData}
        renderItem={renderOrder}
        keyExtractor={(order) => order.order_id.toString()}
        contentContainerStyle={styles.listContainer}
      />
    </ScrollView>
    </>
  );
};


const styles = StyleSheet.create({
    scrollContainer: {
      padding: 10,
    },
    orderContainer: {
      marginBottom: 20,
      backgroundColor: '#fff',
      padding: 15,
      borderRadius: 8,
      elevation: 2,
    },
    orderHeader: {
      marginBottom: 10,
    },
    orderId: {
      fontSize: 18,
      fontWeight: 'bold',
      color: '#333',
    },
    orderDate: {
      fontSize: 14,
      color: '#666',
    },
    totalPrice: {
      fontSize: 16,
      fontWeight: 'bold',
      color: '#4CAF50',
    },
    status: {
      fontSize: 14,
      color: '#FF9800',
      marginTop: 5,
    },
    deliveryNotes: {
      fontSize: 14,
      color: '#999',
      marginTop: 5,
    },
    orderItemsList: {
      marginTop: 10,
    },
    orderItemContainer: {
      flexDirection: 'row',
      marginBottom: 15,
      borderBottomWidth: 0.5,
      borderBottomColor: '#ddd',
      paddingBottom: 10,
    },
    productImage: {
      width: 100,
      height: 100,
      borderRadius: 8,
      marginRight: 15,
      resizeMode: 'contain',
    },
    itemDetails: {
      flex: 1,
    },
    productName: {
      fontSize: 16,
      fontWeight: 'bold',
      color: '#333',
    },
    productInfo: {
      fontSize: 14,
      color: '#666',
      marginTop: 5,
    },
    productStatus: {
      fontSize: 14,
      color: '#FF9800',
      marginTop: 5,
    },
  });
  
  export default YourOrder;