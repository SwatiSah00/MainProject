
import React, { Component } from 'react';
import { Text, View, TouchableOpacity, StyleSheet, ScrollView, Button, TextInput } from 'react-native';
// import NavigationService from '../NavigationService';
import Config from '../shared/config';

const url = Config.url + 'api/todo/myList';

class AddListScreen extends React.Component {

    constructor(props) {
        super(props)
        this.state = {
            newListName: '',
        }
        this.addNewList = this.addNewList.bind(this);
    }

    static navigationOptions = {
        title: "Add New List",
    };

    goBackToScreen() {
        const { goBack } = this.props.navigation;
        goBack()
    }

    addNewList() {
        let data = {
            listName: this.state.newListName,
        }
        console.log(url)
        fetch(url, {
            method: 'POST', // or 'PUT'
            body: JSON.stringify(data), // data can be `string` or {object}!,
            headers: {
                'Content-Type': 'application/json',
            },
            credentials: 'include'
        }).then(res => res.json())
            .then(res => {
                console.log(res)
                if (res.status === true) {
                    alert("Success");
                    this.goBackToScreen();
                }
                else
                    alert(res.message)
            })
            .catch(error => {
                console.log(error);
                alert("Network error")
            })
    }


    render() {
        return (
            <View style={styles.container}>
                <Text >List Name</Text>
                <TextInput
                    underlineColorAndroid='#cccccc'
                    onChangeText={val => this.state.newListName = val}
                />

                <Button
                    title="Add List"
                    onPress={this.addNewList}
                />
            </View>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        // justifyContent: 'center',
        padding: 10
    }
})

export default AddListScreen