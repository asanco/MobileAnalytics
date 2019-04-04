import React, { Component } from 'react';
import './App.css';
import firebase from './firebase.js';
import { JsonToTable } from "react-json-to-table";
import {
  XAxis, YAxis, CartesianGrid, Tooltip, Legend, Bar, BarChart, ResponsiveContainer
} from 'recharts';
import Select from 'react-select';

class App extends Component {

  constructor(props) {

    super(props);
    this.state = {
    dropdownValue: 0,
    firebaseDataResults:{},
    firebaseDataProtocols:{},
    firebaseDataTests:{},
    firebaseDataPatients:{},
    shownDatabaseTable : {},
    graphData:[]
    };

    this.getResultsDatabase = this.getResultsDatabase.bind(this);
    this.getProtocolsDatabase = this.getProtocolsDatabase.bind(this);
    this.getTestsDatabase = this.getTestsDatabase.bind(this);
    this.getMostUsedProtocols = this.getMostUsedProtocols.bind(this);
    this.getTestWithMostSubtests = this.getTestWithMostSubtests.bind(this);
    this.getTestWithMostItems= this.getTestWithMostItems.bind(this);
    this.getProtocolWithMostTests= this.getProtocolWithMostTests.bind(this);
    this.handleDropdown = this.handleDropdown.bind(this);
}
  componentWillMount(){
    this.getResultsDatabase();
    this.getProtocolsDatabase();
    this.getTestsDatabase();
  }

  handleDropdown(event){
    var question = event.value;
    var dbTable = {};

    if(question === 1){
      dbTable = this.state.firebaseDataResults;
      this.getMostUsedProtocols();
    } else if (question === 2) {
      dbTable = this.state.firebaseDataResults;

    } else if (question === 3) {
      dbTable = this.state.firebaseDataResults;

    } else if (question === 4) {
      dbTable = this.state.firebaseDataResults;

    } else if (question === 5) {
      dbTable = this.state.firebaseDataResults;

    } else if (question === 6) {
      dbTable = this.state.firebaseDataResults;

    } else if (question === 7) {
      dbTable = this.state.firebaseDataProtocols;
      this.getProtocolWithMostTests();

    } else if (question === 8) {
      dbTable = this.state.firebaseDataTests;
      this.getTestWithMostItems();
    } else if (question === 9) {
      dbTable = this.state.firebaseDataTests;
      this.getTestWithMostSubtests();
    } else if (question === 10) {
      dbTable = this.state.firebaseDataTests;
      this.getTestWithMostSubtests();
    } else{

    }

    this.setState({
      dropdownValue:question,
      shownDatabaseTable: dbTable
      })
  }

  getResultsDatabase = () => {
    firebase.database().ref('resultados/').once('value', function (snap){
    var data = JSON.parse(JSON.stringify(snap.val()));

    this.setState({
      firebaseDataResults:data
      })
    }.bind(this));
  }

  getProtocolsDatabase = () => {
    firebase.database().ref('protocolos/').once('value', function (snap){
    var data = JSON.parse(JSON.stringify(snap.val()));

    this.setState({
      firebaseDataProtocols:data
      })
    }.bind(this));
  }

  getTestsDatabase = () => {
    firebase.database().ref('tests/').once('value', function (snap){
    var data = JSON.parse(JSON.stringify(snap.val()));

    this.setState({
      firebaseDataTests:data
      })
    }.bind(this));
  }

  getMostUsedProtocols (){
    var data = Object.values(this.state.firebaseDataResults);
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
    var data = Object.values(this.state.firebaseDataTests);
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

  getTestWithMostItems (){
    var data = Object.values(this.state.firebaseDataTests);
    var testData = {};
    var newData = [];

    for(var i = 0; i<data.length; i++){
      var itemsPorTest = 0;

        var subtests = Object.values(data[i].Bloques);
        for(var j = 0; j<subtests.length; j++){
          if(subtests[j].hasOwnProperty("Bloques")){
          itemsPorTest += Object.values(subtests[j].Bloques).length;
        }
      }
      testData = {
        "id" : data[i].nombre,
        "value" : itemsPorTest
      };
      newData.push(testData);
    }
    this.setState({
      graphData:newData
    })
  }

  getProtocolWithMostTests (){
    var data = Object.values(this.state.firebaseDataProtocols);
    console.log(data);
    var protocolData = {};
    var newData = [];

    for(var i = 0; i<data.length; i++){
      var numTests = 0;
      if(data[i].hasOwnProperty("Tests")){
        numTests += Object.values(data[i].Tests).length;
      }
      protocolData = {
        "id" : data[i].nombre,
        "value" : numTests
      };
      newData.push(protocolData);
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
      { label: "¿Cuál es el test con más o con menos ítems?", value: 8 },
      { label: "¿Cuál es el test con más o con menos subtests?", value: 9 },
      { label: "¿Cuál es el subtest con más o con menos items?", value: 10 },
    ];

    return (
      <div className="App">
        <div className ="navBar">
          PsychoTest
        </div>

        <Select options={ preguntasAnalitica } onChange={this.handleDropdown}/>

          <div className ="row mainWindow">
            <div className = "col-md-4 tablaFireBase">
              <JsonToTable json={this.state.shownDatabaseTable} />
            </div>
            <div className = "col-md-8 graficas">

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
