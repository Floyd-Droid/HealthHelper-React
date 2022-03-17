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

  getPage() {
    // Determine which components are rendered.
    let status = this.state.status;
    let result;
    switch (status) {
      case 'logs': case 'index':
        result = this.getIndexOrLogPage();
        break;
      case 'addLogEntry':
        result = this.getAddLogEntryPage();
        break;
      case 'addIndexEntry':
        result = this.getAddIndexEntryPage();
        break;
      default:
        // Show log for current date by default.
        result = this.getIndexOrLogPage('logs');
    }
    return result;
  }

  getIndexOrLogPage() {
    return (
      <div>
        <EntryDisplay
          status={this.state.status}
          date={this.state.date}
          userId={this.state.userId}/>
      </div>
    )
  }

  getAddLogEntryPage() {

    return (
      <div>
        Placeholder
      </div>
    )
  }

  getAddIndexEntryPage() {
    return (
      <div>
        Placeholder
      </div>
    )
  }
  
  render() {
    return (
      <div className="appContainer">
        {this.getPage()}
      </div>
    );
  }
}

export default App;