import { NavigationContainer, useNavigation } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { createDrawerNavigator } from '@react-navigation/drawer';

import { SidebarWrapper } from './Presentational/SidebarWrapper/SidebarWrapper';

const Stack = createStackNavigator();
const Drawer = createDrawerNavigator();

function NodeView() {
  const navigation = useNavigation();
  return (
    <Stack.Navigator>
      <Stack.Screen name="NodeView" component={NodeView} />
      <Stack.Screen name="Logs" component={Logs} />
      {/* navigation.navigate('NodeView') */}
    </Stack.Navigator>
  );
}

function Home() {
  return (
    <Drawer.Navigator drawerContent={(props) => <SidebarWrapper {...props} />}>
      <Drawer.Screen name="Node View" component={NodeView} />
      <Drawer.Screen name="Notification View" component={NotificationView} />
      <Drawer.Screen name="System Monitor View" component={SystemMonitorView} />
    </Drawer.Navigator>
  );
}

const Routes = () => {
  const sHasSeenSplashscreen = true;
  return (
    <NavigationContainer>
      <Stack.Navigator>
        {sHasSeenSplashscreen ? (
          <Stack.Screen name="Home" component={Home} />
        ) : (
          <Stack.Screen name="Node Setup Flow" component={NodeSetupFlow} />
        )}
      </Stack.Navigator>
      ;
    </NavigationContainer>
  );
};

export default Routes;
