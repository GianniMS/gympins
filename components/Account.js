import React from 'react';
import { View, Text, StyleSheet, FlatList } from 'react-native';

function Account({ locations, isDarkMode }) {
    // Filter locations to show only favorited ones
    const favoritedLocations = locations.filter(location => location.favorite);

    return (
        <View style={[styles.container, isDarkMode ? styles.darkContainer : styles.lightContainer]}>
            {/* Title displaying favorited locations */}
            <Text style={[styles.title, isDarkMode ? styles.darkText : styles.lightText]}>Favorited Locations</Text>

            {/* Conditionally render either a message or the list of favorited locations */}
            {favoritedLocations.length === 0 ? (
                <Text style={isDarkMode ? styles.darkText : styles.lightText}>No favorited locations</Text>
            ) : (
                <FlatList
                    data={favoritedLocations}
                    keyExtractor={item => item.id.toString()}
                    renderItem={({ item }) => (
                        <View style={styles.locationItem}>
                            {/* Displaying location details */}
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
        backgroundColor: '#fff', // Light mode background color
    },
    darkContainer: {
        backgroundColor: '#4e4d4c', // Dark mode background color
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 16,
    },
    lightText: {
        color: '#000', // Light mode text color
    },
    darkText: {
        color: '#fff', // Dark mode text color
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
