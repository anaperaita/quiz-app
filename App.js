import 'react-native-gesture-handler';
import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import HomeScreen from './src/screens/HomeScreen';
import QuizScreen from './src/screens/QuizScreen';
import StatisticsScreen from './src/screens/StatisticsScreen';
import ReviewScreen from './src/screens/ReviewScreen';
import { QuizProvider } from './src/context/QuizContext';

const Stack = createStackNavigator();

export default function App() {
  return (
    <QuizProvider>
      <NavigationContainer>
        <Stack.Navigator
          initialRouteName="Home"
          screenOptions={{
            headerStyle: {
              backgroundColor: '#2c3e50',
            },
            headerTintColor: '#fff',
            headerTitleStyle: {
              fontWeight: 'bold',
            },
          }}
        >
          <Stack.Screen
            name="Home"
            component={HomeScreen}
            options={{ title: 'Visual Quiz' }}
          />
          <Stack.Screen
            name="Quiz"
            component={QuizScreen}
            options={{ title: 'Practicar' }}
          />
          <Stack.Screen
            name="Statistics"
            component={StatisticsScreen}
            options={{ title: 'Estadísticas' }}
          />
          <Stack.Screen
            name="Review"
            component={ReviewScreen}
            options={{ title: 'Repasar Fallos' }}
          />
        </Stack.Navigator>
      </NavigationContainer>
    </QuizProvider>
  );
}
