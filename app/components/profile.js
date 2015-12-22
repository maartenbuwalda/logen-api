import React from 'react';
import ReactDOM from 'react-dom';

class Profile extends React.Component {
  render() {
    return (
      <div>
        <div class="page-header text-center">
          <h1><span class="fa fa-anchor"></span> Profile Page</h1>
          <a href="/logout" class="btn btn-default btn-sm">Logout</a>
        </div>
        <div class="row">
            <div class="col-sm-6">
                <div class="well">
                    <h3 class="text-primary"><span class="fa fa-facebook"></span> Facebook</h3>
                    <p><strong>name asd sadsa</strong>: {window.user.name}</p>
                </div>
            </div>
        </div>
      </div>
    )
  }
}


export default Profile;
// ReactDOM.render(<Profile/>, document.getElementById('profile'));