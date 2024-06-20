import React from 'react';
import { View, Text, StyleSheet, FlatList } from 'react-native';

function Account({ locations }) {
    const favoritedLocations = locations.filter(location => location.favorite);

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Favorited Locations</Text>
            {favoritedLocations.length === 0 ? (
                <Text>No favorited locations</Text>
            ) : (
                <FlatList
                    data={favoritedLocations}
                    keyExtractor={item => item.id.toString()}
                    renderItem={({ item }) => (
                        <View style={styles.locationItem}>
                            <Text style={styles.locationName}>{item.name}</Text>
                            <Text>Rating: {item.rating}</Text>
                            <Text>Description: {item.description}</Text>
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
        backgroundColor: '#fff',
        alignItems: 'center',
        justifyContent: 'center',
        padding: 16,
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 16,
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
