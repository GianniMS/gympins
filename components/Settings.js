import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';

function Settings({ isDarkMode, toggleDarkMode }) {
    return (
        <View style={[styles.container, { backgroundColor: isDarkMode ? '#4e4d4c' : '#fff' }]}>
            <Text style={[styles.title, { color: isDarkMode ? '#fff' : '#000' }]}>Mode</Text>
            <TouchableOpacity onPress={toggleDarkMode} style={styles.toggleButton}>
                <MaterialCommunityIcons
                    name={isDarkMode ? 'moon-waning-crescent' : 'white-balance-sunny'}
                    size={24}
                    color={isDarkMode ? '#fff' : '#000'}
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
        backgroundColor: 'red',
        padding: 10,
        borderRadius: 20,
    },
});

export default Settings;
