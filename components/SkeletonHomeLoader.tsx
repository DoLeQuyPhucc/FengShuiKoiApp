import React from 'react';
import { View, StyleSheet } from 'react-native';

const SkeletonLoader: React.FC = () => {
  return (
    <View style={styles.skeletonContainer}>
      <View style={styles.searchContainer} />
      <View style={styles.skeletonBanner} />
      <View style={styles.skeletonIconGroup}>
        <View style={styles.skeletonIcon} />
        <View style={styles.skeletonIcon} />
        <View style={styles.skeletonIcon} />
      </View>
      <View style={styles.skeletonTitle} />
      <View style={styles.skeletonProductList}>
        <View style={styles.skeletonProduct} />
        <View style={styles.skeletonProduct} />
        <View style={styles.skeletonProduct} />
      </View>
      <View style={styles.skeletonTitle} />
      <View style={styles.skeletonProductList}>
        <View style={styles.skeletonProduct} />
        <View style={styles.skeletonProduct} />
        <View style={styles.skeletonProduct} />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  skeletonContainer: {
    flex: 1,
    padding: 16,
  },
  searchContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    backgroundColor: '#e0e0e0',
    alignItems: 'center',
    marginVertical: 10,
  },
  skeletonBanner: {
    width: '100%',
    height: 150,
    backgroundColor: '#e0e0e0',
    marginBottom: 20,
    borderRadius: 10,
  },
  skeletonIconGroup: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: 20,
  },
  skeletonIcon: {
    width: 70,
    height: 70,
    backgroundColor: '#e0e0e0',
    borderRadius: 15,
  },
  skeletonTitle: {
    width: '50%',
    height: 20,
    backgroundColor: '#e0e0e0',
    marginBottom: 20,
    borderRadius: 10,
  },
  skeletonProductList: {
    flexDirection: 'row',
  },
  skeletonProduct: {
    width: 150,
    height: 180,
    backgroundColor: '#e0e0e0',
    marginRight: 10,
    borderRadius: 8,
  },
});

export default SkeletonLoader;
