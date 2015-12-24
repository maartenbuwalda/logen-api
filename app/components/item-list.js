import React from 'react';
import ReactDOM from 'react-dom';

class ItemList extends React.Component {

  constructor(props, context){
    super(props, context);

    this.state = {
      tasks: this.props.tasks
    }
  }

  render(){
    // console.log(this.props.tasks.map)
    return (
      <ul>
        {this.props.tasks.map(function(listValue){
          return <li>{listValue.name}</li>;
        })}
      </ul>
    )
  }
}

export default ItemList;