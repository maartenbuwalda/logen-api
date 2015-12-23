import React from 'react';
import ReactDOM from 'react-dom';
import Profile from './components/profile';
import TaskInput from './components/task-input';
import ItemList from './components/item-list';

class App extends React.Component {
  render() {
    return <div>
      <h1>Hello {window.user.name}</h1>
      <Profile/>
      <TaskInput/>
      <ItemList/>
    </div>
  }
}

ReactDOM.render(<App/>, document.getElementById('content'));