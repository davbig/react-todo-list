import db from './services/firebase';
import React, { Component } from 'react'

export default class App extends Component {

  constructor(props){
    super(props);
    this.state = {
      items: [],
      newItem: {},
    }
  }

  componentDidMount() {
    db.collection('items').get().then(res => {
      res.docs.forEach(item=>{
        this.setState({ 
          items: [...this.state.items, item.data().name]
        })
      })
    })
  }

  addItem(e) {
    e.preventDefault(); 
    console.log(this.state.newItem);
    // return;

    
    // const value = e.target[0].value;
    e.target.reset(); 

    if (this.state.newItem === '') return;

    db.collection('items').add(this.state.newItem);

    this.setState({ 
      items: [...this.state.items, this.state.newItem],
      newItem: {}
    });
  }

  handleChange(key, value) {
    const newItem = this.state.newItem;
    newItem[key] = value;

    this.setState({ newItem });
  }

  deleteItem(value) {
    db.collection('items').where("name", "==", value).get()
    .then(res => {
        res.docs[0].ref.delete();
        this.setState({
          items: this.state.items.filter(item => item !== value)
        })
    });
  } 
  
  render() {
    return (
      <div className="app">
        <header><h1>TO-DO LIST</h1></header>
        <ul>{ this.state.items && this.state.items.map((value, key) => <li key={key} onClick={() => this.deleteItem(value)}>{value}</li>)}</ul>
        <footer>
          <form onSubmit={e => this.addItem(e)}>
            <input placeholder="name" onChange={ e => this.handleChange("name", e.target.value) }></input>
            <input placeholder="color" onChange={ e => this.handleChange("color", e.target.value) }></input>
            <button type="submit">ADD</button>
          </form>
        </footer>
      </div>
    )
  }
}