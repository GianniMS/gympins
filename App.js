import React, { useState, useEffect } from 'react';
import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View } from 'react-native';
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

export default function App() {
    const [locations, setLocations] = useState([]);

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

    return (
        <NavigationContainer>
            <Tab.Navigator
                screenOptions={{
                    tabBarActiveTintColor: '#e91e63',
                }}>
                <Tab.Screen
                    name="Gym Pins Rotterdam"
                    options={{
                        tabBarLabel: 'Map',
                        tabBarIcon: ({ color, size }) => (
                            <MaterialCommunityIcons name="map" color={color} size={size} />
                        ),
                    }}>
                    {() => <Map locations={locations} setLocations={setLocations} saveLocations={saveLocations} />}
                </Tab.Screen>
                <Tab.Screen
                    name="Account"
                    options={{
                        tabBarLabel: 'Account',
                        tabBarIcon: ({ color, size }) => (
                            <MaterialCommunityIcons name="account" color={color} size={size} />
                        ),
                    }}>
                    {() => <Account locations={locations} />}
                </Tab.Screen>
                <Tab.Screen
                    name="Settings"
                    component={Settings}
                    options={{
                        tabBarLabel: 'Settings',
                        tabBarIcon: ({ color, size }) => (
                            <MaterialCommunityIcons name="cog" color={color} size={size} />
                        ),
                    }}
                />
            </Tab.Navigator>
        </NavigationContainer>
    );
}
