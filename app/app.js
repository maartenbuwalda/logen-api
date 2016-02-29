import React from 'react';
import ReactDOM from 'react-dom';
import moment from 'moment';
import d3 from 'd3';

var host = "http://localhost:8080";
var App = React.createClass({

  getInitialState(){
    this._getData();
    return {
      done: [],
      tasks: [],
      categories: [{name: "Study"}, {name: "Work"}, {name: "Sports"}, {name: "Other"}]
    };
  },

  _getData(){
    var self = this;
    var url = host + "/users/" + window.user.id + "/tasks"
    $.get(url,
      function(data){
        var tasks = [];
        var done = [];

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

  render: function(){
    return (
      <div>
        <h1>Hello {window.user.name}</h1>
        <Profile/>
        <ToDoList getData={this._getData} data={this.state}/>
        <Overview getData={this._getData} data={this.state}/>
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

  newItem: {},

  _update(){
    // Gets called on every change in the input fields
    this.newItem = {
      item_key: this.props.data.tasks.length + moment().unix(),
      name: this.refs.name.value,
      description: this.refs.description.value,
      importance: this.refs.importance.value,
      time_created: JSON.stringify(moment().format('dddd')),
      rating: "",
      status: "to-do",
      user_id: window.user.id,
    }
  },

  _deleteFromToDo(i){
    this._moveFromList(i, "remove", this.props.data.tasks);
    this._deleteItem(i);
  },

  _deleteFromDone(i){
    this._moveFromList(i, "remove", this.props.data.done);
    this._deleteItem(i);
  },

  _deleteItem(i){
    var url = host + "/tasks/" + i._id;

    $.ajax({
      url: url,
      type: "DELETE",
      success: function(result){
        console.log(result)
      }
    });
  },

  _doneItem(i){
    var self = this;
    var url = host + "/tasks/" + i._id;
    var finished = JSON.stringify(moment().format('dddd'))

    i.status = "done";
    i.time_finished = finished;

    $.ajax({
      url: url,
      type: "PUT",
      data: {
        "rating": i.rating,
        "time_finished": i.time_finished,
        "status": i.status
      },
      success: function(result){
        self._moveFromList(i, "done");
        console.log(result)
      }
    });
  },

  _toDoItem(i){
    var url = host + "/tasks/" + i._id;

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
    var tasks = this.props.data.tasks;
    var done = this.props.data.done;

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
    var data = this.newItem;
    var url = host + "/tasks"
    var tasks = this.props.data.tasks;
    var filledIn = (
      document.getElementById('task-name').value !== "" &&
      document.getElementById('task-description').value !== "" &&
      document.getElementById('task-importance').value <= 10 &&
      document.getElementById('task-importance').value >= 0
    );

    if (filledIn){
      tasks.push(this.newItem);

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
      this.props.getData();
    } else {
      console.log("error")
    }
    return false;
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
          <select
            className="task-input"
            id="task-description"
            type="select"
            ref="description"
            onChange={this._update}
            required
          >
            {this.props.data.categories.map(function(item, i){
                return <option key={i} value={item.name}>{item.name}</option>
              })
            }
          </select>
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
          {this.props.data.tasks.map(function(item, i){
            return <ToDoItem delete={self._deleteFromToDo} move={self._doneItem} data={item} key={i}/>
          })}
        </ul>
        <h2>Done:</h2>
        <ul>
          {this.props.data.done.map(function(item, i){
            return <ToDoItem delete={self._deleteFromDone} move={self._toDoItem} data={item} key={i}/>
          })}
        </ul>
      </div>
    )
  }
});

var ToDoItem = React.createClass({

  _setRating(rating){
    this.props.data.rating = rating;
  },

  render(){
    var actions;
    var boundDelete = this.props.delete.bind(null, this.props.data)
    if (this.props.data.status === "to-do") {
      actions = <ToDoActions move={this.props.move} setRating={this._setRating} data={this.props.data} />;
    }
    if (this.props.data.status === "done") {
      actions = <DoneActions move={this.props.move} setRating={this._setRating} data={this.props.data} />;
    }

    return (
      <li key={this.props.key}>
        <div>Name: {this.props.data.name}</div>
        <div>Description: {this.props.data.description}</div>
        <div>Importance: {this.props.data.importance}</div>
        <div>Created: {this.props.data.time_created}</div>
        <div>Status: {this.props.data.status}</div>
        {actions}
        <span onClick={boundDelete}> Delete </span>
      </li>
    )
  }
});


var ToDoActions = React.createClass({

  componentWillReceiveProps(nextProps){
    this.setState({
      data: nextProps
    })
  },

  _update(e){
    var rating = e.target.value;
    this.props.setRating(rating);
  },

  render(){
    var boundDone = this.props.move.bind(null, this.props.data)

    return (
      <form>
        <input
          type="number"
          min="0"
          max="10"
          onChange={this._update}
          required
        />
        <input
          type="submit"
          value="Done"
          id="task-done"
          onClick={boundDone}
        />
      </form>
    )
  }
});

var DoneActions = React.createClass({

  render(){
    var boundToDo = this.props.move.bind(null, this.props.data)
    return (
      <div>
        <div>Finished: {this.props.data.time_finished}</div>
        <div>Rating: {this.props.data.rating}</div>
        <span onClick={boundToDo}> To do </span>
      </div>
    )
  }
});

var Overview = React.createClass({

  componentWillReceiveProps(nextProps){
    var lineData = [];
    nextProps.data.done.map(function(item, i){
      lineData.push({
        x: item.description,
        y: (item.rating * item.importance)
      })
    })
    this.setState({
      data: lineData
    })
    this.createGraph();
  },

  createGraph(){
    // Set the dimensions of the canvas / graph
    var margin = {top: 30, right: 20, bottom: 30, left: 50},
        width = 600 - margin.left - margin.right,
        height = 270 - margin.top - margin.bottom;

    // Parse the date / time
    var parseDate = d3.time.format("%d-%b-%y").parse;

    // Set the ranges
    var x = d3.time.scale().range([0, width]);
    var y = d3.scale.linear().range([height, 0]);

    // Define the axes
    var xAxis = d3.svg.axis().scale(x)
        .orient("bottom").ticks(5);

    var yAxis = d3.svg.axis().scale(y)
        .orient("left").ticks(5);

    // Define the line
    var valueline = d3.svg.line()
        .x(function(d) { return x(d.date); })
        .y(function(d) { return y(d.close); });

    // Adds the svg canvas
    var svg = d3.select("graph")
        .append("svg")
            .attr("width", width + margin.left + margin.right)
            .attr("height", height + margin.top + margin.bottom)
        .append("g")
            .attr("transform",
                  "translate(" + margin.left + "," + margin.top + ")");
    // Get the data
    d3.json(this.state.data, function(error, data) {
        data.forEach(function(d) {
            d.date = parseDate(d.date);
            d.close = +d.close;
        });

        // Scale the range of the data
        x.domain(d3.extent(data, function(d) { return d.date; }));
        y.domain([0, d3.max(data, function(d) { return d.close; })]);

        // Add the valueline path.
        svg.append("path")
            .attr("class", "line")
            .attr("d", valueline(data));

        // Add the X Axis
        svg.append("g")
            .attr("class", "x axis")
            .attr("transform", "translate(0," + height + ")")
            .call(xAxis);

        // Add the Y Axis
        svg.append("g")
            .attr("class", "y axis")
            .call(yAxis);
    });

  },

  render(){
    return (
      <div id="graph">test</div>
    )
  }
});

ReactDOM.render(<App/>, document.getElementById('list'));