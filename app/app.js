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
        var tasks = [];
        var done = [];
        console.log(data)

        data.forEach(function(item){
          if (item.status === "done") {
            done.push(item)
          } else {
            tasks.push(item)
          }
        });

        self.setState(function(previousState, currentProps) {
          return {
            done: done,
            tasks: tasks
          };
        });
      }
    )
  },

  _update(){
    // Gets called on every change in the input fields
    this.setState({
      // tasks: this.state.tasks,
      // done: this.state.done,
      currentItem: {
        item_key: this.state.tasks.length + moment().unix(),
        name: this.refs.name.value,
        description: this.refs.description.value,
        importance: this.refs.importance.value,
        time_created: JSON.stringify(moment()),
        time_finished: "",
        rating: 0,
        status: "to do",
        user_id: window.user.id,
      }
    })
  },

  _deleteFromToDo(i){
    this._moveFromList(i, "remove", this.state.tasks);
    this._deleteItem(i);
  },

  _deleteFromDone(i){
    this._moveFromList(i, "remove", this.state.done);
    this._deleteItem(i);
  },

  _deleteItem(i){
    var url = "http://localhost:8080/tasks/" + i._id;

    $.ajax({
      url: url,
      type: "DELETE",
      success: function(result){
        console.log(result)
      }
    });
  },

  _doneItem(i, rating){
    var url = "http://localhost:8080/tasks/" + i._id;
    var finished = JSON.stringify(moment())
    i.status = "done";
    i.time_finished = finished;
    // i.rating = rating;

    this._moveFromList(i, "done");

    $.ajax({
      url: url,
      type: "PUT",
      data: {
        // "rating": i.rating,
        "time_finished": finished,
        "status": "done"
      },
      success: function(result){
        console.log(result)
      }
    });
  },

  _toDoItem(i){
    var url = "http://localhost:8080/tasks/" + i._id;

    i.status = "to-do";

    this._moveFromList(i, "to-do");

    $.ajax({
      url: url,
      type: "PUT",
      data: {
        "status": "to-do"
      },
      success: function(result){
        console.log(result)
      }
    });
  },

  _moveFromList(i, action, target){
    var self = this;
    var count = 0;
    var tasks = this.state.tasks;
    var done = this.state.done;

    if(action === "remove"){
      target.forEach(function(item){
        if (i._id === item._id) {
          target.splice(count, 1);
          self.setState({
            done: done,
            tasks: tasks,
          })
        }
        count++
      })
    }

    if (action === "done") {
      tasks.forEach(function(item){
        if (i._id === item._id) {
          tasks.splice(count, 1);
          done.push(item);
          self.setState({
            tasks: tasks,
            done: done,
          })
        }
        count++
      })
    }

    if (action === "to-do") {
      done.forEach(function(item){
        if (i._id === item._id) {
          done.splice(count, 1);
          tasks.push(item);
          self.setState({
            tasks: tasks,
            done: done,
          })
        }
        count++
      })
    }
  },

  _addItem(e){
    var data = this.state.currentItem;
    var url = "http://localhost:8080/tasks"
    var tasks = this.state.tasks;
    var filledIn = (
      document.getElementById('task-name').value !== "" &&
      document.getElementById('task-description').value !== "" &&
      document.getElementById('task-importance').value <= 10 &&
      document.getElementById('task-importance').value >= 0
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
    } else {
      console.log("error")
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
            min="0"
            max="10"
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
        <h2>To do:</h2>
        <ul>
          {this.state.tasks.map(function(item, i){
            var boundDelete = self._deleteFromToDo.bind(null, item)
            var boundDone = self._doneItem.bind(null, item)

            return (
              <li key={i}>
                <div>Name: {item.name}</div>
                <div>Description: {item.description}</div>
                <div>Importance: {item.importance}</div>
                <div>Created: {moment(JSON.parse(item.time_created)).utc().format("LLLL")}</div>
                <div>Status: {item.status}</div>
                <form>
                  <input
                    type="number"
                    min="0"
                    max="10"
                    required
                  />
                  <input
                    type="submit"
                    value="Done"
                    id="task-done"
                    onClick={boundDone}
                  />
                </form>
                <span onClick={boundDelete}> Delete </span>
              </li>
            )
          })}
        </ul>
        <h2>Done:</h2>
        <ul>
          {this.state.done.map(function(item, i){
            console.log(item)
            var boundDelete = self._deleteFromDone.bind(null, item)
            var boundToDo = self._toDoItem.bind(null, item)
            return (
              <li key={i}>
                <div>Name: {item.name}</div>
                <div>Description: {item.description}</div>
                <div>Importance: {item.importance}</div>
                <div>Created: {moment(JSON.parse(item.time_created)).utc().format("LLLL")}</div>
                <div>Finished: {moment(JSON.parse(item.time_finished)).utc().format("LLLL")}</div>
                <div>Status: {item.status}</div>
                <div>Rating: {item.rating}</div>
                <span onClick={boundToDo}> To do </span>
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