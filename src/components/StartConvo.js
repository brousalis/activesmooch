import React, { Component } from 'react';
import Smooch from 'smooch';

import { subscribeToMessagePayload } from '../socket.js';
import Result from './Result.js';

class StartConvo extends Component {
  state = {
    error: false,
    errorPayload: null,
    appUserMessagePayload: null,
  };

  componentDidMount() {
    subscribeToMessagePayload(data =>
      this.setState({
        appUserMessagePayload: data,
      })
    );
  }

  sendYo = () => {
    Smooch.sendMessage('yo');
  };

  render() {
    return (
      <div>
        <button className="btn btn-primary" onClick={this.sendYo}>
          Send yo
        </button>
        <Result
          data={this.state.appUserMessagePayload}
          title="Webhook payload (message part): "
          error={this.state.error}
          errorPayload={this.state.errorPayload}
        />
      </div>
    );
  }
}

export default StartConvo;
