import React, { Component } from 'react';
import './App.css';
import firebase from './firebase.js';
import { JsonToTable } from "react-json-to-table";
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, Bar, BarChart, ResponsiveContainer
} from 'recharts';

class App extends Component {

  constructor(props) {
      super(props);
      this.state = {
      firebaseData:{},
      protocolData:[]
            };
    this.getDatabase = this.getDatabase.bind(this);
    this.getProtocolData = this.getProtocolData.bind(this);
}
  componentWillMount(){
    this.getDatabase();
  }

  getDatabase = () => {
    firebase.database().ref('resultados/').once('value', function (snap){
    var data = JSON.parse(JSON.stringify(snap.val()));

    this.setState({
      firebaseData:data
    })
    console.log(this.state.firebaseData);
  }.bind(this));
  }

  getProtocolData (){
    var data = Object.values(this.state.firebaseData);
    var newData = [];
    var protocolData = {};

    for(var i = 0; i<data.length; i++){
      protocolData = {
        "id" : data[i].idProtocolo,
        "bloques" : Object.keys(data[i].Bloques).length
      };
      newData.push(protocolData);
    }
    console.log(data);
    console.log(newData);
    this.setState({
      protocolData:newData
    })

  }

  render() {
    return (
      <div className="App">
        <div className ="navBar">
          PsychoTest
        </div>
          <div className ="row mainWindow">
            <div className = "col-md-4 tablaFireBase">
              <JsonToTable json={this.state.firebaseData} />
            </div>
            <div className = "col-md-8 graficas">
              <button onClick={this.getProtocolData}>Get Data</button>

            <div style={{ width: '100%', height: 300 }}>
            <ResponsiveContainer>
              <BarChart
                data={this.state.protocolData}
                margin={{
                  top: 5, right: 5, left: 5, bottom: 5,
                }}
                >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="id" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="bloques" fill="#8884d8" />
              </BarChart>
            </ResponsiveContainer>
          </div>
            </div>
          </div>

      </div>
    );
  }
}

export default App;
