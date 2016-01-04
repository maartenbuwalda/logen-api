import React from 'react';
import ReactDOM from 'react-dom';
import moment from 'moment';

var App = React.createClass({
  getInitialState(){
    this._getItemList();
    return {
      tasks: []
    };
  },

  _getItemList(){
    var self = this;
    var url = "http://localhost:8080/users/" + window.user.id + "/tasks"
    $.get(url,
      function(data){
        self.setState(function(previousState, currentProps) {
          return {
            tasks: data
          };
        });
      }
    )
  },

  render: function(){
    return (
      <div>
        <h1>Hello {window.user.name}</h1>
        <Profile/>
        <ToDoList tasks={this.state.tasks} />
      </div>
    );
  }
});

var Profile = React.createClass({
  render() {
    return (
      <div>
        <a href="/logout">Logout</a>
        <p><strong>Name</strong>: {window.user.name}</p>
      </div>
    )
  }
});

var ToDoList = React.createClass({

  componentWillReceiveProps: function(nextProps) {
    // Gets called when receiving the tasks from the ajax request
    this.setState({
      tasks: nextProps.tasks
    });
  },

  _update(){
    // Gets called on every change in the input fields
    this.setState({
      tasks: this.props.tasks,
      currentItem: {
        name: this.refs.name.value,
        description: this.refs.description.value,
        importance: this.refs.importance.value,
        time_created: JSON.stringify(moment()),
        user_id: window.user.id,
      }
    })
  },

  _deleteItem(i){
    var self = this;
    var url = "http://localhost:8080/tasks/" + i;

    var tasks = this.state.tasks;
    var count = 0;

    tasks.forEach(function(item){
      if (i === item._id) {
        tasks.splice(count, 1);

        self.setState({
          tasks: tasks
        })
      }
      count++
    })

    $.ajax({
      url: url,
      type: "DELETE",
      success: function(result){
        console.log(result)
      }
    });
  },

  _addItem(e){
    if (e.which === 13) {
      var data = this.state.currentItem;
      var url = "http://localhost:8080/tasks"
      var tasks = this.state.tasks;

      tasks.push(this.state.currentItem);

      this.setState({
        tasks: tasks
      })

      $.ajax({
        url: url,
        type: "POST",
        data: data,
        success: function(result){
          console.log(result)
        }
      });
    }
  },

  render(){
    var self = this;
    return (
      <div>
        <input
          type="text"
          ref="name"
          onChange={this._update}
          value={this.props.name}
          placeholder="Name"
          onKeyDown={this._addItem}
          required
        />
        <input
          type="text"
          ref="description"
          onChange={this._update}
          value={this.props.description}
          placeholder="Description"
          onKeyDown={this._addItem}
          required
        />
        <input
          type="number"
          ref="importance"
          onChange={this._update}
          value={this.props.importance}
          placeholder="Importance"
          onKeyDown={this._addItem}
          required
        />
      <ul>
        {this.props.tasks.map(function(item, i){
          var boundClick = self._deleteItem.bind(null, item._id)
          return (
            <li key={item._id}>
              {item.name}
              <span onClick={boundClick}> Delete </span>
            </li>
          )
        })}
      </ul>
      </div>
    )
  }
});

ReactDOM.render(<App/>, document.getElementById('content'));