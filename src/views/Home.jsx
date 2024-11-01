import React, { useState, useEffect, useRef } from 'react';
import { View, StyleSheet, ScrollView, Text, Image, TouchableOpacity, Dimensions, Alert } from 'react-native';
import CategoriesList from './components/CategoriesList';
import Header from './components/Header';
import { getSubCategories } from '../utils/config';
import { useNavigation } from '@react-navigation/native';
import Banners from './components/Banners';
import ExpandableLocationCard from './components/ExpandableLocationCard';
import Bottom from './bottom';

// Get screen width
const { width: screenWidth } = Dimensions.get('window');

// Calculate card width based on screen width and 4 columns (adjusted for margins)
const cardMargin = 0; // Margin around each card
const numberOfColumns = 4; // Number of cards per row
const cardWidth = (screenWidth - (cardMargin * (numberOfColumns + 1))) / numberOfColumns; // Adjust for margins

const Home = () => {
  const navigation = useNavigation();
  const scrollViewRef = useRef(null); // Reference to ScrollView
  const [selectedCategory, setSelectedCategory] = useState(null); // State to store selected category
  const [subCategoriesData, setSubCategoriesData] = useState([]); // State for sub-categories data
  const [loading, setLoading] = useState(false); // Loading state
  const [error, setError] = useState(null); // Error state
  const [categoryOffsets, setCategoryOffsets] = useState([]); // Offsets for categories

  useEffect(() => {
    if (selectedCategory) {
      fetchSubCategories();
    }
  }, [selectedCategory]);

  useEffect(() => {
    if (selectedCategory && scrollViewRef.current) {
      const categoryIndex = categories.findIndex(category => category === selectedCategory.category_name);
      if (categoryIndex !== -1) {
        const categoryOffset = categoryOffsets[categoryIndex] || 0;
        scrollViewRef.current.scrollTo({
          y: categoryOffset - 20, // Adjust scroll position to include some margin
          animated: true,
        });
      }
    }
  }, [selectedCategory, categoryOffsets]);

  const fetchSubCategories = async () => {
    setLoading(true);
    try {
      const { status, data } = await getSubCategories();
      if (status === 200) {
       // console.log('setSubCategoriesData',data)
        setSubCategoriesData(data); // Assuming data is directly the list of sub-categories
      } else {
        throw new Error(`Unexpected status code: ${status}`);
      }
    } catch (error) {
      setError(error.message);
      Alert.alert('Error', error.message);
    } finally {
      setLoading(false);
    }
  };

  // Group sub-categories by their category_name
  const groupedSubCategories = subCategoriesData.reduce((acc, subCategory) => {
    if (!acc[subCategory.category_name]) {
      acc[subCategory.category_name] = [];
    }
    acc[subCategory.category_name].push(subCategory);
    return acc;
  }, {});

  // Create a combined data array for rendering
  const categories = Object.keys(groupedSubCategories);

  const handleContentLayout = (event, index) => {
    const { y } = event.nativeEvent.layout;
    setCategoryOffsets(prevOffsets => {
      const newOffsets = [...prevOffsets];
      newOffsets[index] = y;
      return newOffsets;
    });
  };

  const renderCategory = (categoryName, index) => {
    const categoryItems = groupedSubCategories[categoryName];
    return (
      <View key={categoryName} style={styles.categoryWrapper} onLayout={(event) => handleContentLayout(event, index)}>
        <View style={styles.headerContainer}>
          <Text style={styles.categoryHeading}>{categoryName}</Text>
        </View>
        <View style={styles.cardsContainer}>
          {categoryItems.map((item, index) => (
            <TouchableOpacity
              key={index}
              style={[styles.card, { width: cardWidth }]}
              onPress={() => {
                //console.log('sub category',item); // Log the details of the clicked product
                navigation.navigate('ProductCard', { productDetails: item }); // Pass product details when navigating
              }}
            >
              <Image source={{ uri: item.sub_category_img||'https://ik.imagekit.io/efsdltq0e/icons/No_img.png?updatedAt=1727376099723' }} style={styles.cardImage} />
              <Text style={styles.cardText} numberOfLines={2}>{item.sub_category_name}</Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <ExpandableLocationCard />
      <Header />
      <View style={styles.categoryContainer}>
        <CategoriesList onCategorySelect={setSelectedCategory} />
      </View>

      
      <ScrollView
        contentContainerStyle={styles.scrollViewContainer}
        showsVerticalScrollIndicator={false}
        ref={scrollViewRef} // Set the refr
      >
        <Banners />
        {categories.map((categoryName, index) => renderCategory(categoryName, index))}
      </ScrollView>

      {loading && <Text style={styles.loadingText}>Loading...</Text>}
      {error && <Text style={styles.errorText}>{error}</Text>}

      <Bottom activeIcon="Home" />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  categoryContainer: {
    marginBottom: 10,
    borderColor: 'gray',
    borderWidth: 0.5,
  },
  categoryWrapper: {
    marginBottom: 20,
  },
  headerContainer: {
    alignItems: 'flex-start', // Align header to the right
    marginBottom: 10,
    paddingHorizontal: 10,
  },
  categoryHeading: {
    fontSize: 18,
    fontWeight: 'bold',
    color:'black'
  },
  cardsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'flex-start',
    paddingHorizontal: cardMargin,
  },
  card: {
    backgroundColor: '#fff',
    margin: cardMargin,
    paddingVertical: 13,
    alignItems: 'center',
  },
  cardImage: {
    width: '90%',
    height: 90, // Adjust height for responsiveness
    marginBottom: 5,
    resizeMode: 'contain',
    borderRadius: 20,
  },
  cardText: {
    fontSize: 10, // Smaller font size for responsiveness
    textAlign: 'center',
    color:'black',
    fontWeight:'600',
    width:'60%',

  },
  scrollViewContainer: {
    paddingHorizontal: cardMargin, // Adjust container padding
  },
  loadingText: {
    textAlign: 'center',
    marginVertical: 10,
  },
  errorText: {
    textAlign: 'center',
    color: 'red',
    marginVertical: 10,
  },
});

export default Home; 