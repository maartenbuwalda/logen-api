import React from 'react';
import ReactDOM from 'react-dom';
import moment from 'moment';

var App = React.createClass({

  render: function(){
    return (
      <div>
        <h1>Hello {window.user.name}</h1>
        <Profile/>
        <ToDoList/>
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

  getInitialState(){
    this._getItemList();
    return {
      done: [],
      tasks: []
    };
  },

  componentWillReceiveProps: function(nextProps) {
    // Gets called when receiving the tasks from the ajax request
    this.setState({
      done: this.state.done,
      tasks: nextProps.tasks
    });
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

  _update(){
    // Gets called on every change in the input fields
    this.setState({
      tasks: this.state.tasks,
      done: this.state.done,
      currentItem: {
        item_key: this.state.tasks.length + moment().unix(),
        name: this.refs.name.value,
        description: this.refs.description.value,
        importance: this.refs.importance.value,
        time_created: JSON.stringify(moment()),
        status: "to do",
        user_id: window.user.id,
      }
    })
  },

  _deleteItem(i){
    var url = "http://localhost:8080/tasks/" + i;

    this._moveFromList(i, "remove");

    $.ajax({
      url: url,
      type: "DELETE",
      success: function(result){
        console.log(result)
      }
    });
  },

  _doneItem(i){
    var url = "http://localhost:8080/tasks/" + i._id;

    i.status = "done";

    this._moveFromList(i._id, "done");

    $.ajax({
      url: url,
      type: "PUT",
      data: {
        "status": "done"
      },
      success: function(result){
        console.log(result)
      }
    });
  },

  _moveFromList(i, action){
    var self = this;
    var count = 0;
    var tasks = this.state.tasks;
    var done = this.state.done;

    if(action === "remove"){
      tasks.forEach(function(item){
        if (i === item._id) {
          tasks.splice(count, 1);
          self.setState({
            tasks: tasks,
          })
        }
        count++
      })
    }

    if (action === "done") {
      tasks.forEach(function(item){
        if (i === item._id) {
          console.log("ja")
          tasks.splice(count, 1);
          done.push(item);
          self.setState({
            tasks: tasks,
            done: done,
          })
          console.log(tasks, done)
        }
        count++
      })
    }
  },

  _editItem(i){
    console.log("Edit this item");
  },

  _addItem(e){
    var data = this.state.currentItem;
    var url = "http://localhost:8080/tasks"
    var tasks = this.state.tasks;
    var filledIn = (
      document.getElementById('task-name').value !== "" &&
      document.getElementById('task-description').value !== "" &&
      document.getElementById('task-importance').value !== ""
    );

    if (filledIn){
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

      setTimeout(function(){
        var form = document.getElementById("input-fields");
        document.getElementById("task-name").focus();
        form.reset();
      }, 10);

      // Renew the list to get the id of the new item so it can be deleted
      this._getItemList();
    }
  },

  render(){
    var self = this;
    return (
      <div>
        <form id="input-fields">
          <input
            className="task-input"
            id="task-name"
            type="text"
            ref="name"
            onChange={this._update}
            value={this.props.name}
            placeholder="Name"
            required
          />
          <input
            className="task-input"
            id="task-description"
            type="text"
            ref="description"
            onChange={this._update}
            value={this.props.description}
            placeholder="Description"
            required
          />
          <input
            className="task-input"
            id="task-importance"
            type="number"
            ref="importance"
            onChange={this._update}
            value={this.props.importance}
            placeholder="Importance"
            required
          />
          <input
            type="submit"
            value="Submit"
            id="task-submit"
            onClick={this._addItem}
          />
        </form>
      <ul>
        {this.state.tasks.map(function(item, i){
          var boundDelete = self._deleteItem.bind(null, item._id)
          var boundDone = self._doneItem.bind(null, item)
          var boundEdit = self._editItem.bind(null, item._id)
          return (
            <li key={i}>
              <div>Name: {item.name}</div>
              <div>Description: {item.description}</div>
              <div>Importance: {item.importance}</div>
              <div>Created: {item.time_created}</div>
              <div>Status: {item.status}</div>
              <span onClick={boundEdit}> Edit </span>
              <span onClick={boundDone}> Done </span>
              <span onClick={boundDelete}> Delete </span>
            </li>
          )
        })}
      </ul>
      </div>
    )
  }
});

ReactDOM.render(<App/>, document.getElementById('content'));