
import React, { Component } from 'react';
import { Text, View, TouchableOpacity, StyleSheet, ScrollView, Button, TextInput } from 'react-native';
import { NavigationActions, StackActions } from 'react-navigation';
// import NavigationService from '../NavigationService';
import Config from '../shared/config';

const url = Config.url + 'api/chat/auth';

class LoginScreen extends React.Component {

    constructor(props) {
        super(props)
        this.state = {
            username: '',
            password: ''
        }
        this.authenticate = this.authenticate.bind(this);
        this.autoLogin();
    }

    static navigationOptions = {
        title: "Login",
    };

    autoLogin() {
        fetch(url + '/validateToken', {
            method: 'GET', // or 'PUT'
            // body: JSON.stringify(data), // data can be `string` or {object}!,
            headers: {
                'Content-Type': 'application/json',
            },
            credentials: 'include'
        }).then(res => res.json())
            .then(res => {
                if (res.status === true)
                    this.resetToDashboard();
                // else
                //     alert(res.message)
            })
            .catch(error => {
                console.log(error)
                alert("Network error")
            })
    }

    authenticate() {
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
                console.log(res)
                if (res.status === true) {
                    this.resetToDashboard();
                }
                else
                    alert(res.message)
            })
            .catch(error => {
                console.log(error);
                alert("Network error")
            })
    }


    resetToDashboard() {
        this.props
            .navigation
            .dispatch(StackActions.reset({
                index: 0,
                actions: [
                    NavigationActions.navigate({
                        routeName: 'Home',
                        //routeName: 'ToDo',
                        //   params: { someParams: 'parameters goes here...' },
                    }),
                ],
            }))
        // const { navigate } = this.props.navigation;
        // this.props.navigation.navigate.reset([NavigationActions.navigate({ routeName: 'Home' })], 0)
    }

    render() {
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
                    title="Login"
                    onPress={this.authenticate}
                />
                <View style={{ flex: 1, flexDirection: 'row' }}>
                    <Text >New User? </Text>
                    <TouchableOpacity style={styles.addButton} onPress={() => this.props.navigation.navigate('Register')}>
                        <Text style={styles.addButtonText}>Register</Text>
                    </TouchableOpacity>
                </View>
            </View>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        padding: 10
    },
    addButton: {
        backgroundColor: "#fff",
    },
    addButtonText: {
        color: "#e91e63",
        fontSize: 14
    }
})

export default LoginScreen