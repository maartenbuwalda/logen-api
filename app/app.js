import React from 'react';
import ReactDOM from 'react-dom';
import Profile from './components/profile';
import TaskInput from './components/task-input';
import ItemList from './components/item-list';

class App extends React.Component{

  constructor(props, context){
    super(props, context);
    this.getItemList();
    this.state = {
      tasks: []
    };
  }

  getItemList(){
    var self = this;
    var url = "http://localhost:8080/users/" + window.user.id + "/tasks"
    $.get(url,
      function(data){
        self.setState(function(previousState, currentProps) {
          return {
            tasks: data
          };
        });
        // self.state.tasks = data;
      }
    )
  }

  render(){
    return <div>
      <h1>Hello {window.user.name}</h1>
      <Profile/>
      <TaskInput tasks={this.state.tasks} />
      <ItemList tasks={this.state.tasks} />
    </div>
  }
};

ReactDOM.render(<App/>, document.getElementById('content'));