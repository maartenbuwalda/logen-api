import React from 'react';
import ReactDOM from 'react-dom';

class Profile extends React.Component {
  render() {
    return (
      <div>
        <a href="/logout">Logout</a>
        <p><strong>Name</strong>: {window.user.name}</p>
      </div>
    )
  }
}


export default Profile;