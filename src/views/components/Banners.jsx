import React, { useState, useEffect, useRef } from 'react';
import { Text, View, Image, ScrollView, Dimensions, StyleSheet, Alert } from 'react-native';
import { getBanners } from '../../utils/config';

const { width } = Dimensions.get('window');

const Banners = () => {
  const [activeIndex, setActiveIndex] = useState(0);
  const [banners, setBanners] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const scrollViewRef = useRef(null);

  // Fetch banners data
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const { status, data } = await getBanners();
        if (status === 200 && data.length > 0) {
          setBanners(data);
        } else if (status === 200 && data.length === 0) {
          setError('No banners available');
        } else {
          throw new Error('Failed to fetch banners');
        }
      } catch (error) {
        setError(error.message);
        Alert.alert('Error', error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // Auto-scroll logic
  useEffect(() => {
    const interval = setInterval(() => {
      const nextIndex = activeIndex === banners.length - 1 ? 0 : activeIndex + 1;
      scrollViewRef.current?.scrollTo({ x: nextIndex * width, animated: true });
      setActiveIndex(nextIndex);
    }, 3000); // Auto-scroll every 3 seconds

    return () => clearInterval(interval);
  }, [activeIndex, banners.length]);

  // Handle manual scroll
  const handleScroll = (event) => {
    const slideIndex = Math.ceil(event.nativeEvent.contentOffset.x / width);
    if (slideIndex !== activeIndex) {
      setActiveIndex(slideIndex);
    }
  };

  if (loading) {
    return <View style={styles.loadingContainer}><Text>Loading...</Text></View>;
  }

  if (error) {
    return <View style={styles.errorContainer}><Text>{error}</Text></View>;
  }

  return (
    <View style={styles.container}>
      <ScrollView
        ref={scrollViewRef}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        onScroll={handleScroll}
        scrollEventThrottle={16}
        snapToInterval={width} // Ensures snapping to one image per scroll
        decelerationRate="fast"
      >
        {banners.map((banner) => (
          <Image
            key={banner.banner_id}
            source={{ uri: banner.banner_img }}
            style={styles.bannerImage}
          />
        ))}
      </ScrollView>

      {/* Pagination Dots */}
      <View style={styles.paginationContainer}>
        {banners.map((_, index) => (
          <View
            key={index}
            style={[
              styles.dot,
              { backgroundColor: index === activeIndex ? '#000' : '#ccc' },
            ]}
          />
        ))}
      </View>
    </View>
  );
};

// Styles
const styles = StyleSheet.create({
  container: {
    position: 'relative',
    marginBottom: 20,
    elevation: 3,
  },
  bannerImage: {
    width: width - 10, // Full width minus the horizontal margin
    height: 200,
    resizeMode: 'cover', // Or 'contain' based on your preference
    borderRadius: 20,    // Rounded corners
    marginHorizontal: 5, // Horizontal margin of 5
  },
  paginationContainer: {
    position: 'absolute',
    bottom: 10,
    flexDirection: 'row',
    alignSelf: 'center',
  },
  dot: {
    height: 8,
    width: 8,
    borderRadius: 4,
    marginHorizontal: 5,
  },
  loadingContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    height: 100,
  },
  errorContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    height: 100,
  },
});

export default Banners;
