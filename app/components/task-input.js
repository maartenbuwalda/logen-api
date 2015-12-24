import React from 'react';
import ReactDOM from 'react-dom';
import moment from 'moment';

class TaskInput extends React.Component {

  constructor(props, context){
    super(props, context);
    this._addItem = this._addItem.bind(this);
    this._update  = this._update.bind(this);

    this.state = {
      user_id: window.user.id,
      name: "",
      description: "",
      importance: "",
      time_created: moment().format(),
    };
  }

  _update(){
    this.setState({
      name: this.refs.name.value,
      description: this.refs.description.value,
      importance: this.refs.importance.value,
    })
  }

  _addItem(e){
    var self = this;
    if (e.which === 13) {

      var data = this.state;
      var url = "http://localhost:8080/tasks"

      $.post(url, data,
        function(data){
          self.props.tasks.push(data)
          console.log(self.props.tasks)
        }
      )
    }
  }

  render() {
    return (
      <div>
        <input
          type="text"
          ref="name"
          onChange={this._update}
          value={this.state.name}
          placeholder="Name"
          onKeyDown={this._addItem}
          required
        />
        <input
          type="text"
          ref="description"
          onChange={this._update}
          value={this.state.description}
          placeholder="Description"
          onKeyDown={this._addItem}
          required
        />
        <input
          type="number"
          ref="importance"
          onChange={this._update}
          value={this.state.importance}
          placeholder="Importance"
          onKeyDown={this._addItem}
          required
        />
      </div>
    )
  }
}


export default TaskInput;