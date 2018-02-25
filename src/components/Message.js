import React from 'react';
import moment from 'moment';

export default ({ message }) => {
  const isUser = message.role === 'appUser';
  return (
    <div
      key={message._id}
      className={`row mb-2 ${
        isUser ? 'justify-content-start' : 'justify-content-end text-right'
      }`}
    >
      <div className="col-auto">
        <div className={`card ${isUser ? 'bg-light' : 'bg-dark text-white'}`}>
          <div className="card-body p-2">
            <div>{message.text}</div>
            <small>{moment.unix(message.received).fromNow()}</small>
          </div>
        </div>
      </div>
    </div>
  );
};
