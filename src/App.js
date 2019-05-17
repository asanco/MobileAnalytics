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
    firebaseDataLobbies:{},
    shownDatabaseTable : {},
    graphData:[{
      "id" :0,
      "value" : 0
    }]
    };

    this.handleDropdown = this.handleDropdown.bind(this);
    this.getLobbiesDatabase = this.getLobbiesDatabase.bind(this);
    this.getPatientsDatabase = this.getPatientsDatabase.bind(this);
    this.getResultsDatabase = this.getResultsDatabase.bind(this);
    this.getProtocolsDatabase = this.getProtocolsDatabase.bind(this);
    this.getTestsDatabase = this.getTestsDatabase.bind(this);
    this.getMostUsedProtocols = this.getMostUsedProtocols.bind(this);
    this.getTestWithMostSubtests = this.getTestWithMostSubtests.bind(this);
    this.getTestWithMostItems= this.getTestWithMostItems.bind(this);
    this.getSubTestWithMostItems= this.getSubTestWithMostItems.bind(this);
    this.getProtocolWithMostTests= this.getProtocolWithMostTests.bind(this);
    this.getMostPatientWithMostProtocols= this.getMostPatientWithMostProtocols.bind(this);
    this.getMostTestsApplied= this.getMostTestsApplied.bind(this);
    this.getMostSubTestsApplied= this.getMostSubTestsApplied.bind(this);
    this.getExaminedEducation = this.getExaminedEducation.bind(this);
    this.getExaminedGender = this.getExaminedGender.bind(this);
    this.getExaminedAge = this.getExaminedAge.bind(this);
    this.getResultDates = this.getResultDates.bind(this);
    this.getActiveLobbies = this.getActiveLobbies.bind(this);
    this.getPatientWithMostProtocolsByDay = this.getPatientWithMostProtocolsByDay.bind(this);

}
  componentWillMount(){
    this.getResultsDatabase();
    this.getProtocolsDatabase();
    this.getTestsDatabase();
    this.getLobbiesDatabase();
    this.getPatientsDatabase();
  }

  handleDropdown(event){
    var question = event.value;
    var dbTable = {};

    if(question === 1){
      dbTable = this.state.firebaseDataResults;
      this.getMostUsedProtocols();
    } else if (question === 2) {
      dbTable = this.state.firebaseDataResults;
      this.getMostTestsApplied();
    } else if (question === 3) {
      dbTable = this.state.firebaseDataResults;
      this.getPatientWithMostProtocolsByDay();
    } else if (question === 4) {
      dbTable = this.state.firebaseDataResults;
      this.getMostPatientWithMostProtocols();
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
      this.getSubTestWithMostItems();
    }  else if (question === 11) {
      dbTable = this.state.firebaseDataResults;
      this.getMostSubTestsApplied();
    }   else if (question === 12) {
      dbTable = this.state.firebaseDataLobbies;
      this.getActiveLobbies();
    }   else if (question === 13) {
      dbTable = this.state.firebaseDataResults;
      this.getResultDates();
    }   else if (question === 14) {

    }   else if (question === 15) {

    }   else if (question === 16) {

    }   else if (question === 17) {
      dbTable = this.state.firebaseDataPatients;
      this.getExaminedAge();
    }   else if (question === 18) {
      dbTable = this.state.firebaseDataPatients;
      this.getExaminedGender();
    }   else if (question === 19) {
      dbTable = this.state.firebaseDataPatients;
      this.getExaminedEducation();
    }   else if (question === 20) {

    }


    this.setState({
      dropdownValue:question,
      shownDatabaseTable: dbTable
      })
  }

  getPatientsDatabase = () => {
    firebase.database().ref('pacientes/').once('value', function (snap){
    var data = JSON.parse(JSON.stringify(snap.val()));
    this.setState({
      firebaseDataPatients:data
      })
    }.bind(this));
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

  getLobbiesDatabase = () => {
    firebase.database().ref('lobbies/').once('value', function (snap){
    var data = JSON.parse(JSON.stringify(snap.val()));

    this.setState({
      firebaseDataLobbies:data
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
    console.log(data);
    for(var i = 0; i<data.length; i++){
      if(data[i].hasOwnProperty("Bloques")){
        testData = {
          "id" : data[i].nombre,
          "value" : Object.values(data[i].Bloques).length
        };
        newData.push(testData);
      }
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
      if(data[i].hasOwnProperty("Bloques")){
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
    }
    this.setState({
      graphData:newData
    })
  }

  getSubTestWithMostItems (){
    var data = Object.values(this.state.firebaseDataTests);
    var testData = {};
    var newData = [];

    for(var i = 0; i<data.length; i++){
      if(data[i].hasOwnProperty("Bloques")){
        var subtests = Object.values(data[i].Bloques);
        for(var j = 0; j<subtests.length; j++){
          if(subtests[j].hasOwnProperty("Bloques")){
          var itemsPorTest = 0;
          itemsPorTest += Object.values(subtests[j].Bloques).length;
          testData = {
            "id" : subtests[j].nombre,
            "value" : itemsPorTest
          };
          newData.push(testData);
        }
      }
      }
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
        "id" : data[i].name,
        "value" : numTests
      };
      newData.push(protocolData);
    }

    this.setState({
      graphData:newData
    })
  }

  getPatientWithMostProtocolsByDay (){
    var data = Object.values(this.state.firebaseDataResults);
    var protocolData = {};
    var newData = [];

    console.log(data);
    var counts = data.reduce((p, c) => {
      var pId = c.fecha;
      if (!p.hasOwnProperty(pId)) {
        p[pId] = 0;
      }
      p[pId]++;
      return p;
    }, {});

    console.log(counts);
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

  getMostPatientWithMostProtocols (){
    var data = Object.values(this.state.firebaseDataResults);
    var protocolData = {};
    var newData = [];

    console.log(data);
    var counts = data.reduce((p, c) => {
      var pId = c.idPaciente;
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

  getMostTestsApplied (){
    var data = Object.values(this.state.firebaseDataResults);
    var protocolData = {};
    var newData = [];
    var testsList = [];
    for(var i = 0; i<data.length;i++){
      if(data[i].hasOwnProperty("Bloques")){
        var test = Object.values(data[i].Bloques);
        for(var j = 0; j<test.length;j++){
          testsList.push(test[j]);
        }
      }
    }
    console.log(testsList);

    var counts = testsList.reduce((p, c) => {
      var pId = c.idTest;
      if (!p.hasOwnProperty(pId)) {
        p[pId] = 0;
      }
      p[pId]++;
      return p;
    }, {});

    var countsArray = Object.entries(counts);
    console.log(countsArray);
    for(i = 0; i<countsArray.length; i++){
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

  getMostSubTestsApplied (){
    var data = Object.values(this.state.firebaseDataResults);
    var protocolData = {};
    var newData = [];
    var subtestsList = [];
    for(var i = 0; i<data.length;i++){
      if(data[i].hasOwnProperty("Bloques")){
        var test = Object.values(data[i].Bloques);
        for(var j = 0; j<test.length;j++){
          subtestsList.push(test[j]);
        }
      }
    }
    console.log(subtestsList);

    var counts = subtestsList.reduce((p, c) => {
      var pId = c.idSubTest;
      if (!p.hasOwnProperty(pId)) {
        p[pId] = 0;
      }
      p[pId]++;
      return p;
    }, {});

    var countsArray = Object.entries(counts);
    console.log(countsArray);
    for(i = 0; i<countsArray.length; i++){
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

  getExaminedEducation(){
    var data = Object.values(this.state.firebaseDataPatients);
    var educationData = {};
    var newData = [];

    console.log(data);

    var counts = data.reduce((p, c) => {
      var pId = c.education;
      if (!p.hasOwnProperty(pId)) {
        p[pId] = 0;
      }
      p[pId]++;
      return p;
    }, {});
    var countsArray = Object.entries(counts);
    console.log(countsArray);
    for(var i = 0; i<countsArray.length; i++){
      educationData = {
        "id" : countsArray[i][0],
        "value" : countsArray[i][1]
      };
      newData.push(educationData);
    }

    this.setState({
      graphData:newData
    })
  }

  getExaminedGender(){
    var data = Object.values(this.state.firebaseDataPatients);
    var genderData = {};
    var newData = [];

    console.log(data);

    var counts = data.reduce((p, c) => {
      var pId = c.gender;
      if (!p.hasOwnProperty(pId)) {
        p[pId] = 0;
      }
      p[pId]++;
      return p;
    }, {});
    var countsArray = Object.entries(counts);
    console.log(countsArray);
    for(var i = 0; i<countsArray.length; i++){
      genderData = {
        "id" : countsArray[i][0],
        "value" : countsArray[i][1]
      };
      newData.push(genderData);
    }

    this.setState({
      graphData:newData
    })
  }

  getExaminedAge(){
    var data = Object.values(this.state.firebaseDataPatients);
    var ageData = {};
    var newData = [];

    console.log(data);

    var counts = data.reduce((p, c) => {
      var pId = c.birthdate;
      if (!p.hasOwnProperty(pId)) {
        p[pId] = 0;
      }
      p[pId]++;
      return p;
    }, {});
    var countsArray = Object.entries(counts);
    console.log(countsArray);
    for(var i = 0; i<countsArray.length; i++){
      var today = new Date();
      var birthDate = new Date(countsArray[i][0].slice(6,10));

      var age = today.getFullYear() - birthDate.getFullYear();
      var m = today.getMonth() - birthDate.getMonth();
      if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate()))
      {
          age--;
      }

      ageData = {
        "id" : age,
        "value" : countsArray[i][1]
      };
      newData.push(ageData);
    }
    this.setState({
      graphData:newData
    })
  }

  getResultDates(){
    var data = Object.values(this.state.firebaseDataResults);
    var dateData = {};
    var newData = [];

    console.log(data);

    var counts = data.reduce((p, c) => {
      var pId = c.fecha;
      if (!p.hasOwnProperty(pId)) {
        p[pId] = 0;
      }
      p[pId]++;
      return p;
    }, {});
    var countsArray = Object.entries(counts);
    console.log(countsArray);
    for(var i = 0; i<countsArray.length; i++){
      dateData = {
        "id" : countsArray[i][0],
        "value" : countsArray[i][1]
      };
      newData.push(dateData);
    }

    this.setState({
      graphData:newData
    })
  }

  getActiveLobbies(){
    var data = Object.values(this.state.firebaseDataLobbies);
    var activeLobbyData = {};
    var newData = [];
    var activeLobbies = 0;
    console.log(data);

    for(var i = 0; i<data.length; i++){
      if(data[i].hasOwnProperty("items")){
        var items = Object.values(data[i].items);
        for(var j = 0; items.length; j++){
          //if(items[j].hasOwnProperty("estado")){
            /*if(data[i].items[j].estado === "NO_RESPONDIDO"){
              activeLobbies++;
              return;
            }*/
          //  }
        }
      }
    }

    newData = [
    {"id" : "Activos", "value" : activeLobbies},
    {"id" : "Inactivos", "value" : data.length - activeLobbies}
    ]
    this.setState({
      graphData:newData
    })
  }

  render() {

    const preguntasAnalitica = [
      { label: "Select...", value: 0 },
      { label: "¿Cuál es el protocolo de pruebas más aplicado?", value: 1 },
      { label: "¿Cuál es el test más utilizado en las pruebas?", value: 2 },
      { label: "¿Cual es la frecuencia de protocolos realizados por fecha?", value: 3 },
      { label: "¿Qué cantidad de protocolos ha presentado cierto examinado?", value: 4 },
    //  { label: "¿Cuál es el promedio de puntaje para cierto ítem?", value: 5 },
    //  { label: "¿Cuál es el protocolo más aplicado a examinados entre cierto rango de edad?", value: 6 },
      { label: "¿Cuál es el protocolo más largo o más corto (según el número de tests)?", value: 7 },
      { label: "¿Cuál es el test con más o con menos ítems?", value: 8 },
      { label: "¿Cuál es el test con más o con menos subtests?", value: 9 },
      { label: "¿Cuál es el subtest con más o con menos items?", value: 10 },
      { label: "¿Cuál es el subtest más utilizado en las pruebas?", value: 11 },
      //{ label: "¿Cuantos lobbies están activos en tiempo real?", value: 12 },
      { label: "¿Cuales son los días que más se aplican protocolos?", value: 13 },
    //  { label: "¿Qué tanto se ha realizado de un protocolo aplicado en un lobby?", value: 14 },
      //{ label: "¿Cual es el tiempo de realización de un lobby?", value: 15 },
      //{ label: "¿Que tantos elementos son visibles o invisibles para el examinado en un cierto test?", value: 16 },
      { label: "¿Cual es la edad promedio de los examinados que usan la aplicación?", value: 17 },
      { label: "¿Cual es la proporción de hombres/mujeres que usan la aplicación?", value: 18 },
      { label: "¿Cual es la proporción de nivel de educación de los examinados que usan la aplicación?", value: 19 },
    //  { label: "¿Cual es la proporción de mensajes/items por test?", value: 20 }
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

            <div style={{ width: '100%', height: '75vh' }}>
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
