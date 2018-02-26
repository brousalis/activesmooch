import React, { Component } from 'react';
import Smooch from 'smooch';

import Conversation from './Conversation';
import GetUser from './GetUser';

class App extends Component {
  state = {
    user: null,
    conversation: null,
  };

  componentDidMount() {
    // init smooch for 'user'
    Smooch.init({
      appId: process.env.REACT_APP_SMOOCH_ID,
      // configBaseUrl: 'https://api.smooch.io/sdk',
    }).then(() => {
      Smooch.open();
    });

    Smooch.on('ready', () => {
      // grab initial user/convo
      let user = Smooch.getUser();

      if (!user) {
        Smooch.sendMessage('hello world');
      }

      user = Smooch.getUser();
      const conversation = Smooch.getConversation();

      this.setState({ user, conversation });

      // webhook for conversations
      Smooch.on('message', message => {
        const { conversation } = this.state;
        const user = Smooch.getUser();
        conversation.messages.push(message);
        this.setState({ user, conversation });
      });
    });
  }

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
