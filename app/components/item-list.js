import React from 'react';
import ReactDOM from 'react-dom';

class ItemList extends React.Component {

  constructor(props, context){
    super(props, context);

    this.getItemList();

    this.state = {

    };
  }

  getItemList(){
    var url = "http://localhost:8080/tasks/" + window.user.id;

    $.get(url,
      function(data){
        this.state = data;
        console.log(this.state)
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