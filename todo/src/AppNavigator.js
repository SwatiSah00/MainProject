

import { createStackNavigator, createAppContainer } from 'react-navigation';
//import Navigator in our project

//import all the screens we are going to switch 
import LoginScreen from './screens/LoginScreen';
import HomeScreen from './screens/HomeScreen';
import DetailToDoScreen from './screens/DetailToDoScreen';
import AddListScreen from './screens/AddListScreen';
import AddListItemScreen from './screens/AddListItemScreen';
import RegisterScreen from './screens/RegisterScreen';

const App = createStackNavigator(
    {
        Login: { screen: LoginScreen },
        Register: { screen: RegisterScreen },
        Home: { screen: HomeScreen },
        DetailToDo: { screen: DetailToDoScreen },
        AddNewList: { screen: AddListScreen },
        AddNewListTem: { screen: AddListItemScreen }
    },
    {
        initialRouteName: 'Login',
    }
);
export default createAppContainer(App);