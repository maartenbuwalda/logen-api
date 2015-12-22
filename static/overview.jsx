import React from 'react';

class Overview extends React.Component {
  render() {
    return (
      <div>
        <h1>Welcome, <%= user.facebook.name %></h1>
        <h2>To do</h2>
        <div class="item-insert">
          <input class="item-insert--input" type="text"/>
          <input type="submit" value="Submit"/>
        </div>
      </div>
    )
  }
});

export default Overview;

import ReactDOM from 'react-dom';
ReactDOM.render(<Overview/>, document.getElementById('content'));