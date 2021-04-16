import db from './services/firebase';

import React, { Component } from 'react'

export default class App extends Component {

  constructor(props){
    super(props);
    this.state = {
      items: []
    }
  }

  componentDidMount() {
    // db.on("value", func) setzt einen Listener auf die externe Datenbank. 
    // Immer wenn sich die Daten dort ändern, wird so automatisch unser State in der App aktualisiert. 
    // Dadurch ist unser State immer synchron zum Datenbestand in der externen DB.
    db.on("value", dbSnapshot => {
      const itemsFromDB = dbSnapshot.val();
      if (itemsFromDB && itemsFromDB.items) {
        this.setState({ items: itemsFromDB.items });
      }
    });
  }

  // componentDidUpdate ist ein React LifeCycleHook. Immer wenn sich der State ändert, wird diese Methode automatisch aufgerufen.
  // Wenn sich der State unserer App ändern, wird hiermit automatisch auch die externe Datenbank aktualisiert.
  componentDidUpdate(prevProps, prevState) {
    if (prevState.items.length !== this.state.items.length) {
      db.set(this.state);
    }
  }

  addItem(e) {
    e.preventDefault(); // verhindert Neuladen der Seite
    e.target.reset(); // Input-Felder leeren
    if (this.state.newItem === '') return;

    this.setState({ 
      items: [...this.state.items, this.state.newItem], // Neues Item wird dem State hinzugefügt
      newItem: ''
    });
  }

  handleChange(value) {
    this.setState({ newItem: value });
  }

  deleteItem(key) {
    this.setState({
      items: this.state.items.filter((item, index) => index !== key) // Item wird aus State entfernt
    })
  } 
  
  render() {
    return (
      <div className="app">
        <header><h1>TO-DO LIST</h1></header>
        <ul>{ this.state.items && this.state.items.map((value, key) => <li key={key} onClick={() => this.deleteItem(key)}>{value}</li>)}</ul>
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