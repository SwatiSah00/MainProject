
import React, { Component } from 'react';
import { Platform, Text, View, TouchableOpacity, StyleSheet, ScrollView, Button, FlatList, ActivityIndicator } from 'react-native';
import { ListItem } from 'react-native-elements';
import { NavigationActions, StackActions } from 'react-navigation';
import { styles } from '../shared/styles';
// import NavigationService from '../NavigationService';
import Config from '../shared/config';


const url = Config.url + 'api/chat/users';
const logOutUrl = Config.url + 'api/chat/auth/logout';
class HomeScreen extends React.Component {

    constructor(props) {
        super(props)
        this.state = {
            isLoading: true,
            friends: []
        }

        this.logOut = this.logOut.bind(this);

    }

    static navigationOptions = {
        title: 'Friends',

    };

    navigateToChat(item) {
        this.props.navigation.navigate('Chat', {
            listItem: item,
            friends: this.state.friends
        })
    }



    componentDidMount() {
        const { navigation } = this.props;
        this.focusListener = navigation.addListener('willFocus', () => {
            this.getmylist();
        });
    }

    async logOut() {
        console.log(logOutUrl)
        fetch(logOutUrl, {
            method: 'GET', // or 'PUT'
            // body: JSON.stringify(data), // data can be `string` or {object}!,
            headers: {
                'Content-Type': 'application/json',
            },
            credentials: 'include'
        }).then(res => res.json())
            .then(res => {
                if (res.status === true) {
                    // this.rese(); //reset to login page
                    this.resetToLogin();
                }

                // else
                //     alert(res.message)
            })
            .catch(error => {
                console.log(error)
                alert("Network error")
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
                        //routeName: 'ToDo',
                        //   params: { someParams: 'parameters goes here...' },
                    }),
                ],
            }))
        // const { navigate } = this.props.navigation;
        // this.props.navigation.navigate.reset([NavigationActions.navigate({ routeName: 'Home' })], 0)
    }

    async getmylist() {
        this.setState({ isLoading: true })
        return fetch(url, {
            method: 'GET', // or 'PUT'
            // body: JSON.stringify(data), // data can be `string` or {object}!,
            headers: {
                'Content-Type': 'application/json',
            },
            credentials: 'include'
        }).then(res => res.json())
            .then(res => {
                console.log(res)

                if (res.success === true) {
                    let _data = res.data;
                    _data.map(x => {
                        x.icon = 'assignment',
                            x.name = x.f_name + " " + x.l_name,
                            x.online = false
                    });
                    this.setState({
                        friends: _data
                    })
                }
                else {
                    alert(res.message)
                }
                this.setState({
                    isLoading: false,
                })
            })
            .catch(error => {
                console.log(error)
                this.setState({ isLoading: false })
            })
    }

    _keyExtractor = (item, index) => item.id.toString();

    renderItem = ({ item, index }) => (
        // <ListItem
        //     title={item.name}
        //     // subtitle={item.subtitle}
        //     leftAvatar={{ source: { uri: item.avatar_url } }}
        // />
        <ListItem
            // key={item.id.toString()}
            title={item.name}
            onPress={() => this.navigateToChat(item)}
            leftIcon={{ name: item.icon }}
            chevronColor="white"
            chevron
        />
    )

    render() {
        const { navigate } = this.props.navigation;
        if (this.state.isLoading) {
            return (
                <View style={{ flex: 1, padding: 20 }}>
                    <ActivityIndicator />
                </View>
            )
        }
        return (
            <View
                style={[styles.container, { paddingBottom: this.state.viewPadding }]}
            >

                <FlatList
                    keyExtractor={this._keyExtractor}
                    data={this.state.friends}
                    renderItem={this.renderItem}
                />

                <Button
                    //title="Add List"
                    //onPress={this.addNewList}
                    title="Logout"
                    onPress={this.logOut}
                />
            </View>
        );
    }
}

export default HomeScreen