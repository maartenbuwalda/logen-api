import React from 'react';
import ReactDOM from 'react-dom';
import Profile from './profile'

class Overview extends React.Component {
  render() {
    return <div>
      <h1>Hello {window.user.name}</h1>
      <Profile/>
    </div>
  }
}

ReactDOM.render(<Overview/>, document.getElementById('overview'));