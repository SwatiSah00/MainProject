import React, { Component } from 'react'
import ChatInput from './ChatInput'
import ChatMessage from './ChatMessage'
import {TextInput, StyleSheet, Text, View} from 'react-native';
import io from 'socket.io-client';


class Chat extends Component {
  state = {
    name: 'Bob',
    messages: [],
  }

    componentDidMount(){
      this.socket = io("http://192.168.1.99:3000");
      // listener for the event
      this.socket.on("chat message", msg =>{
          //console.log(this.state.chatMessages)
        const message = JSON.parse(msg.data)
        this.addMessage(message)
        //this.setState({ chatMessages: [...this.state.chatMessages, msg]});
      });
    }

  addMessage = message =>
    this.setState(state => ({ messages: [message, ...state.messages] }))

  submitMessage = messageString => {
    // on submitting the ChatInput form, send the message, add it to the list and reset the input
    const message = { name: this.state.name, message: messageString }
    this.socket.emit("chat message", JSON.stringify(message));
    this.addMessage(message)
  }

  render() {
    return (
    <View style={styles.container}>
      <div>
        <label htmlFor="name">
          Name:&nbsp;
          <input
            type="text"
            id={'name'}
            placeholder={'Enter your name...'}
            value={this.state.name}
            onChange={e => this.setState({ name: e.target.value })}
          />
        </label>
        <ChatInput
          //ws={this.ws}
          onSubmitMessage={messageString => this.submitMessage(messageString)}
        />
        {this.state.messages.map((message, index) =>
          <ChatMessage
            key={index}
            message={message.message}
            name={message.name}
          />,
        )}
      </div>
     </View>
    )
  }
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5FCFF',
  },
});
export default Chat