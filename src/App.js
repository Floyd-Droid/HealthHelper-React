import React from 'react';
import './index.css'

import CreateLogTable from './components/CreateLogTable';
import IndexTable from './components/IndexTable';
import LogTable from './components/LogTable';


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
      <div className='app-container vw-100 vh-100 p-3' >
        {this.state.status === 'logs' &&
          <LogTable
            userId={this.state.userId}
            date={this.state.date} 
            onNavSubmit={this.updateStatus}
          />
        }
        {this.state.status === 'index' &&
          <IndexTable
            userId={this.state.userId}
            onNavSubmit={this.updateStatus}
          />
        }
        {this.state.status === 'addLog' &&
          <CreateLogTable
            userId={this.state.userId}
            date={this.state.date}
            onNavSubmit={this.updateStatus}
          />
        }
      </div>
    );
  }
}

export default App;