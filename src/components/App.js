import React, { Component } from 'react';
import Smooch from 'smooch';

import Conversation from './Conversation';
import GetUser from './GetUser';

const appId = process.env.REACT_APP_SMOOCH_ID;

class App extends Component {
  state = {
    user: null,
    conversation: null,
  };

  componentDidMount() {
    // init smooch for 'user' and open the window
    Smooch.init({ appId }).then(() => {
      Smooch.open();
    });

    Smooch.on('ready', () => {
      // grab initial user/convo
      const user = Smooch.getUser();

      if (!user) {
        Smooch.sendMessage('hello world');
      } else {
        this.updateConversation();
      }

      // webhook for conversations
      Smooch.on('message', message => {
        // this.updateCampaign(message);
        this.updateConversation();
      });
    });
  }

  updateCampaign = message => {
    // will need a better API endpoint, `messages` doesn't fit the needs
    const { userId } = this.props.user._id;
    fetch('/api/campaign', {
      method: 'post',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ message, userId }),
    });
  };

  updateConversation = () => {
    const user = Smooch.getUser();
    const conversation = Smooch.getConversation();
    this.setState({ user, conversation });
  };

  render() {
    const { user, conversation } = this.state;

    const props = {
      user,
      conversation,
    };

    return (
      <div>
        <section className="bg-dark text-light">
          <div className="container">
            <h2 className="py-3">ActiveSmooch</h2>
          </div>
        </section>
        <section className="my-3">
          <div className="container">
            <Conversation {...props} />
            <GetUser {...props} />
          </div>
        </section>
      </div>
    );
  }
}

export default App;
