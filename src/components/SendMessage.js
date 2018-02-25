import React, { Component } from 'react';
import Smooch from 'smooch';

import { subscribeToMessagePayload } from '../socket.js';
import Result from './Result.js';

class SendMessage extends Component {
  state = {
    error: false,
    errorPayload: null,
    payload: null,
  };

  componentDidMount() {
    subscribeToMessagePayload(data => this.setState({ payload: data }));
  }

  sendMessage = () => {
    Smooch.sendMessage('hello world');
  };

  render() {
    return (
      <div>
        <button className="btn btn-primary" onClick={this.sendMessage}>
          Send message as User
        </button>
        <Result
          data={this.state.payload}
          title="Webhook payload"
          error={this.state.error}
          errorPayload={this.state.errorPayload}
        />
      </div>
    );
  }
}

export default SendMessage;
