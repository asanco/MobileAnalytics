import React, { Component } from 'react';
import './App.css';
import firebase from './firebase.js';
import { JsonToTable } from "react-json-to-table";
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, Bar, BarChart, ResponsiveContainer
} from 'recharts';
import Select from 'react-select';

class App extends Component {

  constructor(props) {


      super(props);
      this.state = {
      firebaseData:{},
      graphData:[]
            };
    this.getResultsDatabase = this.getResultsDatabase.bind(this);
    this.getTestsDatabase = this.getTestsDatabase.bind(this);
    this.getMostUsedProtocols = this.getMostUsedProtocols.bind(this);
    this.getTestWithMostSubtests = this.getTestWithMostSubtests.bind(this);
    this.handleDropdown = this.handleDropdown.bind(this);
}
  componentWillMount(){
    //this.getResultsDatabase();
    this.getTestsDatabase();
  }

  handleDropdown(value){

  }

  getResultsDatabase = () => {
    firebase.database().ref('resultados/').once('value', function (snap){
    var data = JSON.parse(JSON.stringify(snap.val()));

    this.setState({
      firebaseData:data
      })
    }.bind(this));
  }

  getTestsDatabase = () => {
    firebase.database().ref('tests/').once('value', function (snap){
    var data = JSON.parse(JSON.stringify(snap.val()));

    this.setState({
      firebaseData:data
      })
    }.bind(this));
  }

  getMostUsedProtocols (){
    var data = Object.values(this.state.firebaseData);
    var protocolData = {};
    var newData = [];
    var counts = data.reduce((p, c) => {
      var pId = c.idProtocolo;
      if (!p.hasOwnProperty(pId)) {
        p[pId] = 0;
      }
      p[pId]++;
      return p;
    }, {});

    var countsArray = Object.entries(counts);
    for(var i = 0; i<countsArray.length; i++){
      protocolData = {
        "id" : countsArray[i][0],
        "value" : countsArray[i][1]
      };
      newData.push(protocolData);
    }
    this.setState({
      graphData:newData
    })
  }

  getTestWithMostSubtests (){
    var data = Object.values(this.state.firebaseData);
    console.log(data);
    var testData = {};
    var newData = [];

    for(var i = 0; i<data.length; i++){
      testData = {
        "id" : data[i].nombre,
        "value" : Object.values(data[i].Bloques).length
      };
      newData.push(testData);
    }

    this.setState({
      graphData:newData
    })
}


  render() {

    const preguntasAnalitica = [
      { label: "Select...", value: 0 },
      { label: "¿Cuál es el protocolo de pruebas más aplicado?", value: 1 },
      { label: "¿Cuál es el test más utilizado en las pruebas?", value: 2 },
      { label: "¿Cuál es el examinado que más protocolos ha presentado?", value: 3 },
      { label: "¿Qué cantidad de protocolos ha presentado cierto examinado?", value: 4 },
      { label: "¿Cuál es el promedio de puntaje para cierto ítem?", value: 5 },
      { label: "¿Cuál es el protocolo más aplicado a examinados entre cierto rango de edad?", value: 6 },
      { label: "¿Cuál es el protocolo más largo o más corto (según el número de tests)?", value: 7 },
      { label: "¿Qué cantidad de protocolos ha presentado cierto examinado?", value: 8 },
      { label: "¿Cuál es el test con más o con menos ítems?", value: 9 },
      { label: "¿Cuál es el test con más o con menos subtests?", value: 10 },
    ];

    return (
      <div className="App">
        <div className ="navBar">
          PsychoTest
        </div>

        <Select options={ preguntasAnalitica } />

          <div className ="row mainWindow">
            <div className = "col-md-4 tablaFireBase">
              <JsonToTable json={this.state.firebaseData} />
            </div>
            <div className = "col-md-8 graficas">
              <button onClick={this.getTestWithMostSubtests}>Get Data</button>

            <div style={{ width: '100%', height: '70vh' }}>
            <ResponsiveContainer>
              <BarChart
                data={this.state.graphData}
                margin={{
                  top: 5, right: 5, left: 5, bottom: 5,
                }}
                >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="id" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="value" fill="#8884d8" />
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
