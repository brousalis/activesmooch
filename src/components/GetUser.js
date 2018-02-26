import React, { Component } from 'react';
import Result from './Result.js';

class GetUser extends Component {
  state = {
    payload: null,
    error: false,
  };

  getAppUser = () => {
    const userId = this.props.user._id;
    fetch(`/api/user/${userId}`)
      .then(response => response.json())
      .then(data => {
        this.setState({
          payload: JSON.stringify(data.appUser, null, 2),
          error: false,
        });
      })
      .catch(e => this.setState({ error: e }));
  };

  render() {
    const { user } = this.props;
    const { payload, error } = this.state;

    if (!user) return null;

    return (
      <div className="my-3">
        <button className="btn btn-primary" onClick={this.getAppUser}>
          Get User
        </button>
        <Result data={payload || error} />
      </div>
    );
  }
}

export default GetUser;
