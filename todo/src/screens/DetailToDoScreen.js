
import React, { Component } from 'react';
import { Text, View, TouchableOpacity, StyleSheet, ScrollView, FlatList, Alert } from 'react-native';
import { styles } from '../shared/styles';
import { ListItem, Button, Icon } from 'react-native-elements';
import Dialog from "react-native-dialog";
import Config from '../shared/config';

class DetailToDoScreen extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            todoItemsList: []
        }
        this.goBackToScreen = this.goBackToScreen.bind(this);
        this.addNewListItem = this.addNewListItem.bind(this);

    }



    deleteItem(item) {
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

        this.deleteItemService(this.state.deleteItem.id)
    };

    async deleteItemService(id) {
        this.setState({ isLoading: true })
        let url = `${Config.url}api/todo/todo/${id}`;
        fetch(url, {
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
                    this.getTodoItems();
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

    static navigationOptions = ({ navigation }) => {
        return {
            title: navigation.getParam('listItem').list_name + " Items",
            // headerRight: (
            //     <View style={styles.iconContainer}>
            //         <Button
            //             raised
            //             // icon={{ name: 'crash' }}
            //             title='Delete List'
            //             onPress={() => this.deleteListDialog}
            //         />
            //     </View>
            // )
        };
    }

    componentDidMount() {
        //Here is the Trick
        const { navigation } = this.props;
        this.focusListener = navigation.addListener('willFocus', () => { // didFocus
            //   this.setState({ count: 0 });
            this.getTodoItems();
        });
    }

    _keyExtractor = (item, index) => item.id.toString();

    renderItem = ({ item, index }) => (
        <ListItem
            // key={item.id.toString()}
            title={item.subject}
            onPress={() => this.goBackToScreen(item)}
            leftIcon={{ name: item.icon }}
            title={item.subject}
            subtitle={item.description}
            rightIcon={
                <Icon
                    // raised 
                    //name='dropbox'
                    //name='share'
                    name='delete'
                    //type='font-awesome'
                    type='material-community'
                    color='red'
                    //onPress={() => this.deleteList}
                    onPress={() => this.deleteItem(item)}
                />

            }
        />
    )

    getTodoItems() {
        let url = `${Config.url}api/todo/todo/${this.props.navigation.state.params.listItem.id}`;
        console.log('fetching items')
        fetch(url, {
            method: 'GET', // or 'PUT'
            // body: JSON.stringify(data), // data can be `string` or {object}!
            headers: {
                'Content-Type': 'application/json'
            },
            credentials: 'include',
        }).then(res => res.json())
            .then(res => {
                console.log(res)
                res.data.map(x => x.icon = 'alarm');
                if (res.status === true)
                    this.setState({
                        todoItemsList: res.data
                    });
                else
                    alert(res.message)
            })
            .catch(error => {
                console.log(error)
            })
    };

    goBackToScreen() {
        const { goBack } = this.props.navigation;
        goBack()
    }

    _keyExtractor = (item, index) => item.id.toString();

    addNewListItem() {
        let item = this.props.navigation.state.params.listItem;
        console.log(item)
        this.props.navigation.navigate('AddNewListTem', { listItem: item })
    };

    render() {
        const { navigate } = this.props.navigation;
        return (
            <View
                style={[styles.container, { paddingBottom: this.state.viewPadding }]}
            >
                {
                    this.state.todoItemsList.length == 0 ?
                        (<Text >No ToDo Item found, Click on Add New ToDo Item button below</Text>) : null
                }
                <Dialog.Container visible={this.state.dialogVisible}>
                    <Dialog.Title>Delete List Item</Dialog.Title>
                    <Dialog.Description>
                        Do you want to delete this list item?
          </Dialog.Description>
                    <Dialog.Button label="Cancel" onPress={this.handleCancel} />
                    <Dialog.Button label="Delete" onPress={this.handleDelete} />
                </Dialog.Container>
                <FlatList
                    keyExtractor={this._keyExtractor}
                    data={this.state.todoItemsList}
                    renderItem={this.renderItem}
                />
                <Button
                    title="Add List Item"
                    onPress={this.addNewListItem}
                />
            </View>
        );
    }
}

export default DetailToDoScreen