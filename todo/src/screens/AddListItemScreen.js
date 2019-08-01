
import React, { Component } from 'react';
import { Text, View, TouchableOpacity, StyleSheet, ScrollView, Button, TextInput } from 'react-native';
// import NavigationService from '../NavigationService';
import Config from '../shared/config';

const url = Config.url + 'api/todo/todo';

class AddListItemScreen extends React.Component {

    constructor(props) {
        super(props)
        this.state = {
            subject: '',
            description: '',
        }
        this.addNewListItem = this.addNewListItem.bind(this);
    }

    static navigationOptions = {
        title: "Add New List",
    };

    goBackToScreen() {
        const { goBack } = this.props.navigation;
        goBack()
    }

    addNewListItem() {
        let date = new Date()
        let data = {
            listId: this.props.navigation.state.params.listItem.id,
            subject: this.state.subject,
            description: this.state.description,
            completionDate: date
        };
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
                <Text >List Item</Text>
                <TextInput
                    underlineColorAndroid='#cccccc'
                    onChangeText={val => this.state.subject = val}
                />

                <Text >List Item Description</Text>
                <TextInput
                    underlineColorAndroid='#cccccc'
                    onChangeText={val => this.state.description = val}
                />

                <Button
                    title="Add List Item"
                    onPress={this.addNewListItem}
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

export default AddListItemScreen