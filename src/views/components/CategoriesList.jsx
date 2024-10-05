import React, { useState, useEffect } from 'react';
import { View, Text, Image, StyleSheet, ScrollView, Alert, TouchableOpacity } from 'react-native';
import { getCategories } from '../../utils/config';

const CategoriesList = ({ onCategorySelect }) => {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedCategory, setSelectedCategory] = useState(null);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const { status, data } = await getCategories();
        if (status === 200) {
          console.log('data', data);
          setCategories(data); // Assuming the data is directly the list of categories
          if (data.length > 0) {
            // Set the first category as selected by default
            setSelectedCategory(data[0].id);
            onCategorySelect(data[0]); // Call the callback with the first category
          }
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

    fetchCategories();
  }, []);

  if (loading) {
    return (
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.scrollContainer}
      >
        {Array(5).fill().map((_, index) => (
          <View key={index} style={styles.skeletonCategoryContainer}>
            <View style={styles.skeletonImage} />
            <View style={styles.skeletonText} />
          </View>
        ))}
      </ScrollView>
    );
  }

  if (error) {
    return (
      <View style={styles.errorContainer}>
        <Text style={styles.errorText}>Error: {error}</Text>
      </View>
    );
  }

  const handleCategoryPress = (category) => {
    setSelectedCategory(category.id);
    onCategorySelect(category); // Call the callback with the selected category
  };

  return (
    <ScrollView
      horizontal
      showsHorizontalScrollIndicator={false}
      contentContainerStyle={styles.scrollContainer}
    >
      {categories.map(category => (
        <TouchableOpacity
          key={category.id}
          style={[
            styles.categoryContainer,
            selectedCategory === category.id && styles.selectedCategory
          ]}
          onPress={() => handleCategoryPress(category)}
        >
          <Image source={{ uri: category.category_img }} style={styles.categoryImage} />
          <Text style={styles.categoryText}>
            {category.category_name}
          </Text>
        </TouchableOpacity>
      ))}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  scrollContainer: {
    paddingTop: 10,
    paddingHorizontal: 10,
  },
  categoryContainer: {
    alignItems: 'center',
    marginRight: 25,
    width: 70,
    padding: 5,
    borderTopRightRadius: 10,
    borderTopLeftRadius: 10,
  },
  selectedCategory: {
    backgroundColor: '#d0f0c0',
    borderColor: "#8da382",
    borderBottomWidth: 5
  },
  categoryImage: {
    width: 60,
    height: 60,
    borderRadius: 30,
    borderWidth: 2,
    borderColor: '#ddd',
    overflow: 'hidden',
    marginBottom: 5,
  },
  categoryText: {
    textAlign: 'center',
    fontSize: 10,
    fontWeight: 'bold',
    color: '#333',
    width: '100%',
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  errorText: {
    color: 'red',
    fontSize: 16,
  },
  skeletonCategoryContainer: {
    alignItems: 'center',
    marginRight: 15,
    width: 70,
    padding: 5,
  },
  skeletonImage: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: '#e0e0e0', // Grey background to simulate loading state
    marginBottom: 5,
  },
  skeletonText: {
    width: 50,
    height: 10,
    backgroundColor: '#e0e0e0', // Grey background for the text area
  },
});

export default CategoriesList;
