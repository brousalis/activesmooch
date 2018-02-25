import React, { Component } from 'react';

class Result extends Component {
  renderHighlight = (data, title, error, errorPayload) => {
    console.log('-----', data, title, error, errorPayload);
    if (!error) {
      if (data) {
        return (
          <div className="result">
            <p>{title}</p>
            <div>{data}</div>
          </div>
        );
      }
    } else {
      return (
        <div className="result">
          <p>{title}</p>
          <div>{errorPayload}</div>
        </div>
      );
    }
    return;
  };

  render() {
    return (
      <div>{this.renderHighlight(this.props.data, this.props.title, this.props.error, this.props.errorPayload)}</div>
    );
  }
}

export default Result;
