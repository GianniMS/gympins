import React, { useState, useEffect } from 'react';
import { View, StyleSheet, Modal, TextInput, Button, Text, TouchableOpacity, ScrollView } from 'react-native';
import MapView, { Marker } from 'react-native-maps';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Drawer from './Drawer'; // Import the Drawer component
import initialLocations from './locations.json';

const LOCATIONS_STORAGE_KEY = 'locations';

function Map() {
    const [locations, setLocations] = useState([]);
    const [selectedLocation, setSelectedLocation] = useState(null);
    const [rating, setRating] = useState('');
    const [description, setDescription] = useState('');
    const [favorite, setFavorite] = useState(false);
    const [modalVisible, setModalVisible] = useState(false);
    const [drawerVisible, setDrawerVisible] = useState(false);
    const [mapRegion, setMapRegion] = useState({
        latitude: 51.92561635593618,
        longitude: 4.509532641744117,
        latitudeDelta: 0.0922,
        longitudeDelta: 0.0421,
    });

    useEffect(() => {
        loadLocations();
    }, []);

    const loadLocations = async () => {
        try {
            const storedLocations = await AsyncStorage.getItem(LOCATIONS_STORAGE_KEY);
            if (storedLocations !== null) {
                setLocations(JSON.parse(storedLocations));
            } else {
                setLocations(initialLocations);
            }
        } catch (error) {
            console.error('Error loading locations from AsyncStorage:', error);
        }
    };

    const saveLocations = async (updatedLocations) => {
        try {
            await AsyncStorage.setItem(LOCATIONS_STORAGE_KEY, JSON.stringify(updatedLocations));
        } catch (error) {
            console.error('Error saving locations to AsyncStorage:', error);
        }
    };

    const selectLocationFromDrawer = (location) => {
        setSelectedLocation(location);
        setDrawerVisible(false);
        setMapRegion({
            latitude: location.latitude,
            longitude: location.longitude,
            latitudeDelta: 0.0922,
            longitudeDelta: 0.0421,
        });
    };

    const openModal = (location) => {
        setSelectedLocation(location);
        setRating(location.rating.toString());
        setDescription(location.description);
        setFavorite(location.favorite);
        setModalVisible(true);
    };

    const saveChanges = () => {
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
        saveLocations(updatedLocations);
        setModalVisible(false);
    };

    const toggleFavorite = () => {
        setFavorite(!favorite);
    };

    const openDrawer = () => {
        setDrawerVisible(true);
    };

    return (
        <View style={styles.container}>
            <MapView
                style={styles.map}
                region={mapRegion}
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

            <TouchableOpacity style={styles.drawerButton} onPress={openDrawer}>
                <Text style={styles.drawerButtonText}>Locations</Text>
            </TouchableOpacity>

            <Drawer visible={drawerVisible} locations={locations} selectLocation={selectLocationFromDrawer} />

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
    drawerButton: {
        position: 'absolute',
        top: 20,
        left: 20,
        backgroundColor: '#fff',
        padding: 10,
        borderRadius: 5,
        zIndex: 1,
        elevation: 2,
    },
    drawerButtonText: {
        fontSize: 16,
    },
});

export default Map;
