import React from 'react';
import { View, ScrollView, TouchableOpacity, Text, StyleSheet } from 'react-native';

const Drawer = ({ visible, locations, selectLocation, isDarkMode }) => {
    if (!visible) return null;

    const styles = StyleSheet.create({
        drawer: {
            position: 'absolute',
            left: 0,
            top: 0,
            bottom: 0,
            width: 250,
            backgroundColor: isDarkMode ? '#4e4d4c' : '#fff', // Conditional background color
            paddingTop: 50,
            borderRightWidth: 1,
            borderColor: isDarkMode ? '#333' : '#ccc', // Conditional border color
            elevation: 16,
        },
        drawerContent: {
            flex: 1,
            padding: 10,
        },
        drawerItemText: {
            fontSize: 18,
            paddingVertical: 10,
            color: isDarkMode ? '#fff' : '#000', // Conditional text color
        },
    });

    return (
        <View style={styles.drawer}>
            <ScrollView style={styles.drawerContent}>
                {locations.map((location) => (
                    <TouchableOpacity key={location.id} onPress={() => selectLocation(location)}>
                        <Text style={styles.drawerItemText}>{location.name}</Text>
                    </TouchableOpacity>
                ))}
            </ScrollView>
        </View>
    );
};

export default Drawer;
