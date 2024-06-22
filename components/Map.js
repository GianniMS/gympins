import React, { useState } from 'react';
import { View, StyleSheet, Modal, TextInput, Button, Text, TouchableOpacity } from 'react-native';
import MapView, { Marker, Callout } from 'react-native-maps';
import Drawer from './Drawer';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import darkMapStyle from './darkMapStyle.json'; // Import the dark map style

function Map({ locations, setLocations, saveLocations, isDarkMode }) {
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
        setRating(location.rating.toString()); // Assuming location.rating is a number out of 10
        setDescription(location.description);
        setFavorite(location.favorite);
        setModalVisible(true);
    };

    const saveChanges = () => {
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

        setLocations(updatedLocations);
        saveLocations(updatedLocations);
        setModalVisible(false);
    };

    const toggleFavorite = () => {
        setFavorite(!favorite);
    };

    const toggleDrawer = () => {
        setDrawerVisible(!drawerVisible);
    };

    return (
        <View style={styles.container}>
            <MapView
                style={styles.map}
                region={mapRegion}
                customMapStyle={isDarkMode ? darkMapStyle : []} // Apply dark map style conditionally
            >
                {locations.map((location) => (
                    <Marker
                        key={location.id}
                        coordinate={{ latitude: location.latitude, longitude: location.longitude }}
                        title={location.name}
                        pinColor={location.favorite ? 'yellow' : 'red'} // Change pinColor based on favorite status
                    >
                        <Callout onPress={() => openModal(location)}>
                            <View style={styles.callout}>
                                <Text style={styles.calloutTitle}>{location.name}</Text>
                            </View>
                        </Callout>
                    </Marker>
                ))}
            </MapView>

            <TouchableOpacity style={styles.drawerButton} onPress={toggleDrawer}>
                <MaterialCommunityIcons
                    name={drawerVisible ? 'close-circle' : 'view-headline'}
                    size={30}
                    color={isDarkMode ? '#fff' : '#000'} // Conditionally set color based on dark mode
                />
            </TouchableOpacity>

            <Drawer visible={drawerVisible} locations={locations} selectLocation={selectLocationFromDrawer} isDarkMode={isDarkMode} />

            <Modal
                visible={modalVisible}
                animationType="slide"
                transparent={true}
                onRequestClose={() => setModalVisible(false)}
            >
                <View style={styles.fullScreenModal}>
                    <TouchableOpacity style={styles.closeButton} onPress={() => setModalVisible(false)}>
                        <MaterialCommunityIcons name="close-circle" size={30} color={isDarkMode ? '#fff' : '#000'} /> {/* Conditionally set color based on dark mode */}
                    </TouchableOpacity>
                    <View style={styles.modalView}>
                        <Text style={styles.modalText}>Location Details</Text>
                        <View style={styles.inputContainer}>
                            <Text style={styles.label}>Rating:</Text>
                            <View style={styles.ratingInputContainer}>
                                <TextInput
                                    style={styles.ratingInput}
                                    value={rating}
                                    onChangeText={setRating}
                                    placeholder="0-10"
                                    keyboardType="numeric"
                                />
                                <Text>/10</Text>
                            </View>
                        </View>
                        <View style={styles.inputContainer}>
                            <Text style={styles.label}>Description:</Text>
                            <TextInput
                                style={styles.input}
                                value={description}
                                onChangeText={setDescription}
                                placeholder="Description"
                            />
                        </View>
                        <View style={styles.favoriteContainer}>
                            <Text>Favorite: {favorite ? 'Yes' : 'No'}</Text>
                            <TouchableOpacity onPress={toggleFavorite}>
                                <MaterialCommunityIcons
                                    name={favorite ? 'star' : 'star-outline'}
                                    size={30}
                                    color={favorite ? 'gold' : 'gray'}
                                />
                            </TouchableOpacity>
                        </View>
                        <Button title="Save" onPress={saveChanges} />
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
        backgroundColor: 'rgba(0,0,0,0.5)',
        justifyContent: 'center',
    },
    closeButton: {
        position: 'absolute',
        top: 40,
        right: 20,
        zIndex: 1,
    },
    closeButtonText: {
        fontSize: 16,
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
    drawerButtonText: {
        fontSize: 16,
    },
});

export default Map;
