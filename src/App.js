import React from 'react';
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

    this.getAddIndexPage = this.getAddIndexPage.bind(this);
    this.getPage = this.getPage.bind(this);
    this.getTablePage = this.getTablePage.bind(this);
    this.updateStatus = this.updateStatus.bind(this);
  }

  getPage() {
    // Determine which components are rendered.
    let status = this.state.status;
    let result;
    switch (status) {
      case 'logs': case 'index': case 'addLog':
        result = this.getTablePage();
        break;
      case 'addIndex':
        result = this.getAddIndexPage();
        break;
      default:
        // Show log for current date by default.
        result = this.getTablePage();
    }
    return result;
  }

  getTablePage() {
    return (
      <div>
        <EntryDisplay
          status={this.state.status}
          date={this.state.date}
          userId={this.state.userId}
          onNavFormSubmit={this.updateStatus}
        />
      </div>
    )
  }

  getAddIndexPage() {
    return (
      <div>
        Placeholder
      </div>
    )
  }

  updateStatus(newStatus) {
    this.setState({
      status: newStatus
    });
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