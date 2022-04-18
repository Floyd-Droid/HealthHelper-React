import React from 'react';
import './App.css';
import './index.css'

import LogTable from './components/LogTable';
import IndexTable from './components/IndexTable';


class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      status: 'logs',
      userId: 1,
      date: new Date(),
    };

    this.updateStatus = this.updateStatus.bind(this);
  }

  updateStatus(newStatus) {
    this.setState({
      status: newStatus
    });
  }
  
  render() {
    return (
      <div className="app-container p-3">
        {this.state.status === 'logs' &&
          <div>
            <LogTable
              userId={this.state.userId}
              date={this.state.date} 
              onNavSubmit={this.updateStatus}
            />
        </div>}
        {this.state.status === 'index' &&
          <div>
            <IndexTable
              userId={this.state.userId}
              onNavSubmit={this.updateStatus}
            />
        </div>}
      </div>
    );
  }
}

export default App;