import React, { Component } from 'react';
import Smooch from 'smooch';

import SendMessage from './SendMessage';
import Conversation from './Conversation';
import GetUser from './GetUser';

class App extends Component {
  state = {
    user: null,
    conversation: null,
  };

  componentDidMount() {
    Smooch.init({
      appId: process.env.REACT_APP_SMOOCH_ID,
      configBaseUrl: 'https://api.smooch.io/sdk',
    }).then(() => {
      Smooch.open();
    });

    Smooch.on('ready', () => {
      console.log('smooch init');

      const user = Smooch.getUser();
      const conversation = Smooch.getConversation();

      this.setState({ user, conversation });

      console.log(user, conversation);
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
            <SendMessage {...props} />
          </div>
        </section>
      </div>
    );
  }
}

export default App;
