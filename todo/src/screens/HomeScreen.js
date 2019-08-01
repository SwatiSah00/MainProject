
import React, { Component } from 'react';
import { Platform, Text, View, TouchableHighlight, StyleSheet, TouchableOpacity, ScrollView, Button, FlatList, ActivityIndicator } from 'react-native';
import { ListItem } from 'react-native-elements';
import { NavigationActions, StackActions } from 'react-navigation';
// import Icon from 'react-native-vector-icons/Ionicons';
import { Icon } from 'react-native-elements';
// import Icon from 'react-native-vector-icons/FontAwesome';
import Dialog from "react-native-dialog";
import { styles } from '../shared/styles';
// import NavigationService from '../NavigationService';
import DialogInput from 'react-native-dialog-input';
import Config from '../shared/config';


const url = Config.url + 'api/todo/myList';
const logOutUrl = Config.url + 'api/todo/auth/logout';
class HomeScreen extends React.Component {

    constructor(props) {
        super(props)
        this.state = {
            isLoading: true,
            isDialogVisible: false,
            todoLists: []
        }
        this.navigateToItems = this.navigateToItems.bind(this);
        this.addNewList = this.addNewList.bind(this);
        this.logOut = this.logOut.bind(this);
    }

    static navigationOptions = ({ navigation }) => {
        return {
            title: "Dashboard",
            // headerRight: (
            //     <View style={styles.iconContainer}>
            //         <Button title="Logout" onPress={this.logout} />
            //     </View>
            // )
        };
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

    addNewList() {
        this.props.navigation.navigate('AddNewList')
    };

    navigateToItems(item) {
        // const { navigate } = this.props;
        // navigate('DetailToDo', { listItem: item })
        this.props.navigation.navigate('DetailToDo', { listItem: item })
        // this.props.navigation.push('DetailToDo', { listItem: item });
    }

    showInputDialog(isShow) {
        this.setState({
            isDialogVisible: isShow,
        });
    }
    sendInput(inputText) {
        console.log("sendInput (DialogInput#1): " + inputText);
        this.showInputDialog(false)
        this.shareService(inputText)
    }

    shareService(shareId) {
        let data = {
            senderId: shareId,
            listId: this.state.shareItem.id
        };
        let _url = Config.url + 'api/todo/shareTodo';
        fetch(_url, {
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
                    alert("Successfully shared to user");
                }
                else
                    alert(res.message)
                this.setState({
                    shareItem: null
                })
            })
            .catch(error => {
                console.log(error);
                alert("Network error")
            })
    }

    shareList(item) {
        console.log(item);
        this.showInputDialog(true)
        this.setState({
            shareItem: item
        })
    }
    deleteList(item) {
        console.log(item);
        this.setState({
            deleteItem: item
        })
        // alert('deleting');
        this.setState({ dialogVisible: true });
        // this.deleteListService(item.id)

    }

    handleCancel = () => {
        console.log('cancelled')
        this.setState({ dialogVisible: false });
    };

    handleDelete = () => {
        console.log('Delete accepted')
        // The user has pressed the "Delete" button, so here you can do your own logic.
        // ...Your logic
        this.setState({ dialogVisible: false });

        this.deleteListService(this.state.deleteItem.id)
    };

    async deleteListService(id) {
        console.log('deleting ' + id)
        this.setState({ isLoading: true })
        return fetch(url + '/' + id, {
            method: 'DELETE', // or 'PUT'
            // body: JSON.stringify(data), // data can be `string` or {object}!,
            headers: {
                'Content-Type': 'application/json',
            },
            credentials: 'include'
        }).then(res => res.json())
            .then(res => {
                // console.log(res)
                if (res.status === true) {
                    alert("Deleted successfully");
                    this.getmylist();
                }
                else
                    alert(res.message)
                this.setState({
                    isLoading: false,
                    deleteItem: null
                })
            })
            .catch(error => {
                console.log(error)
                this.setState({ isLoading: false })
            })
    }

    componentDidMount() {
        // Keyboard.addListener(
        //     isAndroid ? "keyboardDidShow" : "keyboardWillShow",
        //     e => this.setState({ viewPadding: e.endCoordinates.height + viewPadding })
        // );

        // Keyboard.addListener( 
        //     isAndroid ? "keyboardDidHide" : "keyboardWillHide",
        //     () => this.setState({ viewPadding: viewPadding })
        // );
        const { navigation } = this.props;
        //Adding an event listner om focus
        //So whenever the screen will have focus it will set the state to zero
        this.focusListener = navigation.addListener('willFocus', () => {
            //   this.setState({ count: 0 });
            this.getmylist();
        });
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
                // console.log(res)

                if (res.status === true) {
                    let _data = res.data;
                    _data.map(x => x.icon = 'assignment');
                    this.setState({
                        todoLists: _data
                    });
                }
                else
                    alert(res.message)
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
            key={item.id.toString()}
            title={item.list_name}
            onPress={() => this.navigateToItems(item)}
            leftIcon={{ name: item.icon }}
            rightIcon={
                <View style={styles.iconContainer}>
                    {
                        item.sharable ?
                            <Icon
                                // raised 
                                //name='dropbox'
                                name='share'
                                // name='delete'
                                //type='font-awesome'
                                type='material-community'
                                // color='red'
                                //onPress={() => this.deleteList}
                                onPress={() => this.shareList(item)}
                            /> : null
                    }

                    <Icon
                        // raised 
                        //name='dropbox'
                        //name='share'
                        name='delete'
                        //type='font-awesome'
                        type='material-community'
                        color='red'
                        //onPress={() => this.deleteList}
                        onPress={() => this.deleteList(item)}
                    />

                </View>
            }
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

                {
                    this.state.todoLists.length == 0 ?
                        (<Text >No ToDo Item found, Click on Add New ToDo Item button below</Text>) : null
                }

                {/* <FlatList
                    style={styles.list}
                    keyExtractor={this._keyExtractor}
                    data={this.state.todoLists}
                    renderItem={({ item, index }) =>
                        <Button title={item.list_name} onPress={() => this.navigateToItems(item)} />
                    }
                /> */}

                <DialogInput isDialogVisible={this.state.isDialogVisible}
                    title={"DialogInput 1"}
                    message={"Message for DialogInput #1"}
                    hintInput={"HINT INPUT"}
                    submitInput={(inputText) => { this.sendInput(inputText) }}
                    closeDialog={() => { this.showInputDialog(false) }}>
                </DialogInput>
                <Dialog.Container visible={this.state.dialogVisible}>
                    <Dialog.Title>Delete List</Dialog.Title>
                    <Dialog.Description>
                        Do you want to delete this list?
          </Dialog.Description>
                    <Dialog.Button label="Cancel" onPress={this.handleCancel} />
                    <Dialog.Button label="Delete" onPress={this.handleDelete} />
                </Dialog.Container>

                <FlatList
                    keyExtractor={this._keyExtractor}
                    data={this.state.todoLists}
                    renderItem={this.renderItem}
                />
                <TouchableOpacity onPress={this.logOut} style={styles.addButton}>
                    <Text style={styles.addButtonText}>Logout</Text>
                </TouchableOpacity>
                <Button
                    title="Add List"
                    onPress={this.addNewList}
                />
            </View>
        );
    }
}

export default HomeScreen