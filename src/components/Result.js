import React from 'react';
import Highlight from 'react-highlight';

export default ({ data }) => {
  if (!data) return null;
  return (
    <div className="my-3" style={{ height: 400, overflow: 'auto' }}>
      <Highlight className="JSON">{data}</Highlight>
    </div>
  );
};
