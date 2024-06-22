import React, { useState, useEffect } from 'react';
import { StatusBar } from 'expo-status-bar';
import { StyleSheet, View } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import Map from "./components/Map";
import Account from "./components/Account";
import Settings from "./components/Settings";
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import initialLocations from './components/locations.json';

const Tab = createBottomTabNavigator();
const LOCATIONS_STORAGE_KEY = 'locations';
const DARK_MODE_KEY = 'dark_mode';

export default function App() {
    const [locations, setLocations] = useState([]);
    const [isDarkMode, setIsDarkMode] = useState(false);

    useEffect(() => {
        loadLocations();
        loadDarkModeStatus();
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

    const loadDarkModeStatus = async () => {
        try {
            const darkModeStatus = await AsyncStorage.getItem(DARK_MODE_KEY);
            if (darkModeStatus !== null) {
                setIsDarkMode(JSON.parse(darkModeStatus));
            }
        } catch (error) {
            console.error('Error loading dark mode status from AsyncStorage:', error);
        }
    };

    const saveDarkModeStatus = async (status) => {
        try {
            await AsyncStorage.setItem(DARK_MODE_KEY, JSON.stringify(status));
        } catch (error) {
            console.error('Error saving dark mode status to AsyncStorage:', error);
        }
    };

    const toggleDarkMode = () => {
        const newStatus = !isDarkMode;
        setIsDarkMode(newStatus);
        saveDarkModeStatus(newStatus);
    };

    const containerStyle = isDarkMode ? styles.darkContainer : styles.lightContainer;
    const statusBarStyle = isDarkMode ? 'light-content' : 'dark-content';
    const headerStyle = isDarkMode ? styles.darkHeader : styles.lightHeader;
    const headerTintColor = isDarkMode ? '#fff' : '#000';

    return (
        <View style={[styles.container, containerStyle]}>
            <StatusBar style={statusBarStyle} />
            <NavigationContainer>
                <Tab.Navigator
                    screenOptions={{
                        tabBarActiveTintColor: '#e91e63',
                        tabBarStyle: isDarkMode ? styles.darkTabBar : styles.lightTabBar,
                        headerStyle: headerStyle,
                        headerTintColor: headerTintColor,
                    }}>
                    <Tab.Screen
                        name="Gym Pins Rotterdam"
                        options={{
                            tabBarLabel: 'Map',
                            tabBarIcon: ({ color, size }) => (
                                <MaterialCommunityIcons name="map" color={color} size={size} />
                            ),
                        }}>
                        {() => <Map locations={locations} setLocations={setLocations} saveLocations={saveLocations} isDarkMode={isDarkMode} />}
                    </Tab.Screen>
                    <Tab.Screen
                        name="Account"
                        options={{
                            tabBarLabel: 'Account',
                            tabBarIcon: ({ color, size }) => (
                                <MaterialCommunityIcons name="account" color={color} size={size} />
                            ),
                        }}>
                        {() => <Account locations={locations} isDarkMode={isDarkMode} />}
                    </Tab.Screen>
                    <Tab.Screen
                        name="Settings"
                        options={{
                            tabBarLabel: 'Settings',
                            tabBarIcon: ({ color, size }) => (
                                <MaterialCommunityIcons name="cog" color={color} size={size} />
                            ),
                        }}>
                        {() => <Settings isDarkMode={isDarkMode} toggleDarkMode={toggleDarkMode} />}
                    </Tab.Screen>
                </Tab.Navigator>
            </NavigationContainer>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    lightContainer: {
        backgroundColor: '#fff',
    },
    darkContainer: {
        backgroundColor: '#4e4d4c',
    },
    lightTabBar: {
        backgroundColor: '#fff',
        borderTopColor: '#ccc',
    },
    darkTabBar: {
        backgroundColor: '#4e4d4c',
        borderTopColor: '#333',
    },
    lightHeader: {
        backgroundColor: '#fff',
    },
    darkHeader: {
        backgroundColor: '#4e4d4c',
    },
});
