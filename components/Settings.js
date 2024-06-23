import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';

function Settings({ isDarkMode, toggleDarkMode }) {
    return (
        <View style={[styles.container, { backgroundColor: isDarkMode ? '#4e4d4c' : '#fff' }]}>
            {/* Title of the settings screen */}
            <Text style={[styles.title, { color: isDarkMode ? '#fff' : '#000' }]}>Mode</Text>

            {/* Toggle button to switch between dark and light mode */}
            <TouchableOpacity onPress={toggleDarkMode} style={styles.toggleButton}>
                <MaterialCommunityIcons
                    name={isDarkMode ? 'moon-waning-crescent' : 'white-balance-sunny'} // Icon changes based on dark mode status
                    size={24}
                    color={isDarkMode ? '#fff' : '#000'} // Icon color changes based on dark mode status
                />
            </TouchableOpacity>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 20,
    },
    toggleButton: {
        backgroundColor: 'red', // Background color of the toggle button
        padding: 10,
        borderRadius: 20,
    },
});

export default Settings;
