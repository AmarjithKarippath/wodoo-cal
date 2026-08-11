import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { BottomTabBar } from "../components/BottomTabBar";
import { HomeScreen } from "../screens/HomeScreen";
import { NutritionScreen } from "../screens/NutritionScreen";
import { PlaceholderScreen } from "../screens/PlaceholderScreen";
import { ScannerScreen } from "../screens/ScannerScreen";
import { RootStackParamList } from "./types";

const Tab = createBottomTabNavigator();
const Stack = createNativeStackNavigator<RootStackParamList>();

function Tabs() {
  return (
    <Tab.Navigator
      tabBar={(props) => <BottomTabBar {...props} />}
      screenOptions={{ headerShown: false }}
    >
      <Tab.Screen name="Home" component={HomeScreen} />
      <Tab.Screen name="Plan">
        {() => (
          <PlaceholderScreen
            title="Plan"
            subtitle="Your weekly meal plan mockup."
          />
        )}
      </Tab.Screen>
      <Tab.Screen name="Scanner" component={ScannerScreen} />
      <Tab.Screen name="Analysis">
        {() => (
          <PlaceholderScreen
            title="Analysis"
            subtitle="Trends and insights mockup."
          />
        )}
      </Tab.Screen>
      <Tab.Screen name="Settings">
        {() => (
          <PlaceholderScreen
            title="Settings"
            subtitle="Profile and preferences mockup."
          />
        )}
      </Tab.Screen>
    </Tab.Navigator>
  );
}

export function RootNavigator() {
  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        <Stack.Screen name="Tabs" component={Tabs} />
        <Stack.Screen
          name="Nutrition"
          component={NutritionScreen}
          options={{ presentation: "modal" }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
