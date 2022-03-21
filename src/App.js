import React from 'react';
import 'react-native-gesture-handler';

import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';

import ToDo from './screens/toDo';
import done from './screens/done';
import Splash from './screens/splash';
import task from './screens/task'
import Camera from './screens/camera'
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';
import { Provider } from 'react-redux'
import { Store } from './redux/store'

const Tab = createBottomTabNavigator();

function homeTabs(){
  return(
    <Tab.Navigator 
      screenOptions={
        ({ route }) => ({
          // headerShown: false,
          // activeTintColor: '#0080ff',
          // inactiveTintColor: '#777777',
          // labelStyle:{fontSize:15, fontWeight: 'bold'},
          tabBarIcon:({focused, size, color}) => {
            let iconName;
            if (route.name === 'To-Do'){
              iconName = 'clipboard-list'
              size = focused ? 25 : 20;
            }else if (route.name === 'Done'){
              iconName = 'clipboard-check'
              size = focused ? 25 : 20;
            }
            return(
              <FontAwesome5
                name={iconName}
                size={size}
                color={color}
              />
            )
          }
        })
      }
      tabBarOptions={{
        activeTintColor: '#262835',
        inactiveTintColor: '#777777',
        labelStyle:{fontSize:15, fontWeight: 'bold'},
      }}
    >
      <Tab.Screen
        name={ 'To-Do' }
        component = { ToDo }
      />
      <Tab.Screen
        name={ 'Done' }
        component = { done }
      />
    </Tab.Navigator>
  )
}

const RootStack = createStackNavigator();

function App(){
 return(
   <Provider store={Store}>
    <NavigationContainer>
     <RootStack.Navigator
     initialRouteName="Splash"
    //  screenOptions={{
    //   headerShown: false
    //  }}
     >
       <RootStack.Screen
       name="Splash"
       component={ Splash }
       options ={{
        headerShown: false
       }}
       />
       <RootStack.Screen
       name="My Tasks"
       component={ homeTabs }
       options ={{
        headerShown: false
       }}
       />
       <RootStack.Screen
       name="Task"
       component={ task }
       />
       <RootStack.Screen
       name="Camera"
       component={ Camera }
       />
     </RootStack.Navigator>
   </NavigationContainer>
   </Provider>
 )
}

export default App;