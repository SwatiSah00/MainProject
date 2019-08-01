

import { createStackNavigator, createAppContainer } from 'react-navigation';
//import Navigator in our project

//import all the screens we are going to switch 
import LoginScreen from './screens/LoginScreen';
import HomeScreen from './screens/HomeScreen';
import ChatScreen from './screens/ChatScreen';
import RegisterScreen from './screens/RegisterScreen';

const App = createStackNavigator(
    {
        Login: { screen: LoginScreen },
        Register: { screen: RegisterScreen },
        Home: { screen: HomeScreen },
        Chat: { screen: ChatScreen },
    },
    {
        initialRouteName: 'Login',
    }
);
export default createAppContainer(App);