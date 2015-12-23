import React from 'react';
import ReactDOM from 'react-dom';
import Profile from './components/profile';
import TaskInput from './components/task-input';
import ItemList from './components/item-list';

var App = React.createClass({
  getInitialState: function(){
    return {
      tasks: []
    }
  },

  render: function(){
    return <div>
      <h1>Hello {window.user.name}</h1>
      <Profile/>
      <TaskInput tasks={this.state.tasks} />
      <ItemList tasks={this.state.tasks} />
    </div>
  }
});

ReactDOM.render(<App/>, document.getElementById('content'));