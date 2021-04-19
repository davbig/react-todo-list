import db from './services/firebase';

import React, { Component } from 'react'

export default class App extends Component {

  constructor(props){
    super(props);
    this.state = {
      items: []
    }
  }

  // Diese Methode wird nur EINMAL aufgerufen (automatisch zu Beginn der App)
  componentDidMount() {
    // Auslesen der Daten aus dem firestore
    db.collection('items').get().then(res => {
      res.docs.forEach(item=>{
        this.setState({ // Daten aus dem firestore werden dem State hinzugefügt
          items: [...this.state.items, item.data().name]
        })
      })
    })
  }

  // Diese Methode wird beim Abschicken des Formulars ausgeführt
  addItem(e) {
    e.preventDefault(); // verhindert Neuladen der Seite
    e.target.reset(); // Input-Felder leeren
    if (this.state.newItem === '') return; // Falls es kein newItem im State gibt => Abbruch hier!

    // Hinzufügen des neuen items in den firestore
    db.collection('items').add({
        name: this.state.newItem
    });

    // ...und in den lokalen State unserer React App
    this.setState({ 
      items: [...this.state.items, this.state.newItem], // Neues Item wird dem State hinzugefügt
      newItem: ''
    });
  }

  handleChange(value) {
    this.setState({ newItem: value });
  }

  deleteItem(value) {
    db.collection('items').where("name", "==", value).get()
    .then(querySnapshot => {
        querySnapshot.docs[0].ref.delete(); // Item wird aus dem firestore gelöscht
        this.setState({
          items: this.state.items.filter(item => item !== value) // Item wird aus State entfernt
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
            <input placeholder="new item" onChange={ e => this.handleChange(e.target.value) }></input>
            <button type="submit">ADD</button>
          </form>
        </footer>
      </div>
    )
  }
}