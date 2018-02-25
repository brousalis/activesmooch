import React, { Component } from 'react';
import Smooch from 'smooch';

class Conversation extends Component {
  state = {
    message: 'testing',
    payload: null,
    error: false,
  };

  componentDidMount() {
    Smooch.on('message:received', payload => {
      console.log('received', payload);
    });

    Smooch.on('message', payload => {
      console.log('all messages', payload);
    });
  }

  postMessage = () => {
    const { message } = this.state;

    fetch('/message', {
      method: 'post',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ message }),
    })
      .then(response => response.json())
      .then(data => {
        this.setState({ payload: JSON.stringify(data, null, 2), error: false });
      })
      .catch(e => {
        this.setState({ error: `API call failed: ${e}` });
      });
  };

  handleSubmit = event => {
    event.preventDefault();
    this.postMessage();
  };

  handleChange = (type, event) => {
    this.setState({ [type]: event.target.value });
  };

  render() {
    const { user, conversation } = this.props;

    if (!user) return null;

    return (
      <div className="conversation bg-white border rounded">
        {this.state.error}
        <div className="card-header">
          <h3 className="mb-0 d-block">Current User: {user._id}</h3>
          <h4 className="mb-0 d-block">
            <small>{user.clients[0].info.userAgent}</small>
          </h4>
        </div>
        <div className="card-body overflow-auto">
          <div className="row justify-content-start">
            <div className="col-auto">
              <div className="card bg-light">
                <div className="card-body p-2">
                  <p className="mb-0">Agreed, their after-sales support is second-to-none.</p>
                  <div>
                    <i className="icon-check text-small" />
                    <small className="opacity-60">1:08pm</small>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="row justify-content-end text-right">
            <div className="col-auto">
              <div className="card bg-primary text-white">
                <div className="card-body p-2">
                  <p className="mb-0">Same! The guys at Medium Rare are also top blokes</p>
                  <div>
                    <i className="icon-check text-small" />
                    <small className="opacity-60">1:07pm</small>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="card-footer bg-lightgray">
          <form className="d-flex align-items-center" onSubmit={this.handleSubmit}>
            <div className="input-group input-group-lg">
              <input
                onChange={e => this.handleChange('message', e)}
                className="form-control"
                type="text"
                placeholder="Type a message..."
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
