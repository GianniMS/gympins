import React, { useState, useEffect } from 'react';
import { View, StyleSheet, FlatList, Text, Modal, TextInput, Button } from 'react-native';
import MapView, { Marker } from 'react-native-maps';
import locations from './locations.json';

function Map() {
    const [selectedLocation, setSelectedLocation] = useState(null);
    const [rating, setRating] = useState('');
    const [description, setDescription] = useState('');
    const [modalVisible, setModalVisible] = useState(false);

    const openModal = (location) => {
        setSelectedLocation(location);
        setRating(location.rating.toString());
        setDescription(location.description);
        setModalVisible(true);
    };

    const saveChanges = () => {
        // Update the location data (this could be saved to a backend or local storage)
        setSelectedLocation({
            ...selectedLocation,
            rating: parseFloat(rating),
            description: description,
        });
        setModalVisible(false);
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
                        description={`Rating: ${location.rating} - ${location.description}`}
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
});

export default Map;
