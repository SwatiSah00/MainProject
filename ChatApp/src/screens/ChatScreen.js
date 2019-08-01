import React, { Component } from 'react';
import {
    StyleSheet,
    Text,
    View,
    TouchableOpacity,
    Image,
    Alert,
    ScrollView,
    TextInput,
    FlatList,
    Button,
    YellowBox,
    ToastAndroid
} from 'react-native';
import { Icon } from 'react-native-elements';
import Config from '../shared/config';
import io from 'socket.io-client';

YellowBox.ignoreWarnings(['Remote debugger']);

export default class ChatScreen extends Component {

    constructor(props) {
        super(props);
        this.state = {

            friends: [],
            selectedFriend: null,
            messages: []
        };
        this.sendMessage = this.sendMessage.bind(this)
        this.socket = null;
    }

    static navigationOptions = ({ navigation }) => {
        return {
            title: navigation.getParam('listItem').name,
        };
    }

    renderDate = (_date) => {
        var d = new Date(_date);

        return (
            <Text style={styles.time}>
                {d.toLocaleTimeString('en-US')}
            </Text>
        );
    }

    componentDidMount() {
        //Here is the Trick
        const { navigation } = this.props;

        this.focusListener = navigation.addListener('willFocus', () => { // didFocus
            //   this.setState({ count: 0 });
            this.setState({
                friends: navigation.getParam('friends'),
                selectedFriend: navigation.getParam('listItem')
            }, () => {
                this.initiateChat(this.state.selectedFriend);
            })
            // 
        });

    }

    initiateChat(friend) {
        // this.socket = SocketIOClient(Config.socketUrl);
        this.socket = io(Config.socketUrl);
        this.socket.on('connect', () => {
            console.log('Connection')
            ToastAndroid.show('Connected to socket server!', ToastAndroid.SHORT);
        });

        // listener for the event
        this.socket.on("onlineUsers", data => {
            data = data.filter(x => x.socketId != this.socket.id);

            if (data.length == 0) {
                // $("#users").text("No users active")
            }
            this.state.friends.map(x => {
                x.online = data.some(y => y.userId == x.id)
            });
            // bindUserStatus();
        });

        this.socket.emit("getMyMessages", {
            senderId: friend.id
        });

        this.socket.on("loadMessages", data => {
            this.setState({
                messages: data
            })
            for (var i = 0; i < data.length; i++) {
                //   bindMessage(_messages[i])
            }
        });
        this.socket.on("receiveMessage", data => {
            this.setState(prevState => ({
                messages: [...prevState.messages, data],
            }));
            // this.setState({ messages: [...this.state.messages, data] });
        });
    };

    _keyExtractor = (item, index) => index.toString();

    sendMessage() {
        let selectedFriend = this.state.selectedFriend;
        let _data = {
            id: Math.floor(Math.random() * 999999),
            senderId: selectedFriend.id,
            message: this.state.message,
            created_on: new Date()
        }
        this.socket.emit("sendMessage", _data);
        this.setState({
            message: null
        });
        // _data.senderId = 999999999999;
        // this.setState({ messages: [...this.state.messages, _data] });
        // this.socket.emit("getMyMessages", {
        //     senderId: selectedFriend.id
        // });
        this.setState(prevState => ({
            messages: [...prevState.messages, _data],
        }));
    }
    renderItem = ({ item, index }) => {
        let friend = this.state.selectedFriend;
        let name = null;
        let type = 'in';
        if (friend.id != item.sender_id) {
            type = 'out';
        }
        // if (this.state.friends.some(x => x.id == item.sender_id)) {
        //     let friend = this.state.friends.find(x => x.id == item.sender_id);
        //     name = `${friend.f_name} ${friend.l_name}`;
        //     type = 'in';
        // }
        // else {
        //     name = "You";
        // }
        let inMessage = type === 'in';
        let itemStyle = inMessage ? styles.itemIn : styles.itemOut;
        return (
            <View style={[styles.item, itemStyle]}>
                {!inMessage && this.renderDate(item.created_on)}
                <View style={[styles.balloon]}>
                    <Text>{item.message} - {name}</Text>
                </View>
                {inMessage && this.renderDate(item.created_on)}
            </View>
        )
    }

    render() {

        return (
            <View style={styles.container}>
                <FlatList style={styles.list}
                    ref={ref => this.flatList = ref}
                    onContentSizeChange={() => this.flatList.scrollToEnd({ animated: true })}
                    onLayout={() => this.flatList.scrollToEnd({ animated: true })}
                    data={this.state.messages}
                    keyExtractor={this._keyExtractor}
                    renderItem={this.renderItem} />
                <View style={styles.footer}>
                    <View style={styles.inputContainer}>
                        <TextInput style={styles.inputs}
                            placeholder="Write a message..."
                            underlineColorAndroid='transparent'
                            value={this.state.message}
                            onChangeText={(message) => this.setState({ message })} />
                    </View>
                    {
                        this.state.message ?
                            <TouchableOpacity style={styles.btnSend} onPress={this.sendMessage}>
                                {/*  <Image source={{ uri: "https://png.icons8.com/small/75/ffffff/filled-sent.png" }} style={styles.iconSend} />
 */}
                                <Icon
                                    // raised 
                                    //name='dropbox'
                                    //name='share'
                                    name='send'
                                    //type='font-awesome'
                                    type='material-community'
                                    color='white'
                                //onPress={() => this.deleteList}
                                />
                            </TouchableOpacity>
                            : null}
                </View>
            </View>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1
    },
    list: {
        paddingHorizontal: 17,
    },
    footer: {
        flexDirection: 'row',
        height: 60,
        backgroundColor: '#eeeeee',
        paddingHorizontal: 10,
        padding: 5,
    },
    btnSend: {
        backgroundColor: "#00BFFF",
        width: 40,
        height: 40,
        borderRadius: 360,
        alignItems: 'center',
        justifyContent: 'center',
    },
    iconSend: {
        width: 30,
        height: 30,
        alignSelf: 'center',
    },
    inputContainer: {
        borderBottomColor: '#F5FCFF',
        backgroundColor: '#FFFFFF',
        borderRadius: 30,
        borderBottomWidth: 1,
        height: 40,
        flexDirection: 'row',
        alignItems: 'center',
        flex: 1,
        marginRight: 10,
    },
    inputs: {
        height: 40,
        marginLeft: 16,
        borderBottomColor: '#FFFFFF',
        flex: 1,
    },
    balloon: {
        maxWidth: 250,
        padding: 15,
        borderRadius: 20,
    },
    itemIn: {
        alignSelf: 'flex-start'
    },
    itemOut: {
        alignSelf: 'flex-end'
    },
    time: {
        alignSelf: 'flex-end',
        margin: 15,
        fontSize: 12,
        color: "#808080",
    },
    item: {
        marginVertical: 14,
        flex: 1,
        flexDirection: 'row',
        backgroundColor: "#eeeeee",
        borderRadius: 300,
        padding: 5,
    },
});  