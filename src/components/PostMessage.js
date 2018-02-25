import React, { Component } from 'react';

class PostMessage extends Component {
  constructor(props) {
    super(props);
    this.state = {
      postMessagePayload: null,
      errorPayload: null,
      buttonValue: '',
      messageValue: '',
      error: false,
    };
  }

  postMessage = () => {
    console.log(this.state.buttonValue);
    if (this.state.buttonValue !== '') {
      fetch('/postmessage/message/' + this.state.messageValue + '/button/' + this.state.buttonValue)
        .then(response => {
          if (!response.ok) {
            throw new Error(`status ${response.status}`);
          }
          return response.json();
        })
        .then(data => {
          this.setState({
            postMessagePayload: JSON.stringify(data, null, 2),
            error: false,
          });
        })
        .catch(e => {
          this.setState({
            errorPayload: `API call failed: ${e}`,
            error: true,
          });
        });
    } else {
      fetch('/postmessage/message/' + this.state.messageValue)
        .then(response => {
          if (!response.ok) {
            throw new Error(`status ${response.status}`);
          }
          return response.json();
        })
        .then(data => {
          this.setState({
            postMessagePayload: JSON.stringify(data, null, 2),
            error: false,
          });
        })
        .catch(e => {
          this.setState({
            errorPayload: `API call failed: ${e}`,
            error: true,
          });
        });
    }
  };

  renderHighlight = (data, title) => {
    if (!this.state.error) {
      if (data) {
        return (
          <div>
            <p>{title}</p>
            <div>{data}</div>
          </div>
        );
      }
    } else {
      return (
        <div>
          <p>{title}</p>
          <div>{this.state.errorPayload}</div>
        </div>
      );
    }
    return;
  };

  handleButtonChange = event => {
    this.setState({ buttonValue: event.target.value });
    console.log(this.state.buttonValue);
  };

  handleMessageChange = event => {
    this.setState({ messageValue: event.target.value });
    console.log(this.state.messageValue);
  };

  render() {
    return (
      <div>
        <div className="parameters">
          <label>
            Message:
            <input
              className="parameter-input"
              type="text"
              value={this.state.messageValue}
              onChange={this.handleMessageChange}
            />
          </label>
          <label>
            Button:
            <input
              className="parameter-input"
              type="text"
              value={this.state.buttonValue}
              onChange={this.handleButtonChange}
            />
          </label>
        </div>
        <button className="btn btn-primary" onClick={this.postMessage}>
          Post Message
        </button>
        {this.renderHighlight(this.state.postMessagePayload, 'Post Message response payload: ')}
      </div>
    );
  }
}

export default PostMessage;
