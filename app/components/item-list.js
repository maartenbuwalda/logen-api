import React from 'react';
import ReactDOM from 'react-dom';

class ItemList extends React.Component {

  constructor(props, context){
    super(props, context);
    // Get the list of items from the database
    this.getItemList();

    this.state = {
      tasks: this.props.tasks
    }
  }

  getItemList(){
    var self = this;
    var url = "http://localhost:8080/users/" + window.user.id + "/tasks"
    $.get(url,
      function(data){
        self.state.tasks = data;
        console.log(self.props)
        console.log(self.state)
      }
    )
  }

  render(){
    return (
      <div>test</div>
    )
  }
}

export default ItemList;