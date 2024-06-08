import React from 'react';
import {View, Text, StyleSheet} from 'react-native';

function Settings() {
    return (
        <View style={styles.container}>
            <Text>Settings Screen</Text>
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
});


export default Settings;