import * as React from 'react';
import { Text, View } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import Profil from './App';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { faUser, faUserGraduate, faEdit, faPlusCircle, faUserPen } from '@fortawesome/free-solid-svg-icons';
import { WebView } from 'react-native-webview';
import { faGithub } from '@fortawesome/free-brands-svg-icons';
import Createdata from './Createdata';
import Listdata from './Listdata';
import Editdata from './Editdata';
import Mahasiswa from './Mahasiswa';

function HomeScreen() {
  return (
    <Createdata />
  );
}

function SettingsScreen() {
  return (
    <Listdata />
  );
}

function EditScreen() {
  return (
    <Editdata/>
  );
};


const Tab = createBottomTabNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <Tab.Navigator>
        <Tab.Screen
          name="Tambah"
          component={HomeScreen}
          options={{
            headerShown: false,
            tabBarIcon: ({ color }) => (
              <FontAwesomeIcon icon={faPlusCircle} color={color} size={20} />
            ),
          }}
        />
        <Tab.Screen
          name="Data Mahasiswa"
          component={SettingsScreen}
          options={{
            tabBarIcon: ({ color }) => (
              <FontAwesomeIcon icon={faUserGraduate} color={color} size={20} />
            ),
          }}
        />
        <Tab.Screen
          name="Edit"
          component={EditScreen}
          options={{
            tabBarIcon: ({ color }) => (
              <FontAwesomeIcon icon={faUserPen} color={color} size={20} />
            ),
          }}
        />
        {/* <Tab.Screen
                  name="Edit"
                  component={EditdataScreen}
                  options={{
                    headerShown: false,
                    tabBarIcon: ({ color }) => (
                      <FontAwesomeIcon icon={faEdit} color={color} size={20} />
                    ),
                  }}
                /> */}
      </Tab.Navigator>
    </NavigationContainer>
  );
}