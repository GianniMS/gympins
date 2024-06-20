import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';

function Settings() {
    const [isDarkMode, setIsDarkMode] = useState(false);

    const toggleDarkMode = () => {
        setIsDarkMode(!isDarkMode);
    };

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Mode</Text>
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
        backgroundColor: '#fff',
        alignItems: 'center',
        justifyContent: 'center',
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 20,
    },
    toggleButton: {
        backgroundColor: '#808080',
        padding: 10,
        borderRadius: 20,
    },
});

export default Settings;
