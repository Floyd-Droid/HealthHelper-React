import React, { Component } from 'react';
import './App.css';
import EntryDisplay from './components/EntryDisplay.js';


class App extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      status: 'logs', // Determines the page rendered
      userId: 1, // Hard-code for now
      date: new Date()
    };
  }
  
  render() {
    return (
      <EntryDisplay 
        status={this.state.status}
        date={this.state.date}
        userId={this.state.userId}/>
    )
  }
}

export default App;