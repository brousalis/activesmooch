import React, { Component } from 'react';
import Message from './Message';

class Conversation extends Component {
  state = {
    message: '',
    payload: null,
    error: false,
  };

  componentDidUpdate() {
    if (this.props.user) this.scrollToBottom();
  }

  scrollToBottom = () => {
    this.el.scrollTop = this.el.scrollHeight;
  };

  postMessage = () => {
    const { message } = this.state;
    const userId = this.props.user._id;

    fetch('/api/message', {
      method: 'post',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ message, userId }),
    }).catch(e => {
      this.setState({ error: `API call failed: ${e}` });
    });
  };

  handleSubmit = event => {
    event.preventDefault();
    this.setState({ message: '' });
    this.postMessage();
  };

  handleChange = (type, event) => {
    this.setState({ [type]: event.target.value });
  };

  render() {
    const { user, conversation } = this.props;
    const { message } = this.state;

    if (!user) return null;

    const userId = user._id;
    const userAgent = user.clients[0].info.userAgent;

    return (
      <div className="conversation bg-white border rounded">
        {this.state.error}

        <div className="card-header">
          <h3>Current User: {userId}</h3>
          <small>{userAgent}</small>
        </div>

        <div
          className="card-body"
          style={{ overflow: 'auto', height: 400 }}
          ref={el => {
            this.el = el;
          }}
        >
          {conversation.messages.map(message => (
            <Message key={message._id} message={message} />
          ))}
        </div>

        <div className="card-footer bg-lightgray">
          <form
            className="d-flex align-items-center"
            onSubmit={this.handleSubmit}
          >
            <div className="input-group input-group-lg">
              <input
                onChange={e => this.handleChange('message', e)}
                className="form-control"
                type="text"
                placeholder="Type a message..."
                value={message}
                name="message"
              />
            </div>
          </form>
        </div>
      </div>
    );
  }
}

export default Conversation;
