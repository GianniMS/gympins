import React from 'react';
import { View, Text, StyleSheet, FlatList } from 'react-native';

function Account({ locations, isDarkMode }) {
    const favoritedLocations = locations.filter(location => location.favorite);

    return (
        <View style={[styles.container, isDarkMode ? styles.darkContainer : styles.lightContainer]}>
            <Text style={[styles.title, isDarkMode ? styles.darkText : styles.lightText]}>Favorited Locations</Text>
            {favoritedLocations.length === 0 ? (
                <Text style={isDarkMode ? styles.darkText : styles.lightText}>No favorited locations</Text>
            ) : (
                <FlatList
                    data={favoritedLocations}
                    keyExtractor={item => item.id.toString()}
                    renderItem={({ item }) => (
                        <View style={styles.locationItem}>
                            <Text style={[styles.locationName, isDarkMode ? styles.darkText : styles.lightText]}>{item.name}</Text>
                            <Text style={isDarkMode ? styles.darkText : styles.lightText}>Rating: {item.rating}</Text>
                            <Text style={isDarkMode ? styles.darkText : styles.lightText}>Description: {item.description}</Text>
                        </View>
                    )}
                />
            )}
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        padding: 16,
    },
    lightContainer: {
        backgroundColor: '#fff',
    },
    darkContainer: {
        backgroundColor: '#4e4d4c',
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 16,
    },
    lightText: {
        color: '#000',
    },
    darkText: {
        color: '#fff',
    },
    locationItem: {
        padding: 16,
        borderBottomWidth: 1,
        borderBottomColor: '#ccc',
        width: '100%',
    },
    locationName: {
        fontSize: 18,
        fontWeight: 'bold',
    },
});

export default Account;
