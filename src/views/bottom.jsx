import { useNavigation } from '@react-navigation/native';
import React, { useState, useEffect, useRef } from 'react';
import { View, TouchableOpacity, Text, StyleSheet, Animated } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';

const Bottom = ({ activeIcon }) => {
  const [activeTab, setActiveTab] = useState(activeIcon);
  const navigation = useNavigation();

  // Refs for animated values for scaling
  const scaleAnim = useRef({
    Home: new Animated.Value(1),
    Orders: new Animated.Value(1),
    Profile: new Animated.Value(1),
  }).current;

  const handlePress = (tabName) => {
    setActiveTab(tabName);
    animateIcon(tabName);
  };

  const animateIcon = (tabName) => {
    // Reset animations for all tabs
    Object.keys(scaleAnim).forEach((tab) => {
      Animated.timing(scaleAnim[tab], {
        toValue: tab === tabName ? 1.2 : 1,
        duration: 200,
        useNativeDriver: true,
      }).start();
    });
  };

  useEffect(() => {
    animateIcon(activeIcon);
  }, []);

  const getIconColor = (tab) => {
    return activeTab === tab ? '#003d9d' : '#000';
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity style={styles.iconContainer} onPress={() => { handlePress('Home'); navigation.replace('Home'); }}>
        <Animated.View style={{ transform: [{ scale: scaleAnim.Home }] }}>
          <Icon
            name="home"
            size={25}
            color={getIconColor('Home')}
          />
        </Animated.View>
        <Text style={[styles.iconLabel, { color: getIconColor('Home') }]}>Home</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.iconContainer} onPress={() => { handlePress('Orders'); navigation.replace('YourOrder'); }}>
        <Animated.View style={{ transform: [{ scale: scaleAnim.Orders }] }}>
          <Icon
            name="cart"
            size={25}
            color={getIconColor('Orders')}
          />
        </Animated.View>
        <Text style={[styles.iconLabel, { color: getIconColor('Orders') }]}>Orders</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.iconContainer} onPress={() => { handlePress('Profile'); navigation.replace('Profile'); }}>
        <Animated.View style={{ transform: [{ scale: scaleAnim.Profile }] }}>
          <Icon
            name="person"
            size={25}
            color={getIconColor('Profile')}
          />
        </Animated.View>
        <Text style={[styles.iconLabel, { color: getIconColor('Profile') }]}>Profile</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    height: 60,
    justifyContent: 'space-around',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#ddd',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -3 },
    shadowOpacity: 0.3,
    shadowRadius: 5,
  },
  iconContainer: {
    flex: 1,
    alignItems: 'center',
  },
  iconLabel: {
    fontSize: 12,
    marginTop: 5,
  },
});

export default Bottom;
