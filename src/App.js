import React, { Component } from 'react';
import logo from './logo.svg';
import './App.css';
import firebase from './firebase.js';
import { JsonToTable } from "react-json-to-table";

class App extends Component {

  constructor(props) {
      super(props);
      this.state = {
      firebaseData:{
    "Student": { name: "Jack", email: "jack@xyz.com" },
    "Student id": 888,
    "Sponsors": [
      { name: "john", email: "john@@xyz.com" },
      { name: "jane", email: "jane@@xyz.com" }
                ]
              }
            };
    this.getDatabase = this.getDatabase.bind(this);
}

  getDatabase = () => {
    firebase.database().ref('resultados/').once('value', function (snap){
    var data = JSON.stringify(snap.val());
    console.log(data);
    this.setState({
      firebaseData:data
      })
    return data;
    });
  }

  render() {
    return (
      <div className="App">
          <button onClick={this.getDatabase}>Update data</button>
          <JsonToTable json={this.state.firebaseData} />
      </div>
    );
  }
}

export default App;
