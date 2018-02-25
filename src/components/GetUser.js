import React, { Component } from 'react';
import Result from './Result.js';

class GetUser extends Component {
  state = {
    payload: null,
    errorPayload: null,
    error: false,
  };

  getAppUser = () => {
    fetch('/user')
      .then(response => response.json())
      .then(data => {
        if (data.status && data.status !== 200) {
          if (data.error) {
            this.setState({ error: data.error });
          }
        } else {
          this.setState({
            payload: JSON.stringify(data.appUser, null, 2),
            error: false,
          });
        }
      })
      .catch(e => {
        console.log(e);
        this.setState({ errorPayload: `HTTP request failed: ${e}`, error: true });
      });
  };

  render() {
    return (
      <div>
        <button className="btn btn-primary" onClick={this.getAppUser}>
          Get User
        </button>
        <Result
          data={this.state.payload}
          title="User payload: "
          error={this.state.error}
          errorPayload={this.state.errorPayload}
        />
      </div>
    );
  }
}

export default GetUser;
