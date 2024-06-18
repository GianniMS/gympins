import React, { useState, useEffect } from 'react';
import { View, StyleSheet, Modal, TextInput, Button, Text } from 'react-native';
import MapView, { Marker } from 'react-native-maps';
import AsyncStorage from '@react-native-async-storage/async-storage';

// Initial locations data
import initialLocations from './locations.json';

// AsyncStorage keys
const LOCATIONS_STORAGE_KEY = 'locations';

function Map() {
    const [locations, setLocations] = useState([]);

    useEffect(() => {
        // Load locations data from AsyncStorage on component mount
        loadLocations();
    }, []);

    // Load locations from AsyncStorage
    const loadLocations = async () => {
        try {
            const storedLocations = await AsyncStorage.getItem(LOCATIONS_STORAGE_KEY);
            if (storedLocations !== null) {
                // Parse stored data
                setLocations(JSON.parse(storedLocations));
            } else {
                // If no data in AsyncStorage, use initialLocations from JSON
                setLocations(initialLocations);
            }
        } catch (error) {
            console.error('Error loading locations from AsyncStorage:', error);
        }
    };

    // Save locations to AsyncStorage
    const saveLocations = async (updatedLocations) => {
        try {
            await AsyncStorage.setItem(LOCATIONS_STORAGE_KEY, JSON.stringify(updatedLocations));
        } catch (error) {
            console.error('Error saving locations to AsyncStorage:', error);
        }
    };

    const [selectedLocation, setSelectedLocation] = useState(null);
    const [rating, setRating] = useState('');
    const [description, setDescription] = useState('');
    const [favorite, setFavorite] = useState(false);
    const [modalVisible, setModalVisible] = useState(false);

    const openModal = (location) => {
        setSelectedLocation(location);
        setRating(location.rating.toString());
        setDescription(location.description);
        setFavorite(location.favorite);
        setModalVisible(true);
    };

    const saveChanges = () => {
        // Update the location data in state
        const updatedLocations = locations.map(loc => {
            if (loc.id === selectedLocation.id) {
                return {
                    ...loc,
                    rating: parseFloat(rating),
                    description: description,
                    favorite: favorite,
                };
            }
            return loc;
        });

        setLocations(updatedLocations);
        saveLocations(updatedLocations); // Save updated locations to AsyncStorage
        setModalVisible(false);
    };

    const toggleFavorite = () => {
        setFavorite(!favorite);
    };

    return (
        <View style={styles.container}>
            <MapView
                style={styles.map}
                initialRegion={{
                    latitude: 51.92561635593618,
                    longitude: 4.509532641744117,
                    latitudeDelta: 0.0922,
                    longitudeDelta: 0.0421,
                }}
            >
                {locations.map((location) => (
                    <Marker
                        key={location.id}
                        coordinate={{ latitude: location.latitude, longitude: location.longitude }}
                        title={location.name}
                        description={`Rating: ${location.rating}\nDescription: ${location.description}\nFavorite: ${location.favorite ? 'Yes' : 'No'}`}
                        onCalloutPress={() => openModal(location)}
                    />
                ))}
            </MapView>

            <Modal
                visible={modalVisible}
                animationType="slide"
                transparent={true}
                onRequestClose={() => setModalVisible(false)}
            >
                <View style={styles.modalView}>
                    <Text style={styles.modalText}>Edit Location</Text>
                    <TextInput
                        style={styles.input}
                        value={rating}
                        onChangeText={setRating}
                        placeholder="Rating"
                        keyboardType="numeric"
                    />
                    <TextInput
                        style={styles.input}
                        value={description}
                        onChangeText={setDescription}
                        placeholder="Description"
                    />
                    <View style={styles.favoriteContainer}>
                        <Text>Favorite: {favorite ? 'Yes' : 'No'}</Text>
                        <Button title="Toggle Favorite" onPress={toggleFavorite} />
                    </View>
                    <Button title="Save" onPress={saveChanges} />
                </View>
            </Modal>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    map: {
        ...StyleSheet.absoluteFillObject,
    },
    modalView: {
        margin: 20,
        backgroundColor: 'white',
        borderRadius: 20,
        padding: 35,
        alignItems: 'center',
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.25,
        shadowRadius: 4,
        elevation: 5,
    },
    modalText: {
        marginBottom: 15,
        textAlign: 'center',
        fontSize: 20,
    },
    input: {
        height: 40,
        borderColor: 'gray',
        borderWidth: 1,
        marginBottom: 15,
        width: '100%',
        paddingLeft: 10,
    },
    favoriteContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginBottom: 15,
        width: '100%',
    },
});

export default Map;
