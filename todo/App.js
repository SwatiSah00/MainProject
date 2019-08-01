// import { getStatusBarHeight } from 'react-native-status-bar-height';
// import React from 'react';
// import { Platform, StatusBar, StyleSheet, View, Text, Dimensions, AsyncStorage, Alert } from 'react-native';
// import RootStackNavigator from './src/RootNavigator';

// class App extends React.Component {
//   render() {
//     return (
//       <RootStackNavigator />
//     );
//   }
// }

// export default App;


//Example to Refresh Previous Screen When Going Back in React Navigation//
import React, { Component } from 'react';
//import react in our code. 
import { createStackNavigator, createAppContainer } from 'react-navigation';
//import Navigator in our project

import FirstPage from './src/screens/FirstPage';
import SecondPage from './src/screens/SecondPage';
//import all the screens we are going to switch 

const App = createStackNavigator({
  FirstPage: { screen: FirstPage },
  SecondPage: { screen: SecondPage },
},
  {
    initialRouteName: 'FirstPage',
  }
);
export default createAppContainer(App);