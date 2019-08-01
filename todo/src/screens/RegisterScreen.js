import React, { Component } from 'react';
import { Platform, StyleSheet, Text, View, TextInput, Button, Alert, ToastAndroid, AsyncStorage } from 'react-native';
import { NavigationActions, StackActions } from 'react-navigation';
import Config from '../shared/config';

const url = Config.url + 'api/todo/users';
export default class RegisterScreen extends Component {
    constructor(props) {
        super(props)
        this.state = {
            username: '',
            password: ''
        }
        this.userstore = this.userstore.bind(this);
    }
    static navigationOptions = {
        title: "Register",
    };

    userstore() {
        let data = {
            loginId: this.state.username.toLocaleLowerCase(),
            password: this.state.password
        }
        fetch(url, {
            method: 'POST', // or 'PUT'
            body: JSON.stringify(data), // data can be `string` or {object}!,
            headers: {
                'Content-Type': 'application/json',
            },
            credentials: "same-origin",
        }).then(res => res.json())
            .then(res => {
                if (res.status === true)
                    this.resetToLogin();
                else
                    alert(res.message)
            })
            .catch(error => {
                console.log(res)
            })
    }

    resetToLogin() {
        this.props
            .navigation
            .dispatch(StackActions.reset({
                index: 0,
                actions: [
                    NavigationActions.navigate({
                        routeName: 'Login',
                        //routeName: 'ListItem',
                        //routeName: 'ToDo',
                        //   params: { someParams: 'parameters goes here...' },
                    }),
                ],
            }))
    }

    render() {
        const { goBack } = this.props.navigation;
        return (
            <View style={styles.container}>
                <Text >Username</Text>
                <TextInput
                    underlineColorAndroid='#cccccc'
                    onChangeText={val => this.state.username = val}
                />
                <Text >Password</Text>
                <TextInput
                    secureTextEntry={true}
                    onChangeText={val => this.state.password = val}
                    underlineColorAndroid='#cccccc'
                />
                <Button
                    title="Add User"
                    onPress={this.userstore}
                    //onPress={() => goBack(null)}
                    color="#e91e63"
                />
            </View>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        padding: 10
    }
});