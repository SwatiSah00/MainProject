/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow
 */

import React, {Component} from 'react';
import {TextInput, StyleSheet, Text, View, Animated, StatusBar  } from 'react-native';
import { Input, Header, Divider  } from 'react-native-elements';
//import ChatMessage from './ChatMessage'
import io from 'socket.io-client';


//const instructions = Platform.select({
//  ios: 'Press Cmd+R to reload,\n' + 'Cmd+D or shake for dev menu',
//  android:
//    'Double tap R on your keyboard to reload,\n' +
//    'Shake or press menu button for dev menu',
//});

//type Props = {};

class FloatingLabelInput extends Component {
  state = {
    isFocused: false,
  };

  componentWillMount() {
    this._animatedIsFocused = new Animated.Value(this.props.value === '' ? 0 : 1);
  }

  handleFocus = () => this.setState({ isFocused: true });
  handleBlur = () => this.setState({ isFocused: false });

  componentDidUpdate() {
    Animated.timing(this._animatedIsFocused, {
      toValue: (this.state.isFocused || this.props.value !== '') ? 1 : 0,
      duration: 200,
    }).start();
  }

  render() {
    const { label, ...props } = this.props;
    const labelStyle = {
      position: 'absolute',
      left: 0,
      top: this._animatedIsFocused.interpolate({
        inputRange: [0, 1],
        outputRange: [18, 0],
      }),
      fontSize: this._animatedIsFocused.interpolate({
        inputRange: [0, 1],
        outputRange: [20, 14],
      }),
      color: this._animatedIsFocused.interpolate({
        inputRange: [0, 1],
        outputRange: ['#aaa', '#000'],
      }),
    };
    return (
      <View style={{ paddingTop: 18 }}>
        <Animated.Text style={labelStyle}>
          {label}
        </Animated.Text>
        <TextInput
          {...props}
          style={{ height: 50, fontSize: 20, color: '#000', borderBottomWidth: 1, borderBottomColor: '#555' }}
          onFocus={this.handleFocus}
          onBlur={this.handleBlur}
          blurOnSubmit
        />
      </View>
    );
  }
}

class _from extends Component {
  render() {
    return (
      <View style={{ fontSize: 20, backgroundColor: '#fff'}}>
        <Text>{this.props._name}</Text>
      </View>
    );
  }
}

export default class App extends Component {
  constructor(props){
    super(props);
    this.state = {
        chatMessage: "",
        //To show all the messages in the app
        chatMessages: [],
        value: "",
        Name:"",
        Prev_name:"",
        _state:""
    };
  }

  handleTextChange = (newText) => this.setState({ value: newText });

  componentDidMount(){
    this.socket = io("http://192.168.1.99:3000");
    // listener for the event
    this.socket.on("User_Name", name =>{
        //console.log(this.state.chatMessages)
        this.setState({ Prev_name: name});
        this.socket.emit("debug1", this.state.Name);
//        this.setState({Name:""});
    });
    this.socket.on("chat message", msg =>{
        //console.log(this.state.chatMessages)
        this.socket.emit("From", this.state.Prev_name);
        this.socket.emit("To", this.state.Prev_name);

//        if (msg.indexOf(' ') == 0 || msg == ''){
//            this.socket.emit("debug2", this.state.Name);
//        }
//        else{
        this.socket.on("From", from_name =>{
            this.socket.on("To",to_name => {
                if (from_name == to_name){
                    this.setState({ chatMessages: [...this.state.chatMessages, msg]});
                    this.setState({_state:'Message entered same name'});
                } else if (from_name != to_name){
                    this.setState({ chatMessages: [...this.state.chatMessages, this.state.Prev_name]});
                    this.setState({ chatMessages: [...this.state.chatMessages, msg]});
                    this.setState({_state:'Message entered'});
                }
            })
        })
//            }
    });

  }

  submitChatMessage(){
    //this submits the message to the socket io
//    this.setState({Prev_name:""});
    this.socket.emit("user", this.state.Name);
    this.socket.emit("debug5", this.state._state);
//    this.setState({Name:""});
    this.socket.emit("chat message", this.state.chatMessage);
    //sets back to none to capture the next message
    this.setState({chatMessage:""});
//    this.setState({Prev_name:""});
//    this.setState({Name:""});
  }

  submitName(){
//    this.setState({Prev_name:""});
//    this.socket.emit("user", this.state.Name);
    this.setState({_state:'submitName'});
    this.socket.emit("debug6", this.state.value);
//    this.setState({Name:""});
    this.setState({chatMessage:""});
//    this.setState({Name:""});
  }

  render() {
    const chatMessages = this.state.chatMessages.map(chatMessage =>(
        <Text>
        {chatMessage}
        </Text>
    ));

    return (
      <View style={styles.container}>
        <Header
//          leftComponent={{ icon: 'menu', color: '#fff' }}
          centerComponent={{ text: 'Chat App', style: { fontSize: 30, color: '#fff' } }}
//          rightComponent={{ icon: 'home', color: '#fff' }}
        />
        <StatusBar hidden />
        <FloatingLabelInput
          label="Enter your name..."
          value={this.state.value}
          onSubmitEditing={() => this.submitName(
            this.setState({Name:this.state.value}),
          )}
          onChangeText={this.handleTextChange}
        />
        <Divider
          style ={{ height: 5, backgroundColor: 'black'}}
        />
        <StatusBar hidden />
        <FloatingLabelInput
          label="Type and Press enter..."
          value = {this.state.chatMessage}
          // message only submits when pressed entered
          onSubmitEditing={() => this.submitChatMessage(
//            this.setState({Name:this.state.value}),
            this.setState({_state:"submitChatMessage"}),
          )}
          // to show when ever a messages is entered
          onChangeText ={chatMessage => {
            // the state captures the latest message
            this.setState({_state:"newChatMessage"});
            this.setState({chatMessage});
          }}
        />
       {chatMessages}
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5FCFF',
  },
  wordBold: {
    fontWeight: 'bold',
    color: 'black'
  },
});
