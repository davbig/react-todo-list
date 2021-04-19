import db from './services/firebase';
import firebase from 'firebase/app';
import 'firebase/storage';

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

  onChange(e) {
    const file = e.target.files[0];
    const storage = firebase.storage();
    const uploadTask = storage.ref(`/images/${file.name}`).put(file);

    uploadTask.on('state_changed', (snapShot) => {
      //takes a snap shot of the process as it is happening
      console.log(snapShot)
    }, (err) => {
      //catches the errors
      console.log(err)
    }, () => {
      // gets the functions from storage refences the image storage in firebase by the children
      // gets the download url then sets the image from firebase as the value for the imgUrl key:
      storage.ref('images').child(file.name).getDownloadURL()
       .then(fireBaseUrl => {
          console.log(fireBaseUrl);
       })
    })
  }
  
  render() {
    return (
      <div className="app">
        <header><h1>TO-DO LIST</h1></header>
        <ul>{ this.state.items && this.state.items.map((value, key) => <li key={key} onClick={() => this.deleteItem(key)}>{value}</li>)}</ul>
        <footer>
          <form onSubmit={e => this.addItem(e)}>

            <input type="file" onChange={this.onChange} ></input>

            <input placeholder="new item" onChange={ e => this.handleChange(e.target.value) }></input>
            <button type="submit">ADD</button>
          </form>
        </footer>
      </div>
    )
  }
}