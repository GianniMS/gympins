import {StatusBar} from 'expo-status-bar';
import {StyleSheet, Text, View} from 'react-native';
import {NavigationContainer} from '@react-navigation/native';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import Map from "./components/Map";
import Account from "./components/Account";
import Settings from "./components/Settings";
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';

const Tab = createBottomTabNavigator();

export default function App() {
    return (
        <NavigationContainer>
            <Tab.Navigator
                screenOptions={{
                    tabBarActiveTintColor: '#e91e63',
                }}>
                <Tab.Screen
                    name="Gym Pins Rotterdam"
                    component={Map}
                    options={{
                        tabBarLabel: 'Map',
                        tabBarIcon: ({color, size}) => (
                            <MaterialCommunityIcons name="map" color={color} size={size}/>
                        ),
                    }}/>
                <Tab.Screen
                    name="Account"
                    component={Account}
                    options={{
                        tabBarLabel: 'Account',
                        tabBarIcon: ({color, size}) => (
                            <MaterialCommunityIcons name="account" color={color} size={size}/>
                        ),
                    }}/>
                <Tab.Screen
                    name="Settings"
                    component={Settings}
                    options={{
                        tabBarLabel: 'Settings',
                        tabBarIcon: ({color, size}) => (
                            <MaterialCommunityIcons name="cog" color={color} size={size}/>
                        ),
                    }}/>
            </Tab.Navigator>
        </NavigationContainer>
    );
}
