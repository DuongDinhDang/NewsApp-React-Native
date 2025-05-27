// src/navigation/navigation.js
import { createStackNavigator } from "@react-navigation/stack";
import HomeScreen from "../screens/HomeScreen";
import DetailScreen from "../screens/DetailScreen";
import SearchScreen from "../screens/SearchScreen";

const Stack = createStackNavigator();

export const AppNavigator = () => (
  <Stack.Navigator>
    <Stack.Screen
      name="Home"
      component={HomeScreen}
      options={{ title: "News App" }}
    />
    <Stack.Screen
      name="Detail"
      component={DetailScreen}
      options={{ title: "Article Detail" }}
    />
    <Stack.Screen
      name="Search"
      component={SearchScreen}
      options={{ title: "Search News" }}
    />
  </Stack.Navigator>
);
