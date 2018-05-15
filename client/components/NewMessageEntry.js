import React, { Component } from 'react';
import store, { writeMessage, postMessages } from '../store';
import axios from 'axios';
import socket from '../socket';
export default class NewMessageEntry extends Component {
  constructor(props) {
    super(props);
    this.state = store.getState();
    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }
  componentDidMount() {
    this.unsubscribe = store.subscribe(() => {
      this.setState(store.getState());
    });
  }

  componentWillUnmount() {
    this.unsubscribe();
  }

  handleChange(e) {
    const action = writeMessage(e.target.value);
    store.dispatch(action);
  }
  handleSubmit(e){
    e.preventDefault();
    const thunkPost = postMessages(this.state.newMessageEntry, this.props.channelId);
    store.dispatch(thunkPost);
  }
  render () {
    return (
      <form onSubmit={this.handleSubmit}
            id="new-message-form">
        <div className="input-group input-group-lg">
          <input
            className="form-control"
            type="text"
            name="content"
            placeholder="Say something nice..."
            onChange={this.handleChange}
            value={this.state.newMessageEntry}
          />
          <span className="input-group-btn">
            <button className="btn btn-default" type="submit">Chat!</button>
          </span>
        </div>
      </form>
    );
  }
}
