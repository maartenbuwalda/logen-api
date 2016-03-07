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
            tasks: tasks,
            isLoaded: true
          };
        });
      }
    )
  },

  render: function(){
    let toRender;
    if (this.state.isLoaded){
      toRender = <Overview getData={this._getData} data={this.state}/>
    }else{
      toRender = "Loading..."
    }
    return (
      <div>
        <h1>Hello {window.user.name}</h1>
        <Profile/>
        <ToDoList getData={this._getData} data={this.state}/>
        {toRender}
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
      category: this.refs.category.value,
      importance: this.refs.importance.value,
      time_created: moment().format('dddd'),
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
    var finished = moment().format('dddd')

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
      document.getElementById('task-category').value !== "" &&
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
            id="task-category"
            type="select"
            ref="category"
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
        <div>Category: {this.props.data.category}</div>
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

  getInitialState(){
    console.log("initial state")
    return null;
  },

  _formatData(dataToFormat){
    console.log("format data")
    var week = [{name: "Monday"}, {name: "Tuesday"}, {name: "Wednesday"}, {name: "Thursday"}, {name: "Friday"}, {name: "Saturday"}, {name: "Sunday"}];
    var dataset = [];
    var categories = [];

    dataToFormat.data.categories.map(function(category, i){
      categories.push(category.name);
    });

    week.map(function(item, i){
      dataset.push({
        data: [],
        groups: [],
        name: item.name
      })
    });

    dataset.map(function(item, i){
      categories.map(function(category, i){
        item.groups.push({
          name: category,
          value: 0
        })
      })
    });

    dataToFormat.data.done.map(function(item, i){
      dataset.forEach(function(c){
        if(item.time_finished === c.name){
          c.data.push({
            category: item.category,
            score: (item.rating * item.importance)
          })
        }
      })
    })

    this.setState({
      data: dataset,
      categories: categories
    })

    this.graph._draw(dataset, categories);
  },

  componentWillMount(){
    console.log("mounted")
    this._formatData(this.props);
  },

  shouldComponentUpdate(nextProps, nextState){
    console.log("should update")
    this.graph._update();
    return false;
  },

  graph: {
    _draw(data, categories){
      console.log("drawing graph", data)

      var margin = {top: 20, right: 20, bottom: 30, left: 40},
          width = 960 - margin.left - margin.right,
          height = 500 - margin.top - margin.bottom;

      var x0 = d3.scale.ordinal()
          .rangeRoundBands([0, width], .1);

      var x1 = d3.scale.ordinal();

      var y = d3.scale.linear()
          .range([height, 0]);

      var color = d3.scale.ordinal()
          .range(["#98abc5", "#8a89a6", "#7b6888", "#6b486b"]);

      var xAxis = d3.svg.axis()
          .scale(x0)
          .orient("bottom");

      var yAxis = d3.svg.axis()
          .scale(y)
          .orient("left")
          .tickFormat(d3.format(".2s"));

      var svg = d3.select("body").append("svg")
          .attr("width", width + margin.left + margin.right)
          .attr("height", height + margin.top + margin.bottom)
        .append("g")
          .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

      data.forEach(function(d) {
        d.groups.forEach(function(group){
          d.data.forEach(function(item){
            if(item.category === group.name){
              group.value = group.value + item.score
            }
          })
        })
      });

      data.sort(function(a, b) { return b.total - a.total; });

      x0.domain(data.map(function(d) { return d.name; }));
      x1.domain(categories).rangeRoundBands([0, x0.rangeBand()]);
      y.domain([0, d3.max(data, function(d) {
        return d3.max(d.groups, function(d) {
          return d.value;
        });
      })]);

      svg.append("g")
          .attr("class", "x axis")
          .attr("transform", "translate(0," + height + ")")
          .call(xAxis);

      svg.append("g")
          .attr("class", "y axis")
          .call(yAxis)
        .append("text")
          .attr("transform", "rotate(-90)")
          .attr("y", 6)
          .attr("dy", ".71em")
          .style("text-anchor", "end")
          .text("Score");

      var day = svg.selectAll(".day")
          .data(data)
        .enter().append("g")
          .attr("class", "day")
          .attr("transform", function(d) {
            return "translate(" + x0(d.name) + ",0)";
          });

      day.selectAll("rect")
          .data(function(d) {
            return d.groups;
          })
        .enter().append("rect")
          .attr("width", x1.rangeBand())
          .attr("x", function(d) { return x1(d.name); })
          .attr("y", function(d) { return y(d.value); })
          .attr("height", function(d) { return height - y(d.value); })
          .style("fill", function(d) { return color(d.name); });

      var legend = svg.selectAll(".legend")
          .data(categories.slice().reverse())
        .enter().append("g")
          .attr("class", "legend")
          .attr("transform", function(d, i) { return "translate(0," + i * 20 + ")"; });

      legend.append("rect")
          .attr("x", width - 18)
          .attr("width", 18)
          .attr("height", 18)
          .style("fill", color);

      legend.append("text")
          .attr("x", width - 24)
          .attr("y", 9)
          .attr("dy", ".35em")
          .style("text-anchor", "end")
          .text(function(d) { return d; });
    },
    _update(){
      console.log("updating graph")
    }
  },

  render(){
    console.log("render")
    return (
      <div id="graph"></div>
    )
  }
});

ReactDOM.render(<App/>, document.getElementById('list'));