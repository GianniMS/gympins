import React, { useState, useEffect } from 'react';
import { View, StyleSheet, Modal, TextInput, Button, Text, TouchableOpacity } from 'react-native';
import MapView, { Marker, Callout, Circle } from 'react-native-maps';
import Drawer from './Drawer';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import darkMapStyle from './darkMapStyle.json'; // Import the dark map style
import * as Location from 'expo-location'; // Import Location from Expo

function Map({ locations, setLocations, saveLocations, isDarkMode }) {
    const [selectedLocation, setSelectedLocation] = useState(null);
    const [rating, setRating] = useState('');
    const [description, setDescription] = useState('');
    const [favorite, setFavorite] = useState(false);
    const [modalVisible, setModalVisible] = useState(false);
    const [drawerVisible, setDrawerVisible] = useState(false);
    const [currentLocation, setCurrentLocation] = useState(null);
    const [mapRegion, setMapRegion] = useState({
        latitude: 51.92561635593618,
        longitude: 4.509532641744117,
        latitudeDelta: 0.0922,
        longitudeDelta: 0.0421,
    });
    const [mapKey, setMapKey] = useState(0); // Key for triggering re-render of MapView

    useEffect(() => {
        // Request location permission on component mount
        requestLocationPermission();
    }, []);

    const requestLocationPermission = async () => {
        // Request foreground location permissions from user
        const { status } = await Location.requestForegroundPermissionsAsync();
        if (status !== 'granted') {
            alert('Permission to access location was denied');
        } else {
            getCurrentLocation();
        }
    };

    const getCurrentLocation = async () => {
        try {
            // Get current device location and update map region
            const location = await Location.getCurrentPositionAsync({});
            const { latitude, longitude } = location.coords;
            setCurrentLocation({ latitude, longitude });
            setMapRegion({
                ...mapRegion,
                latitude,
                longitude,
            });
        } catch (error) {
            alert('Error fetching location: ' + error.message);
        }
    };

    const selectLocationFromDrawer = (location) => {
        // Select location from drawer and update map region
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
        // Open modal to edit location details
        setSelectedLocation(location);
        setRating(location.rating.toString()); // Convert rating to string for input field
        setDescription(location.description);
        setFavorite(location.favorite);
        setModalVisible(true);
    };

    const saveChanges = () => {
        // Save changes made to location details
        const updatedLocations = locations.map(loc => {
            if (loc.id === selectedLocation.id) {
                return {
                    ...loc,
                    rating: parseFloat(rating), // Convert input to number
                    description: description,
                    favorite: favorite,
                };
            }
            return loc;
        });

        setLocations(updatedLocations); // Update locations state
        saveLocations(updatedLocations); // Save updated locations to AsyncStorage
        setModalVisible(false); // Close modal
        // Trigger re-render of MapView by changing the key
        setMapKey(prevKey => prevKey + 1);
    };

    const toggleFavorite = () => {
        // Toggle favorite status of location
        const updatedFavorite = !selectedLocation.favorite; // Toggle favorite status
        setFavorite(updatedFavorite); // Update local state
        updateLocationFavorite(selectedLocation.id, updatedFavorite); // Update location in main state
    };

    const updateLocationFavorite = (locationId, favoriteStatus) => {
        // Update favorite status in main locations state
        const updatedLocations = locations.map(loc => {
            if (loc.id === locationId) {
                return {
                    ...loc,
                    favorite: favoriteStatus,
                };
            }
            return loc;
        });

        setLocations(updatedLocations); // Update locations state
        saveLocations(updatedLocations); // Save updated locations to AsyncStorage
        // Trigger re-render of MapView by changing the key
        setMapKey(prevKey => prevKey + 1);
    };

    const toggleDrawer = () => {
        // Toggle visibility of drawer
        setDrawerVisible(!drawerVisible);
    };

    return (
        <View style={styles.container}>
            {/* Map view with markers and circles */}
            <MapView
                key={mapKey} // Key to trigger re-render
                style={styles.map}
                region={mapRegion}
                customMapStyle={isDarkMode ? darkMapStyle : []} // Apply dark map style conditionally
            >
                {locations.map((location) => (
                    // Marker for each location on the map
                    <Marker
                        key={location.id}
                        coordinate={{ latitude: location.latitude, longitude: location.longitude }}
                        title={location.name}
                        pinColor={location.favorite ? 'yellow' : 'red'} // Change pinColor based on favorite status
                    >
                        {/* Callout with location details */}
                        <Callout onPress={() => openModal(location)}>
                            <View style={styles.callout}>
                                <Text style={styles.calloutTitle}>{location.name}</Text>
                            </View>
                        </Callout>
                    </Marker>
                ))}
                {/* Circle indicating current location */}
                {currentLocation && (
                    <Circle
                        center={currentLocation}
                        radius={100} // Example radius in meters
                        strokeWidth={1}
                        strokeColor="rgba(81,175,247, 1)"
                        fillColor="rgba(81,175,247, 0.6)"
                    />
                )}
            </MapView>

            {/* Button to toggle drawer visibility */}
            <TouchableOpacity style={styles.drawerButton} onPress={toggleDrawer}>
                <MaterialCommunityIcons
                    name={drawerVisible ? 'close-circle' : 'view-headline'}
                    size={30}
                    color={isDarkMode ? '#fff' : '#000'} // Conditionally set color based on dark mode
                />
            </TouchableOpacity>

            {/* Drawer component for selecting locations */}
            <Drawer visible={drawerVisible} locations={locations} selectLocation={selectLocationFromDrawer} isDarkMode={isDarkMode} />

            {/* Modal for editing location details */}
            <Modal
                visible={modalVisible}
                animationType="slide"
                transparent={true}
                onRequestClose={() => setModalVisible(false)}
            >
                <View style={[styles.fullScreenModal, isDarkMode ? { backgroundColor: '#4e4d4c' } : { backgroundColor: '#fff' }]}>
                    <TouchableOpacity style={styles.closeButton} onPress={() => setModalVisible(false)}>
                        <MaterialCommunityIcons name="close-circle" size={30} color={isDarkMode ? '#fff' : '#000'} />
                    </TouchableOpacity>
                    <View style={[styles.modalView, isDarkMode ? { backgroundColor: '#656463' } : { backgroundColor: 'white' }]}>
                        <Text style={[styles.modalText, { color: isDarkMode ? '#fff' : '#000' }]}>Location Details</Text>
                        <View style={styles.inputContainer}>
                            <Text style={[styles.label, { color: isDarkMode ? '#fff' : '#000' }]}>Rating:</Text>
                            <View style={styles.ratingInputContainer}>
                                <TextInput
                                    style={[styles.ratingInput, { color: isDarkMode ? '#fff' : '#000', borderColor: isDarkMode ? '#fff' : '#000' }]}
                                    value={rating}
                                    onChangeText={setRating}
                                    placeholder="0-10"
                                    keyboardType="numeric"
                                    placeholderTextColor={isDarkMode ? '#ccc' : '#666'}
                                />
                                <Text style={{ color: isDarkMode ? '#fff' : '#000' }}>/10</Text>
                            </View>
                        </View>
                        <View style={styles.inputContainer}>
                            <Text style={[styles.label, { color: isDarkMode ? '#fff' : '#000' }]}>Description:</Text>
                            <TextInput
                                style={[styles.input, { color: isDarkMode ? '#fff' : '#000', borderColor: isDarkMode ? '#fff' : '#000' }]}
                                value={description}
                                onChangeText={setDescription}
                                placeholder="Description"
                                placeholderTextColor={isDarkMode ? '#ccc' : '#666'}
                            />
                        </View>
                        <View style={styles.favoriteContainer}>
                            <Text style={{ color: isDarkMode ? '#fff' : '#000' }}>Favorite: {favorite ? 'Yes' : 'No'}</Text>
                            <TouchableOpacity onPress={toggleFavorite}>
                                <MaterialCommunityIcons
                                    name={favorite ? 'star' : 'star-outline'}
                                    size={30}
                                    color={favorite ? 'gold' : 'gray'}
                                />
                            </TouchableOpacity>
                        </View>
                        <Button
                            title="Save"
                            onPress={saveChanges}
                            color={isDarkMode ? 'red' : '#51AFF7'} // Red color in dark mode, blue color in light mode
                        />
                    </View>
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
    callout: {
        flex: 1,
        position: 'relative',
        backgroundColor: '#fff',
        padding: 10,
        borderRadius: 10,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.8,
        shadowRadius: 2,
        elevation: 5,
    },
    calloutTitle: {
        fontSize: 16,
        fontWeight: 'bold',
        marginBottom: 5,
    },
    fullScreenModal: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    closeButton: {
        position: 'absolute',
        top: 40,
        right: 20,
        zIndex: 1,
    },
    modalView: {
        margin: 20,
        borderRadius: 20,
        padding: 35,
        width: '90%',
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
        fontWeight: 'bold',
    },
    inputContainer: {
        marginBottom: 15,
        width: '100%',
        alignItems: 'center',
    },
    label: {
        fontSize: 16,
        fontWeight: 'bold',
        marginBottom: 5,
    },
    ratingInputContainer: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    ratingInput: {
        height: 40,
        borderColor: 'gray',
        borderWidth: 1,
        width: 60,
        paddingLeft: 10,
        marginRight: 5,
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
        zIndex: 1,
    },
});

export default Map;
