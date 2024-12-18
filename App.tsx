import React, { useEffect } from 'react';
import { StatusBar } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import Home from './src/views/Home'; // Adjust the path as needed
import ProductCard from './src/views/ProductCard';
import SingleProduct from './src/views/SingleProduct';
import Order from './src/views/Order';
import GooglePlacesAutocomplete from './src/views/AddressSearch';
import AllProduct from './src/views/AllProduct';
import SplashScreen from './src/views/authentication/SplashScreen';
import MapScreen from './src/views/Mapviews';
import PhoneSignIn from './src/views/authentication/PhoneSignIn';
import YourOrder from './src/views/YourOrder';
import Profile from './src/views/Profile';
import AddAddress from './src/views/AddAddress';
// import RazorpayPayment from './src/views/razorpaylink';

const Stack = createNativeStackNavigator();

export default function App() {

  
  return (
    <SafeAreaProvider>
      <NavigationContainer>
        <StatusBar barStyle="light-content" backgroundColor="#1f45fc" />
        <Stack.Navigator initialRouteName="Home">
          <Stack.Screen name="SplashScreen" component={SplashScreen} options={{headerShown: false}} />
          <Stack.Screen name="PhoneSignIn" component={PhoneSignIn} options={{headerShown: false}} />
          <Stack.Screen name="Home" component={Home} options={{headerShown: false}} />
          <Stack.Screen name="ProductCard" component={ProductCard} options={{headerShown: false}} />
          <Stack.Screen name="SingleProduct" component={SingleProduct} options={{headerShown: false}} />
          <Stack.Screen name="Order" component={Order} options={{headerShown: false}} />
          <Stack.Screen name="GooglePlacesAutocomplete" component={GooglePlacesAutocomplete} options={{headerShown: false}} />
          <Stack.Screen name="AllProduct" component={AllProduct} options={{headerShown: false}} />
          <Stack.Screen name="MapScreen" component={MapScreen} options={{headerShown: false}} />
          <Stack.Screen name="YourOrder" component={YourOrder} options={{headerShown: false}} />
          
          <Stack.Screen name="Profile" component={Profile} options={{headerShown: false}} />
          <Stack.Screen name="AddAddress" component={AddAddress} options={{headerShown: false}} />
          

          {/* Add other screens here */}
        </Stack.Navigator>
      </NavigationContainer>
    </SafeAreaProvider>
  );
}



