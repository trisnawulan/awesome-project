import * as React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { faUser, faListCheck, faUserPen, faHotel, faMapLocation, faCartShopping } from '@fortawesome/free-solid-svg-icons';
import { WebView } from 'react-native-webview';
import Createdata from './Createdata';
import Listdata from './Listdata';
import Editdata from './Editdata';
import PesanKamar from './PesanKamar';


// File HTML for WebView
const webmap = require('./map.html');

// Tab Navigator
const Tab = createBottomTabNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <Tab.Navigator>
        {/* Screen Map */}
        <Tab.Screen
          name="Map"
          component={MapScreen}
          options={{
            headerShown: false,
            tabBarIcon: ({ color }) => (
              <FontAwesomeIcon icon={faMapLocation} color={color} size={20} />
            ),
          }}
        />

        {/* Screen Pesan */}
        <Tab.Screen
          name="Pesan Kamar"
          component={DataScreen}
          options={{
            headerShown: false,
            tabBarIcon: ({ color }) => (
              <FontAwesomeIcon icon={faCartShopping} color={color} size={20} />
            ),
          }}
        />

        {/* Screen PesanKamar */}
        <Tab.Screen
          name="Pesanan"
          component={PesanKamarScreen}
          options={{
            headerShown: false,
            tabBarIcon: ({ color }) => (
              <FontAwesomeIcon icon={faListCheck} color={color} size={20} />
            ),
          }}
        />

        {/* Screen Hotel */}
        <Tab.Screen
          name="Hotel"
          component={SettingsScreen}
          options={{
            headerShown: false,
            tabBarIcon: ({ color }) => (
              <FontAwesomeIcon icon={faHotel} color={color} size={20} />
            ),
          }}
        />

        {/* Screen Edit Data */}
        <Tab.Screen
          name="Edit Data"
          component={EditScreen}
          options={{
            headerShown: false,
            tabBarIcon: ({ color }) => (
              <FontAwesomeIcon icon={faUserPen} color={color} size={20} />
            ),
          }}
        />
      </Tab.Navigator>
    </NavigationContainer>
  );
}

// Screen Components

function MapScreen() {
  return (
    <WebView source={webmap} />
  );
}

function SettingsScreen() {
  return (
    <Listdata />
  );
}

function DataScreen() {
  return (
    <Createdata />
  );
}

function PesanKamarScreen({ route }) {
  const { pesanan } = route.params || {};

  return (
    <PesanKamar pesanan={pesanan} />
  );
}

function EditScreen() {
  return (
    <Editdata />
  );
}
