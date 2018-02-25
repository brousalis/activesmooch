import React, { Component } from 'react';
import Smooch from 'smooch';

import StartConvo from './StartConvo';
import PostMessage from './PostMessage';
import GetAppUser from './GetAppUser';

console.log(process.env);
const APP_ID = process.env.REACT_APP_ID;
const BASE_URL = 'https://api.smooch.io/sdk';

class App extends Component {
  componentDidMount() {
    Smooch.init({ appId: APP_ID, configBaseUrl: BASE_URL }).then(() => {
      Smooch.open();
    });
  }

  render() {
    return (
      <div>
        <section className="bg-primary text-light">
          <div className="container">
            <h1 className="display-5 pt-3">ActiveSmooch</h1>
          </div>
          <svg
            className="d-block"
            style={{ height: '2rem', width: '100%' }}
            preserveAspectRatio="none"
            viewBox=" 0 0 100 100"
          >
            <polygon fill="#F8F9FB" points="0 100 100 100 100 0" />
          </svg>
        </section>

        <section className="mt-3">
          <div className="container">
            <div className="row">
              <div className="col-12 mb-5">
                <StartConvo />
              </div>
              <div className="col-12 mb-5">
                <PostMessage />
              </div>
              <div className="col-12">
                <GetAppUser />
              </div>
            </div>
          </div>
        </section>
      </div>
    );
  }
}

export default App;
